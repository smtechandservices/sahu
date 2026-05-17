import base64
from rest_framework import serializers
from .models import (
    User, OTPRecord, Accommodation, Booking, 
    JobListing, Advertisement, MatrimonialProfile, 
    Article, Event, EventRegistration, SiteSettings,
    HeroCarouselImage
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
    image = Base64BinaryField()
    
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
class MatrimonialProfileSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)
    photo = Base64BinaryField()
    # Expose choice display values as extra read-only fields
    marital_status_display = serializers.CharField(source='get_marital_status_display', read_only=True)
    manglik_display = serializers.CharField(source='get_manglik_display', read_only=True)
    complexion_display = serializers.CharField(source='get_complexion_display', read_only=True)

    class Meta:
        model = MatrimonialProfile
        fields = '__all__'
        read_only_fields = ['user', 'is_approved', 'created_at']

# --- Magazine Serializers ---
class ArticleSerializer(serializers.ModelSerializer):
    image = Base64BinaryField(required=False, allow_null=True)
    pdf = Base64BinaryField(required=False, allow_null=True)

    class Meta:
        model = Article
        fields = '__all__'

class EventRegistrationSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)
    
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
