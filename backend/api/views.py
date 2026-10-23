from rest_framework import status, viewsets, permissions, views, response
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes, throttle_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from django.db.models.functions import TruncMonth
from django.db.models import Count, Q, Sum
from django.http import HttpResponse, HttpResponseRedirect
from .models import (
    User, OTPRecord, Accommodation, Booking,
    JobListing, Advertisement, MatrimonialProfile, MatrimonialInterest,
    Article, Event, EventRegistration, SiteSettings,
    HeroCarouselImage, UserSession, Media, Donation, MembershipApplication
)
from .serializers import (
    UserSerializer, AdminUserSerializer, AccommodationSerializer, BookingSerializer,
    JobListingSerializer, AdvertisementSerializer,
    MatrimonialProfileSerializer, ArticleSerializer,
    EventSerializer, EventRegistrationSerializer, SiteSettingsSerializer,
    HeroCarouselImageSerializer, UserSessionSerializer, CustomTokenRefreshSerializer,
    MediaSerializer, DonationSerializer, AdminDonationSerializer, MembershipApplicationSerializer,
    matrimonial_receipt,
)
from .permissions import IsAdminOrReadOnly
from . import razorpay

def create_user_session(user, refresh, request):
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    device_name = 'Web Browser'
    if 'Mobile' in user_agent or 'Android' in user_agent or 'iPhone' in user_agent:
        device_name = 'Mobile Device'
        if 'iPhone' in user_agent:
            device_name = 'iPhone'
        elif 'Android' in user_agent:
            device_name = 'Android Device'
    elif 'iPad' in user_agent:
        device_name = 'iPad'
    elif 'Macintosh' in user_agent:
        device_name = 'Mac'
    elif 'Windows' in user_agent:
        device_name = 'Windows PC'
    elif 'Linux' in user_agent:
        device_name = 'Linux PC'

    ip_address = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR'))
    if ip_address:
        ip_address = ip_address.split(',')[0].strip()

    jti = refresh.payload.get('jti')

    # Expire sessions idle for more than 15 minutes before enforcing the device limit
    cutoff = timezone.now() - timedelta(minutes=15)
    UserSession.objects.filter(user=user, is_active=True, last_activity__lt=cutoff).update(is_active=False)

    # Max 2 device logins: raise ValidationError if there are 2 or more active sessions
    active_sessions = UserSession.objects.filter(user=user, is_active=True)
    if active_sessions.count() >= 5:
        raise ValidationError({'error': 'Maximum active session limit reached. You are already logged in from 5 devices. Please log out from another device first.'})


    UserSession.objects.create(
        user=user,
        refresh_jti=jti,
        device_name=device_name,
        ip_address=ip_address,
        is_active=True
    )


