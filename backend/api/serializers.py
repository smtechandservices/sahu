import base64
from django.conf import settings
from django.utils import timezone
from rest_framework import serializers
from .models import (
    User, OTPRecord, Accommodation, Booking,
    JobListing, Advertisement, MatrimonialProfile,
    Article, Event, EventRegistration, SiteSettings,
    HeroCarouselImage, UserSession, GalleryImage
)

class Base64BinaryField(serializers.Field):
    """
    Custom field for Base64 encoded binary data.
    """
    def to_representation(self, value):
        if not value:
            return None
        # Convert binary data to base64 string
        return base64.b64encode(value).decode('utf-8')

    def to_internal_value(self, data):
        if not data:
            return None
        try:
            # Check if it's already binary (e.g. from tests or multipart)
            if isinstance(data, bytes):
                return data
            # Handle data:image/...;base64,... prefix
            if 'base64,' in data:
                _, data = data.split('base64,')
            return base64.b64decode(data)
        except (TypeError, ValueError):
            raise serializers.ValidationError("Invalid base64 data")

# --- Auth Serializers ---
class UserSerializer(serializers.ModelSerializer):
    profile_photo = Base64BinaryField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'phone', 'name', 'email', 'profile_photo', 'profile_photo_mimetype', 'is_member', 'is_admin', 'date_joined']
        read_only_fields = ['is_admin', 'date_joined', 'is_member']

class AdminUserSerializer(serializers.ModelSerializer):
    profile_photo = Base64BinaryField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'phone', 'name', 'email', 'profile_photo', 'profile_photo_mimetype', 'is_member', 'is_admin', 'is_active', 'date_joined']
        read_only_fields = ['phone', 'date_joined']

# --- Accommodation Serializers ---
class AccommodationSerializer(serializers.ModelSerializer):
    image = Base64BinaryField(required=False, allow_null=True)
    
    class Meta:
        model = Accommodation
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    accommodation_detail = AccommodationSerializer(source='accommodation', read_only=True)
    user_detail = UserSerializer(source='user', read_only=True)
    
    # Extra fields for admin consumption
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)
    accommodation_title = serializers.CharField(source='accommodation.title', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['user', 'total_price', 'created_at']

# --- Career Serializers ---
class JobListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = '__all__'

class AdvertisementSerializer(serializers.ModelSerializer):
    image = Base64BinaryField()
    
    class Meta:
        model = Advertisement
        fields = '__all__'

# --- Matrimonial Serializers ---
class MatrimonialPublicUserSerializer(serializers.ModelSerializer):
    """User fields exposed on matrimonial listings (phone withheld; use contact_phone on profile)."""

    class Meta:
        model = User
        fields = ['id', 'name', 'email']


class MatrimonialProfileSerializer(serializers.ModelSerializer):
    user_detail = MatrimonialPublicUserSerializer(source='user', read_only=True)
    contact_phone = serializers.SerializerMethodField()
    marital_status_display = serializers.CharField(source='get_marital_status_display', read_only=True)
    manglik_display = serializers.CharField(source='get_manglik_display', read_only=True)
    complexion_display = serializers.CharField(source='get_complexion_display', read_only=True)

    class Meta:
        model = MatrimonialProfile
        fields = [
            'id', 'user', 'age', 'gender', 'city', 'education', 'occupation', 'family_type',
            'gotra', 'marital_status', 'manglik', 'complexion', 'height_cm', 'annual_income',
            'mother_tongue', 'bio', 'is_approved', 'created_at',
            'user_detail', 'contact_phone',
            'marital_status_display', 'manglik_display', 'complexion_display',
        ]
        read_only_fields = ['user', 'is_approved', 'created_at']

    def get_contact_phone(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        if obj.user_id == request.user.id:
            return obj.user.phone
        if getattr(request.user, 'is_admin', False):
            return obj.user.phone
        match_ids = self.context.get('match_ids') or set()
        if obj.id in match_ids:
            return obj.user.phone
        return None


class AdminMatrimonialProfileSerializer(MatrimonialProfileSerializer):
    user_detail = UserSerializer(source='user', read_only=True)

    def get_contact_phone(self, obj):
        return obj.user.phone

# --- Magazine Serializers ---
class ArticleSerializer(serializers.ModelSerializer):
    image = Base64BinaryField(required=False, allow_null=True)
    pdf = Base64BinaryField(required=False, allow_null=True)

    def validate_pdf(self, value):
        if value is None:
            return value
        max_size = getattr(settings, 'MAX_ARTICLE_PDF_SIZE_BYTES', 10 * 1024 * 1024)
        if len(value) > max_size:
            max_mb = max_size // (1024 * 1024)
            raise serializers.ValidationError(f'PDF must be {max_mb} MB or smaller.')
        return value

    def validate_pdf_filename(self, value):
        if value and not value.lower().endswith('.pdf'):
            raise serializers.ValidationError('File must have a .pdf extension.')
        return value

    class Meta:
        model = Article
        fields = '__all__'

class EventRegistrationSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)

    def validate_event(self, value):
        if not value.is_active or value.event_date < timezone.now():
            raise serializers.ValidationError('This event is no longer available for registration.')
        return value

    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'user', 'user_detail', 'registered_at']
        read_only_fields = ['user', 'registered_at']

class EventSerializer(serializers.ModelSerializer):
    image = Base64BinaryField(required=False, allow_null=True)
    attendee_count = serializers.IntegerField(source='registrations.count', read_only=True)
    # Optional: include first few attendees
    recent_registrations = EventRegistrationSerializer(source='registrations', many=True, read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'image', 'image_mimetype', 
            'event_date', 'location', 'is_active',
            'created_at', 'attendee_count', 'recent_registrations'
        ]

# --- Site Settings Serializers ---
class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'

class HeroCarouselImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroCarouselImage
        fields = '__all__'


class GalleryImageSerializer(serializers.ModelSerializer):
    image = Base64BinaryField(required=True)

    class Meta:
        model = GalleryImage
        fields = ['id', 'image', 'image_mimetype', 'title', 'is_active', 'created_at']


class UserSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSession
        fields = ['id', 'device_name', 'ip_address', 'created_at', 'last_activity', 'is_active']


from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed

class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        refresh = RefreshToken(attrs['refresh'])
        jti = refresh.payload.get('jti')
        
        try:
            session = UserSession.objects.get(refresh_jti=jti)
            if not session.is_active:
                raise AuthenticationFailed('Session has been terminated.', code='session_terminated')
        except UserSession.DoesNotExist:
            pass

        access_token = refresh.access_token
        access_token['refresh_jti'] = jti
        data['access'] = str(access_token)
        
        return data

