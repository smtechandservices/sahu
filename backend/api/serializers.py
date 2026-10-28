import base64
import mimetypes
import re
import uuid
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import UploadedFile
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from .models import (
    User, OTPRecord, Accommodation, AccommodationImage, Booking,
    JobListing, Advertisement, MatrimonialProfile,
    Article, Event, EventRegistration, SiteSettings,
    HeroCarouselImage, UserSession, Media, Donation, MembershipApplication
)


class Base64FileField(serializers.Field):
    """
    File stored via the model field's storage (S3 or local disk).
    Write: accepts base64 / data URI or an uploaded file.
    Read: returns the file's URL.
    """
    def __init__(self, mimetype_field=None, default_ext='', **kwargs):
        self.mimetype_field = mimetype_field
        self.default_ext = default_ext
        super().__init__(**kwargs)

    def to_representation(self, value):
        if not value:
            return None
        url = value.url
        request = self.context.get('request')
        if request and url.startswith('/'):
            return request.build_absolute_uri(url)
        return url

    def to_internal_value(self, data):
        if not data:
            return None
        if isinstance(data, UploadedFile):
            return data
        # Edit forms echo back the existing file's URL: leave it unchanged.
        # Not a bare '/' check: base64 of every JPEG starts with '/9j/'.
        if isinstance(data, str) and data.startswith(('http://', 'https://', settings.MEDIA_URL)):
            raise serializers.SkipField()
        mimetype = None
        try:
            if isinstance(data, str) and 'base64,' in data:
                meta, data = data.split('base64,', 1)
                mimetype = meta.removeprefix('data:').rstrip(';') or None
            raw = data if isinstance(data, bytes) else base64.b64decode(data)
        except (TypeError, ValueError):
            raise serializers.ValidationError("Invalid base64 data")
        if not mimetype and self.mimetype_field:
            mimetype = self.parent.initial_data.get(self.mimetype_field)
        ext = (mimetypes.guess_extension(mimetype) if mimetype else None) or self.default_ext
        return ContentFile(raw, name=f'{uuid.uuid4().hex}{ext}')

# --- Auth Serializers ---
class UserSerializer(serializers.ModelSerializer):
    profile_photo = Base64FileField(mimetype_field='profile_photo_mimetype', required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'phone', 'name', 'email', 'profile_photo', 'profile_photo_mimetype', 'is_member', 'is_admin', 'date_joined']
        read_only_fields = ['is_admin', 'date_joined', 'is_member']

class AdminUserSerializer(serializers.ModelSerializer):
    profile_photo = Base64FileField(mimetype_field='profile_photo_mimetype', required=False, allow_null=True)
    membership = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'phone', 'name', 'email', 'profile_photo', 'profile_photo_mimetype', 'is_member', 'is_admin', 'is_active', 'date_joined', 'membership']
        read_only_fields = ['phone', 'date_joined']

    def get_membership(self, obj):
        """Membership fee paid online from the Join page; None for accounts created before it or offline."""
        application = getattr(obj, 'membership_application', None)
        if not application or application.status != 'Paid':
            return None
        document_url = application.kyc_document.url if application.kyc_document else None
        request = self.context.get('request')
        if document_url and request and document_url.startswith('/'):
            document_url = request.build_absolute_uri(document_url)
        return {
            'amount': application.amount,
            'paid_at': application.paid_at,
            'payment_id': application.razorpay_payment_id,
            # KYC submitted on the Join page (admins only)
            'city': application.city,
            'aadhaar_number': application.aadhaar_number,
            'kyc_document': document_url,
            'kyc_document_mimetype': application.kyc_document_mimetype,
        }

# --- Accommodation Serializers ---
MAX_ACCOMMODATION_IMAGES = 10

class AccommodationImageSerializer(serializers.ModelSerializer):
    image = Base64FileField(read_only=True)

    class Meta:
        model = AccommodationImage
        fields = ['id', 'image', 'image_mimetype', 'order']

class AccommodationSerializer(serializers.ModelSerializer):
    # Cover photo: mirrors the first entry of `images`
    image = Base64FileField(read_only=True)
    images = AccommodationImageSerializer(many=True, read_only=True)
    # Full ordered photo list from the admin form: {'id': n} keeps an existing photo,
    # {'image': <data URI>, 'image_mimetype': ...} adds one; existing photos left out are removed.
    gallery = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=False, max_length=MAX_ACCOMMODATION_IMAGES
    )

    class Meta:
        model = Accommodation
        fields = '__all__'
        read_only_fields = ['image_mimetype']

    def validate_gallery(self, items):
        decode = Base64FileField(default_ext='.jpg')
        photos = []
        for item in items:
            if item.get('id') is not None:
                try:
                    photos.append(int(item['id']))
                except (TypeError, ValueError):
                    raise serializers.ValidationError("Invalid photo id")
            elif item.get('image'):
                photos.append((decode.to_internal_value(item['image']), item.get('image_mimetype')))
            else:
                raise serializers.ValidationError("Each photo needs an id or image data")
        return photos

    @transaction.atomic
    def create(self, validated_data):
        gallery = validated_data.pop('gallery', None)
        accommodation = super().create(validated_data)
        if gallery is not None:
            self._save_gallery(accommodation, gallery)
        return accommodation

    @transaction.atomic
    def update(self, instance, validated_data):
        gallery = validated_data.pop('gallery', None)
        accommodation = super().update(instance, validated_data)
        if gallery is not None:
            self._save_gallery(accommodation, gallery)
        return accommodation

    def _save_gallery(self, accommodation, gallery):
        existing = {photo.id: photo for photo in accommodation.images.all()}
        kept = []
        for order, item in enumerate(gallery):
            if isinstance(item, tuple):
                file, mimetype = item
                kept.append(AccommodationImage.objects.create(
                    accommodation=accommodation, image=file, image_mimetype=mimetype, order=order
                ))
            elif item in existing:
                photo = existing.pop(item)
                photo.order = order
                photo.save(update_fields=['order'])
                kept.append(photo)
        AccommodationImage.objects.filter(id__in=existing).delete()
        cover = kept[0] if kept else None
        accommodation.image = cover.image if cover else None
        accommodation.image_mimetype = cover.image_mimetype if cover else None
        accommodation.save(update_fields=['image', 'image_mimetype'])
        # Drop the prefetched/cached photos so the response shows the new list
        getattr(accommodation, '_prefetched_objects_cache', {}).pop('images', None)

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
    image = Base64FileField(mimetype_field='image_mimetype')
    
    class Meta:
        model = Advertisement
        fields = '__all__'

# --- Matrimonial Serializers ---
class MatrimonialPublicUserSerializer(serializers.ModelSerializer):
    """User fields exposed on matrimonial listings (phone withheld; use contact_phone on profile)."""

    class Meta:
        model = User
        fields = ['id', 'name', 'email']


def matrimonial_receipt(profile):
    """Details for the profile-fee receipt, or None if no fee was paid (older profiles)."""
    if not profile.amount_paid:
        return None
    return {
        'id': profile.id,
        'name': profile.user.name,
        'phone': profile.user.phone,
        'gender': profile.gender,
        'age': profile.age,
        'city': profile.city,
        'amount': profile.amount_paid,
        'razorpay_payment_id': profile.razorpay_payment_id,
        'paid_at': profile.paid_at,
    }


class MatrimonialProfileSerializer(serializers.ModelSerializer):
    user_detail = MatrimonialPublicUserSerializer(source='user', read_only=True)
    contact_phone = serializers.SerializerMethodField()
    payment = serializers.SerializerMethodField()
    photo = Base64FileField(mimetype_field='photo_mimetype', required=False, allow_null=True)
    marital_status_display = serializers.CharField(source='get_marital_status_display', read_only=True)
    manglik_display = serializers.CharField(source='get_manglik_display', read_only=True)
    complexion_display = serializers.CharField(source='get_complexion_display', read_only=True)

    class Meta:
        model = MatrimonialProfile
        fields = [
            'id', 'user', 'age', 'gender', 'city', 'education', 'occupation', 'family_type',
            'gotra', 'marital_status', 'manglik', 'complexion', 'height_cm', 'annual_income',
            'mother_tongue', 'photo', 'photo_mimetype', 'bio', 'created_at',
            'user_detail', 'contact_phone', 'payment',
            'marital_status_display', 'manglik_display', 'complexion_display',
        ]
        read_only_fields = ['user', 'created_at']

    def get_payment(self, obj):
        # Only the owner sees what they paid
        request = self.context.get('request')
        if not request or obj.user_id != request.user.id:
            return None
        return matrimonial_receipt(obj)

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

    class Meta(MatrimonialProfileSerializer.Meta):
        fields = MatrimonialProfileSerializer.Meta.fields + ['amount_paid', 'razorpay_payment_id', 'paid_at']
        read_only_fields = MatrimonialProfileSerializer.Meta.read_only_fields + ['amount_paid', 'razorpay_payment_id', 'paid_at']

    def get_contact_phone(self, obj):
        return obj.user.phone

# --- Magazine Serializers ---
class ArticleSerializer(serializers.ModelSerializer):
    image = Base64FileField(mimetype_field='image_mimetype', required=False, allow_null=True)
    pdf = Base64FileField(default_ext='.pdf', required=False, allow_null=True)

    def validate_pdf(self, value):
        if value is None:
            return value
        max_size = getattr(settings, 'MAX_ARTICLE_PDF_SIZE_BYTES', 10 * 1024 * 1024)
        if value.size > max_size:
            max_mb = max_size // (1024 * 1024)
            raise serializers.ValidationError(f'PDF must be {max_mb} MB or smaller.')
        return value

    def validate_pdf_filename(self, value):
        if value and not value.lower().endswith('.pdf'):
            raise serializers.ValidationError('File must have a .pdf extension.')
        return value

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'content', 'image', 'image_mimetype', 'pdf', 'pdf_filename',
            'category', 'published_at', 'is_published',
        ]

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
    image = Base64FileField(mimetype_field='image_mimetype', required=False, allow_null=True)
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
    image = Base64FileField(mimetype_field='image_mimetype', required=False, allow_null=True)

    class Meta:
        model = HeroCarouselImage
        fields = '__all__'


class MediaSerializer(serializers.ModelSerializer):
    image = Base64FileField(mimetype_field='image_mimetype', required=True, write_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Media
        fields = ['id', 'image', 'image_url', 'image_mimetype', 'title', 'media_type', 'year', 'is_active', 'created_at']

    def get_image_url(self, obj):
        if not obj.image:
            return None
        url = obj.image.url
        request = self.context.get('request')
        return request.build_absolute_uri(url) if request and url.startswith('/') else url


class UserSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSession
        fields = ['id', 'device_name', 'ip_address', 'created_at', 'last_activity', 'is_active']


from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from datetime import timedelta

SESSION_IDLE_TIMEOUT = timedelta(minutes=15)

class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = RefreshToken(attrs['refresh'])
        jti = refresh.payload.get('jti')

        try:
            session = UserSession.objects.get(refresh_jti=jti)
            if not session.is_active:
                raise AuthenticationFailed('Session has been terminated.', code='session_terminated')
            if timezone.now() - session.last_activity > SESSION_IDLE_TIMEOUT:
                session.is_active = False
                session.save()
                raise AuthenticationFailed('Session expired due to inactivity.', code='session_expired')
            session.save()  # updates last_activity via auto_now=True
        except UserSession.DoesNotExist:
            pass

        access_token = refresh.access_token
        access_token['refresh_jti'] = jti
        data['access'] = str(access_token)

        return data



# --- Membership Serializers ---
# Verhoeff checksum tables; the last digit of every Aadhaar number is a Verhoeff check digit
_VERHOEFF_D = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
]
_VERHOEFF_P = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
]


def is_valid_aadhaar(number):
    if len(number) != 12 or not number.isdigit() or number[0] in '01':
        return False
    check = 0
    for i, digit in enumerate(reversed(number)):
        check = _VERHOEFF_D[check][_VERHOEFF_P[i % 8][int(digit)]]
    return check == 0


PHONE_REGEX = re.compile(r'[6-9]\d{9}')
KYC_ALLOWED_TYPES = {'image/jpeg', 'image/png', 'image/webp', 'application/pdf'}
KYC_MAX_SIZE_BYTES = 5 * 1024 * 1024


class MembershipApplicationSerializer(serializers.ModelSerializer):
    """Join page sign-up. Aadhaar and the KYC file go in but only a masked Aadhaar comes back."""
    aadhaar_number = serializers.CharField(write_only=True)
    kyc_document = serializers.FileField(write_only=True)
    aadhaar_masked = serializers.SerializerMethodField()

    class Meta:
        model = MembershipApplication
        fields = [
            'id', 'name', 'phone', 'city', 'aadhaar_number', 'aadhaar_masked', 'kyc_document',
            'amount', 'status', 'razorpay_payment_id', 'created_at', 'paid_at',
        ]
        read_only_fields = ['status', 'razorpay_payment_id', 'created_at', 'paid_at']

    def get_aadhaar_masked(self, obj):
        return f'XXXX XXXX {obj.aadhaar_number[-4:]}'

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Name is required.')
        return value

    def validate_phone(self, value):
        if not PHONE_REGEX.fullmatch(value):
            raise serializers.ValidationError('Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.')
        return value

    def validate_aadhaar_number(self, value):
        value = ''.join(value.split())
        if not is_valid_aadhaar(value):
            raise serializers.ValidationError('Enter a valid 12-digit Aadhaar number.')
        if MembershipApplication.objects.filter(aadhaar_number=value, status='Paid').exists():
            raise serializers.ValidationError('This Aadhaar number is already registered with a member.')
        return value

    def validate_kyc_document(self, value):
        if value.content_type not in KYC_ALLOWED_TYPES:
            raise serializers.ValidationError('Upload a JPG, PNG, WEBP or PDF file.')
        if value.size > KYC_MAX_SIZE_BYTES:
            raise serializers.ValidationError('The KYC document must be 5 MB or smaller.')
        return value

    def validate_amount(self, value):
        if value not in MembershipApplication.FEE_CHOICES:
            raise serializers.ValidationError('Choose one of the membership amounts.')
        return value

    def create(self, validated_data):
        validated_data['kyc_document_mimetype'] = validated_data['kyc_document'].content_type
        return super().create(validated_data)


# --- Donation Serializers ---
class DonationSerializer(serializers.ModelSerializer):
    """Used by donors on the website: they can only submit who/how much/what for."""
    class Meta:
        model = Donation
        fields = ['id', 'name', 'phone', 'email', 'amount', 'purpose', 'status', 'payment_method', 'razorpay_payment_id', 'created_at']
        read_only_fields = ['status', 'payment_method', 'razorpay_payment_id', 'created_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than zero.')
        return value

    def validate_phone(self, value):
        digits = ''.join(ch for ch in value if ch.isdigit())
        if len(digits) < 10:
            raise serializers.ValidationError('Enter a valid phone number.')
        return digits[-10:]


class AdminDonationSerializer(DonationSerializer):
    """Admins can see and edit everything, including status and payment details."""
    user_name = serializers.CharField(source='user.name', read_only=True, default=None)
    recorded_by_name = serializers.CharField(source='recorded_by.name', read_only=True, default=None)

    class Meta(DonationSerializer.Meta):
        fields = [
            'id', 'user', 'user_name', 'name', 'phone', 'email', 'amount', 'purpose', 'status',
            'payment_method', 'transaction_ref', 'razorpay_order_id', 'razorpay_payment_id',
            'notes', 'recorded_by', 'recorded_by_name', 'created_at', 'updated_at',
        ]
        read_only_fields = ['user', 'recorded_by', 'razorpay_order_id', 'razorpay_payment_id',
                            'created_at', 'updated_at']