# --- Auth Views ---
@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    phone = request.data.get('phone')
    if not phone:
        return Response({'error': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)

    if not User.objects.filter(phone=phone).exists():
        return Response({'error': 'No account found with this number. Please register first.'}, status=status.HTTP_404_NOT_FOUND)

    record = OTPRecord.generate_otp(phone)
    print(f'[OTP] Phone: {phone} | Code: {record.code}')
    return Response({'message': 'OTP sent successfully'})

import os

DEV_OTP_ENABLED = os.environ.get('DEV_OTP_ENABLED', 'False').lower() == 'true'
DEV_OTP_CODE = os.environ.get('DEV_OTP_CODE', '')

def _is_dev_otp(code, phone):
    if not (DEV_OTP_ENABLED and DEV_OTP_CODE and code == DEV_OTP_CODE):
        return False
    # Never let the shared bypass code log in as an admin: an admin's OTP
    # token carries full admin rights over the API.
    return not User.objects.filter(phone=phone, is_admin=True).exists()

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    phone = request.data.get('phone')
    code = request.data.get('code')

    if not phone or not code:
        return Response({'error': 'Phone and code are required'}, status=status.HTTP_400_BAD_REQUEST)

    if not _is_dev_otp(code, phone):
        otp = OTPRecord.objects.filter(phone=phone, code=code, is_used=False).order_by('-created_at').first()
        if not otp:
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

        expiry = otp.created_at + timezone.timedelta(minutes=10)
        if timezone.now() > expiry:
            return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

        otp.is_used = True
        otp.save()

    try:
        user = User.objects.get(phone=phone)
    except User.DoesNotExist:
        return Response({'error': 'User not found. Please register first.'}, status=status.HTTP_404_NOT_FOUND)

    refresh = RefreshToken.for_user(user)
    refresh.access_token['refresh_jti'] = refresh.payload.get('jti')
    create_user_session(user, refresh, request)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': UserSerializer(user).data
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def send_register_otp(request):
    phone = request.data.get('phone')
    if not phone:
        return Response({'error': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(phone=phone).exists():
        return Response({'error': 'An account with this number already exists. Please login.'}, status=status.HTTP_400_BAD_REQUEST)

    record = OTPRecord.generate_otp(phone)
    print(f'[OTP] Phone: {phone} | Code: {record.code}')
    return Response({'message': 'OTP sent successfully'})


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_register_otp(request):
    """Validates OTP for an unregistered phone. Does not consume it — register() does that."""
    phone = request.data.get('phone')
    code = request.data.get('code')

    if not phone or not code:
        return Response({'error': 'Phone and code are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(phone=phone).exists():
        return Response({'error': 'An account with this number already exists. Please login.'}, status=status.HTTP_400_BAD_REQUEST)

    if not _is_dev_otp(code, phone):
        otp = OTPRecord.objects.filter(phone=phone, code=code, is_used=False).order_by('-created_at').first()
        if not otp:
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

        expiry = otp.created_at + timezone.timedelta(minutes=10)
        if timezone.now() > expiry:
            return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'message': 'OTP verified'})





class RegisterAnonThrottle(AnonRateThrottle):
    rate = '10/hour'


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([RegisterAnonThrottle])
def register(request):
    """
    Join page, after the OTP step. Saves the application (Aadhaar, KYC document, chosen fee)
    and opens a Razorpay order for the membership fee. The account itself is created by
    verify_membership_payment once the fee is paid.
    """
    phone = request.data.get('phone')
    code = request.data.get('code')

    if not phone or not code:
        return Response({'error': 'Phone and code are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(phone=phone).exists():
        return Response({'error': 'User with this phone already exists. Please login.'}, status=status.HTTP_400_BAD_REQUEST)

    otp = None
    if not _is_dev_otp(code, phone):
        otp = OTPRecord.objects.filter(phone=phone, code=code, is_used=False).order_by('-created_at').first()
        if not otp:
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

        expiry = otp.created_at + timezone.timedelta(minutes=10)
        if timezone.now() > expiry:
            return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

    if not razorpay.is_configured():
        return Response({'error': 'Online payments are not available right now. Please try again later.'},
                        status=status.HTTP_503_SERVICE_UNAVAILABLE)

    serializer = MembershipApplicationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    application = serializer.save()

    amount_paise = int(application.amount * 100)
    try:
        order = razorpay.create_order(
            amount_paise,
            receipt=f'membership_{application.id}',
            notes={'membership_application_id': str(application.id), 'phone': application.phone},
        )
    except razorpay.RazorpayError as exc:
        application.status = 'Failed'
        application.notes = str(exc)
        application.save(update_fields=['status', 'notes'])
        return Response({'error': 'Could not start the payment. Please try again.'},
                        status=status.HTTP_502_BAD_GATEWAY)

    application.razorpay_order_id = order['id']
    application.save(update_fields=['razorpay_order_id'])
    if otp:
        otp.is_used = True
        otp.save()

    return Response({
        'application': serializer.data,
        'razorpay': {
            'key_id': settings.RAZORPAY_KEY_ID,
            'order_id': order['id'],
            'amount': amount_paise,
            'currency': 'INR',
        },
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_membership_payment(request):
    """Checkout's success handler posts the signed payment here; this creates the member's account."""
    order_id = request.data.get('razorpay_order_id', '')
    payment_id = request.data.get('razorpay_payment_id', '')
    signature = request.data.get('razorpay_signature', '')
    if not razorpay.verify_payment_signature(order_id, payment_id, signature):
        return Response({'error': 'Payment could not be verified.'}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        application = MembershipApplication.objects.select_for_update().filter(razorpay_order_id=order_id).first()
        if not application:
            return Response({'error': 'Membership application not found.'}, status=status.HTTP_404_NOT_FOUND)

        if application.status != 'Paid':
            application.status = 'Paid'
            application.razorpay_payment_id = payment_id
            application.paid_at = timezone.now()
            application.save(update_fields=['status', 'razorpay_payment_id', 'paid_at'])

        user = application.user
        if not user:
            if User.objects.filter(phone=application.phone).exists():
                # Someone registered this number while the payment was in progress
                return Response({'error': f'This phone number is already registered. Please contact the Sabha with payment ID {payment_id}.'},
                                status=status.HTTP_409_CONFLICT)
            user = User.objects.create_user(phone=application.phone, name=application.name, is_member=True)
            application.user = user
            application.save(update_fields=['user'])

    refresh = RefreshToken.for_user(user)
    refresh.access_token['refresh_jti'] = refresh.payload.get('jti')
    create_user_session(user, refresh, request)

    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': UserSerializer(user).data,
        'application': MembershipApplicationSerializer(application).data,
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    phone = request.data.get('phone')
    password = request.data.get('password')
    if not phone or not password:
        return Response({'error': 'Phone and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    from django.contrib.auth import authenticate
    user = authenticate(username=phone, password=password)

    if user is not None:
        if not user.is_admin:
            return Response({'error': 'Access denied. Administrator privileges required.'}, status=status.HTTP_403_FORBIDDEN)

        UserSession.objects.filter(user=user, is_active=True).update(is_active=False)

        refresh = RefreshToken.for_user(user)
        refresh.access_token['refresh_jti'] = refresh.payload.get('jti')
        create_user_session(user, refresh, request)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        token = RefreshToken(refresh_token)
        jti = token.payload.get('jti')
        UserSession.objects.filter(refresh_jti=jti).update(is_active=False)
        return Response({'message': 'Logged out successfully'})
    except Exception as e:
        return Response({'error': 'Invalid or expired refresh token'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_membership(request):
    """The membership fee the user paid when joining, or null (e.g. accounts from before online joining)."""
    application = MembershipApplication.objects.filter(user=request.user, status='Paid').first()
    return Response({'membership': MembershipApplicationSerializer(application).data if application else None})

# --- User Management Views ---
class UserPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = UserPagination
    filter_backends = [SearchFilter]
    search_fields = ['name', 'phone', 'email']
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        if not getattr(self.request.user, 'is_admin', False):
            return User.objects.none()
        return User.objects.select_related('membership_application').order_by('-date_joined')

    @action(detail=True, methods=['get'])
    def sessions(self, request, pk=None):
        if not getattr(request.user, 'is_admin', False):
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = self.get_object()
        sessions = UserSession.objects.filter(user=user, is_active=True)
        serializer = UserSessionSerializer(sessions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='revoke-session')
    def revoke_session(self, request, pk=None):
        if not getattr(request.user, 'is_admin', False):
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = self.get_object()
        session_id = request.data.get('session_id')
        if not session_id:
            return Response({'error': 'session_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            session = UserSession.objects.get(id=session_id, user=user)
            session.is_active = False
            session.save()
            return Response({'message': 'Session revoked successfully'})
        except UserSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='revoke-all-sessions')
    def revoke_all_sessions(self, request, pk=None):
        if not getattr(request.user, 'is_admin', False):
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = self.get_object()
        UserSession.objects.filter(user=user).update(is_active=False)
        return Response({'message': 'All sessions revoked successfully'})

    def destroy(self, request, *args, **kwargs):
        if not getattr(request.user, 'is_admin', False):
            return Response(status=status.HTTP_403_FORBIDDEN)
        if self.get_object().pk == request.user.pk:
            return Response({'error': 'You cannot delete your own account.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)

# --- Donation Views ---
class DonationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class DonationAnonThrottle(AnonRateThrottle):
    # Donating doesn't need an account, so cap anonymous submissions per IP
    rate = '10/hour'


class DonationViewSet(viewsets.ModelViewSet):
    """
    Donors POST here from the Donate page, logged in or not; it's saved as Pending and becomes
    Completed once Razorpay confirms the payment. Admins see every donation and can update/delete them.
    """
    permission_classes = [IsAuthenticated]
    pagination_class = DonationPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'purpose', 'payment_method']
    search_fields = ['name', 'phone', 'email', 'transaction_ref']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']

    def _is_admin(self):
        return getattr(self.request.user, 'is_admin', False)

    def get_throttles(self):
        if self.action == 'create':
            return [DonationAnonThrottle()]
        return super().get_throttles()

    def get_serializer_class(self):
        return AdminDonationSerializer if self._is_admin() else DonationSerializer

    def get_queryset(self):
        qs = Donation.objects.select_related('user', 'recorded_by')
        if not self._is_admin():
            # Their own donations plus any made with their (OTP-verified) number while logged out
            user = self.request.user
            return qs.filter(Q(user=user) | Q(phone=user.phone[-10:]))
        # Optional date range: ?from=YYYY-MM-DD&to=YYYY-MM-DD
        date_from = self.request.query_params.get('from')
        date_to = self.request.query_params.get('to')
        if date_from:
            qs = qs.filter(created_at__date__gte=date_from)
        if date_to:
            qs = qs.filter(created_at__date__lte=date_to)
        return qs

    def check_permissions(self, request):
        super().check_permissions(request)
        # Donors may only create, pay and view their own; everything else is admin-only
        if self.action not in ('create', 'verify', 'list', 'retrieve') and not self._is_admin():
            self.permission_denied(request, message='Administrator privileges required.')

    def get_permissions(self):
        if self.action in ('create', 'verify'):
            return [AllowAny()]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        # Website donations are paid through Razorpay: save a Pending donation, open an order
        # for it and hand the order to the browser for Checkout
        if not razorpay.is_configured():
            return Response({'error': 'Online donations are not available right now. Please try again later.'},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.validated_data['amount'] < 1:
            return Response({'error': 'The minimum online donation is ₹1.'}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user if request.user.is_authenticated else None
        # Even when an admin donates, the fields only an admin may set are reset
        donation = serializer.save(user=user, status='Pending', payment_method='Online',
                                   transaction_ref='', notes='')
        amount_paise = int(donation.amount * 100)
        try:
            order = razorpay.create_order(
                amount_paise,
                receipt=f'donation_{donation.id}',
                notes={'donation_id': str(donation.id), 'purpose': donation.purpose},
            )
        except razorpay.RazorpayError as exc:
            donation.status = 'Failed'
            donation.notes = str(exc)
            donation.save(update_fields=['status', 'notes', 'updated_at'])
            return Response({'error': 'Could not start the payment. Please try again.'},
                            status=status.HTTP_502_BAD_GATEWAY)
        donation.razorpay_order_id = order['id']
        donation.save(update_fields=['razorpay_order_id', 'updated_at'])
        return Response({
            **serializer.data,
            'razorpay': {
                'key_id': settings.RAZORPAY_KEY_ID,
                'order_id': order['id'],
                'amount': amount_paise,
                'currency': 'INR',
            },
        }, status=status.HTTP_201_CREATED)

    def _mark_paid(self, donation, payment_id):
        if donation.status == 'Completed':
            return
        donation.status = 'Completed'
        donation.razorpay_payment_id = payment_id
        donation.transaction_ref = payment_id
        donation.save(update_fields=['status', 'razorpay_payment_id', 'transaction_ref', 'updated_at'])

    @action(detail=False, methods=['post'])
    def verify(self, request):
        """Checkout's success handler posts the signed payment here to confirm the donation."""
        order_id = request.data.get('razorpay_order_id', '')
        payment_id = request.data.get('razorpay_payment_id', '')
        signature = request.data.get('razorpay_signature', '')
        if not razorpay.verify_payment_signature(order_id, payment_id, signature):
            return Response({'error': 'Payment could not be verified.'}, status=status.HTTP_400_BAD_REQUEST)
        donation = Donation.objects.filter(razorpay_order_id=order_id).first()
        if not donation:
            return Response({'error': 'Donation not found.'}, status=status.HTTP_404_NOT_FOUND)
        self._mark_paid(donation, payment_id)
        return Response(DonationSerializer(donation).data)

    @action(detail=False, methods=['post'])
    def record(self, request):
        """Admin records an offline donation (cash, cheque, bank transfer...)."""
        if not self._is_admin():
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = AdminDonationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        donor = User.objects.filter(phone=serializer.validated_data['phone']).first()
        serializer.save(user=donor, recorded_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        if not self._is_admin():
            return Response(status=status.HTTP_403_FORBIDDEN)

        completed = Donation.objects.filter(status='Completed')
        pending = Donation.objects.filter(status='Pending')
        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        def total(qs):
            return qs.aggregate(s=Sum('amount'))['s'] or 0

        by_purpose = {
            r['purpose']: {'total': r['total'], 'count': r['count']}
            for r in completed.values('purpose').annotate(total=Sum('amount'), count=Count('id'))
        }

        # Last 6 calendar months, oldest first
        months = []
        y, m = now.year, now.month
        for _ in range(6):
            months.append((y, m))
            y, m = (y - 1, 12) if m == 1 else (y, m - 1)
        months.reverse()
        monthly_map = {
            (r['month'].year, r['month'].month): r['total']
            for r in completed.filter(created_at__gte=timezone.datetime(months[0][0], months[0][1], 1, tzinfo=now.tzinfo))
            .annotate(month=TruncMonth('created_at')).values('month').annotate(total=Sum('amount'))
        }

        completed_count = completed.count()
        total_received = total(completed)
        return Response({
            'total_received': total_received,
            'received_this_month': total(completed.filter(created_at__gte=month_start)),
            'completed_count': completed_count,
            'average_donation': round(total_received / completed_count, 2) if completed_count else 0,
            'donor_count': completed.values('phone').distinct().count(),
            'pending_count': pending.count(),
            'pending_amount': total(pending),
            'status_counts': dict(Donation.objects.values_list('status').annotate(c=Count('id'))),
            'by_purpose': [
                {'purpose': key, 'label': label, **by_purpose.get(key, {'total': 0, 'count': 0})}
                for key, label in Donation.PURPOSE_CHOICES
            ],
            'monthly': [
                {'name': timezone.datetime(y, m, 1).strftime('%b'), 'total': monthly_map.get((y, m), 0)}
                for y, m in months
            ],
        })

    @action(detail=False, methods=['get'])
    def export(self, request):
        """CSV of donations matching the current filters."""
        if not self._is_admin():
            return Response(status=status.HTTP_403_FORBIDDEN)
        import csv
        qs = self.filter_queryset(self.get_queryset())
        resp = HttpResponse(content_type='text/csv')
        resp['Content-Disposition'] = f'attachment; filename="donations-{timezone.now():%Y-%m-%d}.csv"'
        writer = csv.writer(resp)
        writer.writerow(['ID', 'Date', 'Name', 'Phone', 'Email', 'Amount', 'Purpose', 'Payment Method',
                         'Status', 'Transaction Ref', 'Notes', 'Recorded By'])
        for d in qs:
            writer.writerow([
                d.id, timezone.localtime(d.created_at).strftime('%Y-%m-%d %H:%M'), d.name, d.phone, d.email or '',
                d.amount, d.get_purpose_display(), d.payment_method, d.status, d.transaction_ref, d.notes,
                d.recorded_by.name if d.recorded_by else '',
            ])
        return resp


# --- Accommodation Views ---
class AccommodationViewSet(viewsets.ModelViewSet):
    serializer_class = AccommodationSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['type', 'location']
    search_fields = ['title', 'location', 'description']

    def get_queryset(self):
        if self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False):
            return Accommodation.objects.all().order_by('-created_at')
        return Accommodation.objects.filter(is_active=True).order_by('-created_at')

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self.request.user, 'is_admin', False):
            return Booking.objects.all().order_by('-created_at')
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if 'status' in self.request.data and not getattr(self.request.user, 'is_admin', False):
            serializer.save(status=serializer.instance.status)
        else:
            serializer.save()

    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status not in ['Pending', 'Confirmed']:
            return Response({'error': 'Cannot cancel this booking'}, status=status.HTTP_400_BAD_REQUEST)
        
        booking.status = 'Cancelled'
        booking.save()
        return Response({'message': 'Booking cancelled successfully'})

# --- Career Views ---
class JobListingViewSet(viewsets.ModelViewSet):
    serializer_class = JobListingSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['type', 'location']
    search_fields = ['title', 'company', 'description']

    def get_queryset(self):
        if self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False):
            return JobListing.objects.all().order_by('-created_at')
        return JobListing.objects.filter(is_active=True).order_by('-created_at')

class AdvertisementViewSet(viewsets.ModelViewSet):
    serializer_class = AdvertisementSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False):
            return Advertisement.objects.all().order_by('-created_at')
        return Advertisement.objects.filter(is_active=True).order_by('-created_at')

# --- Matrimonial Views ---
def _matrimonial_match_ids_for_user(user):
    if not user.is_authenticated:
        return set()
    try:
        my_profile = user.matrimonial_profile
    except MatrimonialProfile.DoesNotExist:
        return set()
    sent_ids = set(
        MatrimonialInterest.objects.filter(from_profile=my_profile).values_list('to_profile_id', flat=True)
    )
    received_ids = set(
        MatrimonialInterest.objects.filter(to_profile=my_profile).values_list('from_profile_id', flat=True)
    )
    return sent_ids & received_ids


class MatrimonialProfileViewSet(viewsets.ModelViewSet):
    serializer_class = MatrimonialProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['gender', 'city', 'gotra', 'marital_status', 'manglik', 'complexion', 'family_type']
    search_fields = ['user__name', 'city', 'occupation', 'education', 'gotra']

    def get_serializer_class(self):
        if self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False):
            from .serializers import AdminMatrimonialProfileSerializer
            return AdminMatrimonialProfileSerializer
        return MatrimonialProfileSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['match_ids'] = _matrimonial_match_ids_for_user(self.request.user)
        return context

    def get_queryset(self):
        # Unpaid profiles don't exist yet as far as anyone (owner and admins included) is concerned
        qs = MatrimonialProfile.objects.filter(is_active=True)

        # Age range filter
        age_min = self.request.query_params.get('age_min')
        age_max = self.request.query_params.get('age_max')
        if age_min:
            qs = qs.filter(age__gte=int(age_min))
        if age_max:
            qs = qs.filter(age__lte=int(age_max))

        # Height range filter (cm)
        height_min = self.request.query_params.get('height_min')
        height_max = self.request.query_params.get('height_max')
        if height_min:
            qs = qs.filter(height_cm__gte=int(height_min))
        if height_max:
            qs = qs.filter(height_cm__lte=int(height_max))

        return qs.distinct()

    def create(self, request, *args, **kwargs):
        """
        Saves the profile as inactive and opens a Razorpay order for the creation fee
        (by gender). verify_payment activates it once the fee is paid.
        """
        existing = MatrimonialProfile.objects.filter(user=request.user).first()
        if existing and existing.is_active:
            return Response({'error': 'You already have a matrimonial profile.'}, status=status.HTTP_400_BAD_REQUEST)
        if not razorpay.is_configured():
            return Response({'error': 'Online payments are not available right now. Please try again later.'},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # An earlier attempt that was never paid is reused rather than duplicated
        serializer = self.get_serializer(existing, data=request.data)
        serializer.is_valid(raise_exception=True)
        fee = MatrimonialProfile.FEES[serializer.validated_data['gender']]
        profile = serializer.save(user=request.user, is_active=False, amount_paid=None,
                                  razorpay_payment_id='', paid_at=None)

        amount_paise = fee * 100
        try:
            order = razorpay.create_order(
                amount_paise,
                receipt=f'matrimonial_{profile.id}',
                notes={'matrimonial_profile_id': str(profile.id), 'phone': request.user.phone},
            )
        except razorpay.RazorpayError:
            return Response({'error': 'Could not start the payment. Please try again.'},
                            status=status.HTTP_502_BAD_GATEWAY)
        profile.razorpay_order_id = order['id']
        profile.save(update_fields=['razorpay_order_id'])

        return Response({
            'profile': self.get_serializer(profile).data,
            'razorpay': {
                'key_id': settings.RAZORPAY_KEY_ID,
                'order_id': order['id'],
                'amount': amount_paise,
                'currency': 'INR',
            },
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        """Checkout's success handler posts the signed payment here; this makes the profile live."""
        order_id = request.data.get('razorpay_order_id', '')
        payment_id = request.data.get('razorpay_payment_id', '')
        signature = request.data.get('razorpay_signature', '')
        if not razorpay.verify_payment_signature(order_id, payment_id, signature):
            return Response({'error': 'Payment could not be verified.'}, status=status.HTTP_400_BAD_REQUEST)
        profile = MatrimonialProfile.objects.filter(razorpay_order_id=order_id, user=request.user).first()
        if not profile:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        if not profile.is_active:
            profile.is_active = True
            profile.amount_paid = MatrimonialProfile.FEES[profile.gender]
            profile.razorpay_payment_id = payment_id
            profile.paid_at = timezone.now()
            profile.save(update_fields=['is_active', 'amount_paid', 'razorpay_payment_id', 'paid_at'])
        return Response({
            'profile': self.get_serializer(profile).data,
            'receipt': matrimonial_receipt(profile),
        })

    def perform_update(self, serializer):
        # The fee depends on gender, so it can't be changed after creation
        serializer.save(gender=serializer.instance.gender)

    @action(detail=True, methods=['post', 'delete'])
    def interest(self, request, pk=None):
        to_profile = self.get_object()
        try:
            from_profile = request.user.matrimonial_profile
        except MatrimonialProfile.DoesNotExist:
            return Response({'error': 'You need a matrimonial profile to send interest.'}, status=status.HTTP_400_BAD_REQUEST)
        if from_profile == to_profile:
            return Response({'error': 'Cannot send interest to yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        if request.method == 'POST':
            if not from_profile.is_active:
                return Response({'error': 'Complete the payment for your matrimonial profile to express interest.'}, status=status.HTTP_403_FORBIDDEN)
            MatrimonialInterest.objects.get_or_create(from_profile=from_profile, to_profile=to_profile)
            is_match = MatrimonialInterest.objects.filter(
                from_profile=to_profile, to_profile=from_profile
            ).exists()
            return Response({'status': 'interest_sent', 'is_match': is_match})
        else:
            MatrimonialInterest.objects.filter(from_profile=from_profile, to_profile=to_profile).delete()
            return Response({'status': 'interest_withdrawn'})

    @action(detail=False, methods=['get'])
    def received_interests(self, request):
        try:
            my_profile = request.user.matrimonial_profile
        except MatrimonialProfile.DoesNotExist:
            return Response([])
        sent_ids = list(
            MatrimonialInterest.objects.filter(from_profile=my_profile).values_list('to_profile_id', flat=True)
        )
        profiles = MatrimonialProfile.objects.filter(
            sent_interests__to_profile=my_profile,
            is_active=True
        ).exclude(id__in=sent_ids)
        serializer = self.get_serializer(profiles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_sent_interests(self, request):
        try:
            my_profile = request.user.matrimonial_profile
        except MatrimonialProfile.DoesNotExist:
            return Response({'profile_ids': [], 'match_ids': []})
        profile_ids = list(
            MatrimonialInterest.objects.filter(from_profile=my_profile).values_list('to_profile_id', flat=True)
        )
        received_from_ids = set(
            MatrimonialInterest.objects.filter(to_profile=my_profile).values_list('from_profile_id', flat=True)
        )
        match_ids = [pid for pid in profile_ids if pid in received_from_ids]
        return Response({'profile_ids': profile_ids, 'match_ids': match_ids})

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def filter_options(self, request):
        qs = MatrimonialProfile.objects.filter(is_active=True)

        def distinct_vals(field):
            return sorted(filter(None, qs.values_list(field, flat=True).distinct()))

        return Response({
            'gotra': distinct_vals('gotra'),
            'education': distinct_vals('education'),
            'occupation': distinct_vals('occupation'),
            'annual_income': distinct_vals('annual_income'),
            'city': distinct_vals('city'),
            'marital_status': [c[0] for c in MatrimonialProfile.MARITAL_STATUS_CHOICES],
            'manglik': [c[0] for c in MatrimonialProfile.MANGLIK_CHOICES],
            'complexion': [c[0] for c in MatrimonialProfile.COMPLEXION_CHOICES],
        })

# --- Magazine Views ---
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.filter(is_published=True).order_by('-published_at')
    serializer_class = ArticleSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['category']

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        # Public (and admin browsing the site): active upcoming events only
        if self.action == 'list':
            if (
                self.request.user.is_authenticated
                and getattr(self.request.user, 'is_admin', False)
                and self.request.query_params.get('all') == 'true'
            ):
                return Event.objects.all().order_by('-event_date')
            if self.request.query_params.get('past') == 'true':
                return Event.objects.filter(event_date__lt=timezone.now()).order_by('-event_date')
            return Event.objects.upcoming().order_by('event_date')
        # Admin detail/update/delete may target inactive or past events by id
        if self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False):
            return Event.objects.all().order_by('-event_date')
        return Event.objects.upcoming().order_by('event_date')

class EventRegistrationViewSet(viewsets.ModelViewSet):
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self.request.user, 'is_admin', False):
            return EventRegistration.objects.all().order_by('-registered_at')
        return EventRegistration.objects.filter(
            user=self.request.user,
            event__is_active=True,
            event__event_date__gte=timezone.now(),
        ).order_by('-registered_at')

    def perform_create(self, serializer):
        event = serializer.validated_data['event']
        if not event.is_active or event.event_date < timezone.now():
            raise ValidationError({'event': 'This event is no longer available for registration.'})
        serializer.save(user=self.request.user)

# --- Public Stats View ---
@api_view(['GET'])
@permission_classes([AllowAny])
def public_stats(request):
    return Response({
        'subscriber_count': User.objects.filter(is_active=True).count(),
        'magazine_count': Article.objects.filter(category='Magazine', is_published=True).count(),
    })


# --- Admin Dashboard Stats ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_stats(request):
    if not getattr(request.user, 'is_admin', False):
        return Response(status=status.HTTP_403_FORBIDDEN)

    # Counts
    counts = {
        'members': User.objects.filter(is_active=True).count(),
        'bookings': Booking.objects.count(),
        'events': Event.objects.filter(is_active=True).count(),
        'matrimonials': MatrimonialProfile.objects.filter(is_active=True).count(),
        'jobs': JobListing.objects.filter(is_active=True).count(),
        'articles': Article.objects.filter(is_published=True).count(),
    }

    # Monthly data for the last 6 months
    six_months_ago = timezone.now() - timezone.timedelta(days=180)
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    members_by_month = (
        User.objects.filter(date_joined__gte=six_months_ago)
        .annotate(month=TruncMonth('date_joined'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )
    bookings_by_month = (
        Booking.objects.filter(created_at__gte=six_months_ago)
        .annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )

    members_map = {r['month'].strftime('%b'): r['count'] for r in members_by_month}
    bookings_map = {r['month'].strftime('%b'): r['count'] for r in bookings_by_month}

    # Build ordered 6-month labels
    now = timezone.now()
    monthly_data = []
    for i in range(5, -1, -1):
        dt = now - timezone.timedelta(days=30 * i)
        label = month_names[dt.month - 1]
        monthly_data.append({
            'name': label,
            'members': members_map.get(label, 0),
            'bookings': bookings_map.get(label, 0),
        })

    # Recent activity: latest 10 items across models, sorted by time
    activities = []

    for u in User.objects.order_by('-date_joined')[:3]:
        activities.append({
            'type': 'member',
            'title': 'New Member Joined',
            'desc': f'{u.name} completed registration',
            'timestamp': u.date_joined.isoformat(),
        })

    for b in Booking.objects.select_related('user', 'accommodation').order_by('-created_at')[:3]:
        activities.append({
            'type': 'booking',
            'title': 'Room Booked',
            'desc': f'Booking confirmed for {b.accommodation.title}',
            'timestamp': b.created_at.isoformat(),
        })

    for m in MatrimonialProfile.objects.select_related('user').filter(is_active=True).order_by('-created_at')[:3]:
        activities.append({
            'type': 'matrimonial',
            'title': 'New Matrimonial Profile',
            'desc': f'Matrimonial profile created by {m.user.name}',
            'timestamp': m.created_at.isoformat(),
        })

    for e in Event.objects.order_by('-created_at')[:3]:
        activities.append({
            'type': 'event',
            'title': 'Event Created',
            'desc': f'{e.title} was added',
            'timestamp': e.created_at.isoformat(),
        })

    activities.sort(key=lambda x: x['timestamp'], reverse=True)

    return Response({
        'counts': counts,
        'monthly_data': monthly_data,
        'recent_activity': activities[:10],
    })

# --- Site Settings Views ---
class SiteSettingsView(views.APIView):
    def get(self, request):
        settings = SiteSettings.load()
        serializer = SiteSettingsSerializer(settings)
        return response.Response(serializer.data)

    def put(self, request):
        if not (request.user.is_authenticated and getattr(request.user, 'is_admin', False)):
            return response.Response(status=status.HTTP_403_FORBIDDEN)
        settings = SiteSettings.load()
        serializer = SiteSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HeroCarouselImageViewSet(viewsets.ModelViewSet):
    queryset = HeroCarouselImage.objects.all()
    serializer_class = HeroCarouselImageSerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_create(self, serializer):
        image_file = self.request.FILES.get('image_file')
        if image_file:
            serializer.save(
                image=image_file,
                image_mimetype=image_file.content_type
            )
        else:
            serializer.save()

    def perform_update(self, serializer):
        image_file = self.request.FILES.get('image_file')
        if image_file:
            serializer.save(
                image=image_file,
                image_mimetype=image_file.content_type
            )
        else:
            serializer.save()


class MediaViewSet(viewsets.ModelViewSet):
    serializer_class = MediaSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = Media.objects.all()
        if not (self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False)):
            qs = qs.filter(is_active=True)
        return qs

    def perform_create(self, serializer):
        image_file = self.request.FILES.get('image_file')
        if image_file:
            serializer.save(image=image_file, image_mimetype=image_file.content_type)
        else:
            serializer.save()

    @action(detail=True, methods=['get'], permission_classes=[AllowAny], url_path='image')
    def image(self, request, pk=None):
        obj = self.get_object()
        if not obj.image:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return HttpResponseRedirect(obj.image.url)


from rest_framework_simplejwt.views import TokenRefreshView

class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer

