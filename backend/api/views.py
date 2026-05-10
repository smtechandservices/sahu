from rest_framework import status, viewsets, permissions, views, response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from .models import (
    User, OTPRecord, Accommodation, Booking, 
    JobListing, Advertisement, MatrimonialProfile, 
    Article, Event, EventRegistration, SiteSettings
)
from .serializers import (
    UserSerializer, AccommodationSerializer, BookingSerializer,
    JobListingSerializer, AdvertisementSerializer, 
    MatrimonialProfileSerializer, ArticleSerializer, 
    EventSerializer, EventRegistrationSerializer, SiteSettingsSerializer
)
from .permissions import IsAdminOrReadOnly

# --- Auth Views ---
@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    phone = request.data.get('phone')
    if not phone:
        return Response({'error': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    OTPRecord.generate_otp(phone)
    return Response({'message': 'OTP sent successfully (mocked as 123456)'})

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    phone = request.data.get('phone')
    code = request.data.get('code')
    name = request.data.get('name')
    
    if not phone or not code:
        return Response({'error': 'Phone and code are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if code != '123456':
        return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

    user, created = User.objects.get_or_create(phone=phone, defaults={'name': name or 'User'})
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': UserSerializer(user).data,
        'created': created
    })

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
class MatrimonialProfileViewSet(viewsets.ModelViewSet):
    serializer_class = MatrimonialProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False):
            return MatrimonialProfile.objects.all()
        return MatrimonialProfile.objects.filter(is_approved=True) | MatrimonialProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# --- Magazine Views ---
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.filter(is_published=True).order_by('-published_at')
    serializer_class = ArticleSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['category']

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.filter(is_active=True).order_by('event_date')
    serializer_class = EventSerializer
    permission_classes = [IsAdminOrReadOnly]

class EventRegistrationViewSet(viewsets.ModelViewSet):
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self.request.user, 'is_admin', False):
            return EventRegistration.objects.all().order_by('-registered_at')
        return EventRegistration.objects.filter(user=self.request.user).order_by('-registered_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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
