"""
Payment bookkeeping shared by the checkout verify endpoints and the admin Razorpay sync,
plus the unified list of every payment (donations, membership fees, matrimonial fees)
behind the admin Transactions page and finance dashboard.
"""
from datetime import timedelta
from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from . import razorpay
from .models import Donation, MatrimonialProfile, MembershipApplication, User

# Unified statuses shown to admins
SUCCESS, INITIATED, PENDING, FAILED, REFUNDED = 'Success', 'Initiated', 'Pending', 'Failed', 'Refunded'
TYPES = ('Donation', 'Membership', 'Matrimonial')


class PaymentConflict(Exception):
    """The fee was paid but the account can't be created (the phone number got registered meanwhile)."""


# --- Marking payments paid / failed ---

def complete_donation(donation, payment_id):
    if donation.status == 'Completed':
        return donation
    donation.status = 'Completed'
    donation.razorpay_payment_id = payment_id
    donation.transaction_ref = payment_id
    donation.save(update_fields=['status', 'razorpay_payment_id', 'transaction_ref', 'updated_at'])
    return donation


def complete_membership(application, payment_id):
    """Marks the fee paid and creates the member's account (once). Returns (application, user)."""
    with transaction.atomic():
        application = MembershipApplication.objects.select_for_update().get(pk=application.pk)
        if application.status != 'Paid':
            application.status = 'Paid'
            application.razorpay_payment_id = payment_id
            application.paid_at = timezone.now()
            application.save(update_fields=['status', 'razorpay_payment_id', 'paid_at'])

        user = application.user
        if not user:
            if User.objects.filter(phone=application.phone).exists():
                raise PaymentConflict(application.phone)
            user = User.objects.create_user(phone=application.phone, name=application.name, is_member=True)
            application.user = user
            application.save(update_fields=['user'])
    return application, user


def complete_matrimonial(profile, payment_id):
    if profile.is_active:
        return profile
    profile.is_active = True
    profile.amount_paid = MatrimonialProfile.FEES[profile.gender]
    profile.razorpay_payment_id = payment_id
    profile.paid_at = timezone.now()
    profile.save(update_fields=['is_active', 'amount_paid', 'razorpay_payment_id', 'paid_at'])
    return profile


def _fail(obj, payment, fields):
    obj.razorpay_payment_id = payment.get('id', '')
    if hasattr(obj, 'notes'):
        obj.notes = payment.get('error_description') or 'Payment failed'
        fields = [*fields, 'notes']
    obj.save(update_fields=['razorpay_payment_id', *fields])


def fail_payment(obj, payment):
    """Records a failed Razorpay attempt. A later successful retry on the same order still completes it."""
    if isinstance(obj, Donation):
        obj.status = 'Failed'
        _fail(obj, payment, ['status', 'updated_at'])
    elif isinstance(obj, MembershipApplication):
        obj.status = 'Failed'
        _fail(obj, payment, ['status'])
    else:
        # Matrimonial profiles stay inactive; a payment id on an inactive profile means it failed
        _fail(obj, payment, [])


# --- Unified transaction list ---

DONATION_STATUS = {'Completed': SUCCESS, 'Failed': FAILED, 'Refunded': REFUNDED}
PURPOSE_LABELS = dict(Donation.PURPOSE_CHOICES)


def _account(user):
    return {'id': user.id, 'name': user.name, 'phone': user.phone} if user else None


def _donation_row(d):
    if d.status == 'Pending':
        # Website donations open a Razorpay order; offline ones an admin records don't
        status = INITIATED if d.razorpay_order_id else PENDING
    else:
        status = DONATION_STATUS.get(d.status, d.status)
    return {
        'id': f'DON-{d.id}', 'object_id': d.id, 'type': 'Donation', 'status': status,
        'amount': d.amount, 'method': d.payment_method,
        'description': PURPOSE_LABELS.get(d.purpose, d.purpose),
        'name': d.name, 'phone': d.phone, 'email': d.email or '',
        'account': _account(d.user),
        'razorpay_order_id': d.razorpay_order_id, 'razorpay_payment_id': d.razorpay_payment_id,
        'reference': d.transaction_ref, 'notes': d.notes,
        'recorded_by': d.recorded_by.name if d.recorded_by else None,
        'details': {},
        'created_at': d.created_at,
        'completed_at': d.updated_at if status == SUCCESS else None,
    }


def _membership_row(a):
    status = {'Paid': SUCCESS, 'Failed': FAILED}.get(a.status, INITIATED)
    return {
        'id': f'MEM-{a.id}', 'object_id': a.id, 'type': 'Membership', 'status': status,
        'amount': a.amount, 'method': 'Online', 'description': 'Community membership fee',
        'name': a.name, 'phone': a.phone, 'email': '',
        # The account only exists once the fee is paid
        'account': _account(a.user),
        'razorpay_order_id': a.razorpay_order_id, 'razorpay_payment_id': a.razorpay_payment_id,
        'reference': '', 'notes': a.notes, 'recorded_by': None,
        'details': {'city': a.city, 'aadhaar': f'XXXX XXXX {a.aadhaar_number[-4:]}'},
        'created_at': a.created_at, 'completed_at': a.paid_at,
    }


def _matrimonial_row(p):
    if p.is_active:
        status = SUCCESS
    else:
        status = FAILED if p.razorpay_payment_id else INITIATED
    return {
        'id': f'MAT-{p.id}', 'object_id': p.id, 'type': 'Matrimonial', 'status': status,
        'amount': p.amount_paid or Decimal(MatrimonialProfile.FEES[p.gender]), 'method': 'Online',
        'description': f'Matrimonial profile fee ({p.gender})',
        'name': p.user.name, 'phone': p.user.phone, 'email': p.user.email or '',
        'account': _account(p.user),
        'razorpay_order_id': p.razorpay_order_id, 'razorpay_payment_id': p.razorpay_payment_id,
        'reference': '', 'notes': '', 'recorded_by': None,
        'details': {'gender': p.gender, 'city': p.city},
        'created_at': p.created_at, 'completed_at': p.paid_at,
    }


def all_transactions():
    """Every payment, newest first. Matrimonial profiles from before the fee aren't payments."""
    rows = [_donation_row(d) for d in Donation.objects.select_related('user', 'recorded_by')]
    rows += [_membership_row(a) for a in MembershipApplication.objects.select_related('user')]
    rows += [_matrimonial_row(p) for p in MatrimonialProfile.objects.select_related('user').exclude(razorpay_order_id='')]
    rows.sort(key=lambda r: r['created_at'], reverse=True)
    return rows


# --- Checking open orders with Razorpay ---

def _source_object(row):
    model = {'Donation': Donation, 'Membership': MembershipApplication, 'Matrimonial': MatrimonialProfile}[row['type']]
    return model.objects.get(pk=row['object_id'])


def sync_initiated(max_age_days=30, limit=50):
    """
    Asks Razorpay what happened to recent orders that never came back from Checkout
    (tab closed, network drop, failed card...) and records the outcome.
    """
    cutoff = timezone.now() - timedelta(days=max_age_days)
    candidates = [r for r in all_transactions()
                  if r['status'] == INITIATED and r['razorpay_order_id'] and r['created_at'] >= cutoff][:limit]
    result = {'checked': 0, 'completed': 0, 'failed': 0, 'unchanged': 0, 'errors': []}
    for row in candidates:
        result['checked'] += 1
        try:
            attempts = razorpay.order_payments(row['razorpay_order_id'])
        except razorpay.RazorpayError as exc:
            result['errors'].append(f"{row['id']}: {exc}")
            continue
        captured = next((p for p in attempts if p.get('status') == 'captured'), None)
        obj = _source_object(row)
        if captured:
            try:
                if row['type'] == 'Donation':
                    complete_donation(obj, captured['id'])
                elif row['type'] == 'Membership':
                    complete_membership(obj, captured['id'])
                else:
                    complete_matrimonial(obj, captured['id'])
                result['completed'] += 1
            except PaymentConflict:
                result['errors'].append(f"{row['id']}: paid, but {row['phone']} is already registered")
        elif attempts and all(p.get('status') == 'failed' for p in attempts):
            fail_payment(obj, attempts[0])
            result['failed'] += 1
        else:
            result['unchanged'] += 1
    return result
