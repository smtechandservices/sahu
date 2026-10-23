"""
Minimal Razorpay client: create an order, look up its payments, and verify the checkout signature. Talks to the REST API directly so we don't need the razorpay SDK.
"""
import hashlib
import hmac

import requests
from django.conf import settings

API_BASE = 'https://api.razorpay.com/v1'


class RazorpayError(Exception):
    pass


def is_configured():
    return bool(settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET)


def _request(method, path, **kwargs):
    try:
        res = requests.request(
            method, f'{API_BASE}{path}',
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET),
            timeout=15, **kwargs,
        )
    except requests.RequestException as exc:
        raise RazorpayError(f'Could not reach Razorpay: {exc}') from exc
    if res.status_code >= 400:
        try:
            detail = res.json().get('error', {}).get('description')
        except ValueError:
            detail = None
        raise RazorpayError(detail or f'Razorpay returned HTTP {res.status_code}')
    return res.json()


def create_order(amount_paise, receipt, notes=None):
    return _request('POST', '/orders', json={
        'amount': amount_paise,
        'currency': 'INR',
        'receipt': receipt,
        'notes': notes or {},
    })


def order_payments(order_id):
    """Every payment attempt made against an order (captured, failed, ...)."""
    return _request('GET', f'/orders/{order_id}/payments').get('items', [])


def verify_payment_signature(order_id, payment_id, signature):
    """Signature returned to the browser by Checkout after a successful payment."""
    if not settings.RAZORPAY_KEY_SECRET or not signature:
        return False
    expected = hmac.new(settings.RAZORPAY_KEY_SECRET.encode(), f'{order_id}|{payment_id}'.encode(),
                        hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
