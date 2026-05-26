from rest_framework import status, viewsets, permissions, views, response
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from django.db.models.functions import TruncMonth
from django.db.models import Count
import itertools

from .models import (
    User, OTPRecord, Accommodation, Booking,
    JobListing, Advertisement, MatrimonialProfile, MatrimonialInterest,
    Article, Event, EventRegistration, SiteSettings,
    HeroCarouselImage
)
from .serializers import (
    UserSerializer, AdminUserSerializer, AccommodationSerializer, BookingSerializer,
    JobListingSerializer, AdvertisementSerializer,
    MatrimonialProfileSerializer, ArticleSerializer,
    EventSerializer, EventRegistrationSerializer, SiteSettingsSerializer,
    HeroCarouselImageSerializer
)
from .permissions import IsAdminOrReadOnly

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

def _is_dev_otp(code):
    return DEV_OTP_ENABLED and bool(DEV_OTP_CODE) and code == DEV_OTP_CODE

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    phone = request.data.get('phone')
    code = request.data.get('code')

    if not phone or not code:
        return Response({'error': 'Phone and code are required'}, status=status.HTTP_400_BAD_REQUEST)

    if not _is_dev_otp(code):
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

    if not _is_dev_otp(code):
        otp = OTPRecord.objects.filter(phone=phone, code=code, is_used=False).order_by('-created_at').first()
        if not otp:
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

        expiry = otp.created_at + timezone.timedelta(minutes=10)
        if timezone.now() > expiry:
            return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'message': 'OTP verified'})





@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    phone = request.data.get('phone')
    name = request.data.get('name')
    code = request.data.get('code')

    if not phone or not name or not code:
        return Response({'error': 'Phone, name and code are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(phone=phone).exists():
        return Response({'error': 'User with this phone already exists. Please login.'}, status=status.HTTP_400_BAD_REQUEST)

    if not _is_dev_otp(code):
        otp = OTPRecord.objects.filter(phone=phone, code=code, is_used=False).order_by('-created_at').first()
        if not otp:
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

        expiry = otp.created_at + timezone.timedelta(minutes=10)
        if timezone.now() > expiry:
            return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)

        otp.is_used = True
        otp.save()

    user = User.objects.create_user(phone=phone, name=name)
    refresh = RefreshToken.for_user(user)

    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': UserSerializer(user).data
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
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

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

# --- User Management Views ---
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['name', 'phone', 'email']
    http_method_names = ['get', 'put', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        if not getattr(self.request.user, 'is_admin', False):
            return User.objects.none()
        return User.objects.all().order_by('-date_joined')

    def destroy(self, request, *args, **kwargs):
        if not getattr(request.user, 'is_admin', False):
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

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
        qs = MatrimonialProfile.objects.all()
        if self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False):
            pass  # admins see all
        else:
            qs = qs.filter(is_approved=True) | qs.filter(user=self.request.user)

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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(is_approved=False)

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
            is_approved=True
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

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        if not getattr(request.user, 'is_admin', False):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        profile = self.get_object()
        profile.is_approved = True
        profile.save()
        return Response({'message': 'Profile approved successfully'})

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def filter_options(self, request):
        qs = MatrimonialProfile.objects.filter(is_approved=True)

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
        'matrimonials': MatrimonialProfile.objects.count(),
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

    for m in MatrimonialProfile.objects.select_related('user').filter(is_approved=False).order_by('-created_at')[:3]:
        activities.append({
            'type': 'matrimonial',
            'title': 'Profile Approval',
            'desc': f'New Matrimonial profile by {m.user.name} needs review',
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
                image=image_file.read(),
                image_mimetype=image_file.content_type
            )
        else:
            serializer.save()

    def perform_update(self, serializer):
        image_file = self.request.FILES.get('image_file')
        if image_file:
            serializer.save(
                image=image_file.read(),
                image_mimetype=image_file.content_type
            )
        else:
            serializer.save()
