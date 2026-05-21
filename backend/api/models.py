from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.conf import settings
import random

# --- Auth Models ---
class UserManager(BaseUserManager):
    def create_user(self, phone, name, password=None, **extra_fields):
        if not phone:
            raise ValueError('Users must have a phone number')
        user = self.model(
            phone=phone,
            name=name,
            **extra_fields
        )
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)
        return self.create_user(phone, name, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    phone = models.CharField(max_length=15, unique=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    profile_photo = models.BinaryField(null=True, blank=True)
    profile_photo_mimetype = models.CharField(max_length=50, null=True, blank=True)
    is_member = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.phone

class OTPRecord(models.Model):
    phone = models.CharField(max_length=15)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    @classmethod
    def generate_otp(cls, phone):
        code = f'{random.randint(0, 999999):06d}'
        cls.objects.filter(phone=phone, is_used=False).delete()
        return cls.objects.create(phone=phone, code=code)

# --- Accommodation Models ---
class AccommodationType(models.TextChoices):
    HOSTEL = 'Hostel', 'Hostel'
    COMMUNITY_HALL = 'Community Hall', 'Community Hall'
    GUEST_ROOMS = 'Guest Rooms', 'Guest Rooms'

class Accommodation(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=50, choices=AccommodationType.choices)
    badge = models.CharField(max_length=100, blank=True, null=True)
    image = models.BinaryField()
    image_mimetype = models.CharField(max_length=50, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50, default="/ night")
    location = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Booking(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
        ('Completed', 'Completed'),
    )
    accommodation = models.ForeignKey(Accommodation, on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    check_in = models.DateField()
    check_in_time = models.TimeField(null=True, blank=True)
    check_out = models.DateField()
    check_out_time = models.TimeField(null=True, blank=True)
    guests = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.accommodation.title}"

# --- Career Models ---
class JobListing(models.Model):
    JOB_TYPES = (
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Remote', 'Remote'),
        ('Contract', 'Contract'),
    )
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=JOB_TYPES)
    description = models.TextField()
    apply_link = models.URLField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"

class Advertisement(models.Model):
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    image = models.BinaryField()
    image_mimetype = models.CharField(max_length=50, null=True, blank=True)
    description = models.TextField()
    link = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# --- Matrimonial Models ---
class MatrimonialProfile(models.Model):
    MARITAL_STATUS_CHOICES = (
        ('Never Married', 'Never Married'),
        ('Divorced', 'Divorced'),
        ('Widowed', 'Widowed'),
        ('Awaiting Divorce', 'Awaiting Divorce'),
    )
    MANGLIK_CHOICES = (
        ('Yes', 'Yes'),
        ('No', 'No'),
        ('Partial', 'Partial'),
    )
    COMPLEXION_CHOICES = (
        ('Fair', 'Fair'),
        ('Wheatish', 'Wheatish'),
        ('Dark', 'Dark'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='matrimonial_profile')
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=(('Male', 'Male'), ('Female', 'Female')))
    city = models.CharField(max_length=255)
    education = models.CharField(max_length=255)
    occupation = models.CharField(max_length=255)
    family_type = models.CharField(max_length=50)
    # New fields
    gotra = models.CharField(max_length=100, blank=True, null=True, help_text="Gotra / clan name")
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES, default='Never Married')
    manglik = models.CharField(max_length=10, choices=MANGLIK_CHOICES, default='No')
    complexion = models.CharField(max_length=20, choices=COMPLEXION_CHOICES, blank=True, null=True)
    height_cm = models.IntegerField(blank=True, null=True, help_text="Height in centimeters")
    annual_income = models.CharField(max_length=50, blank=True, null=True, help_text="e.g. 5-10 LPA")
    mother_tongue = models.CharField(max_length=50, blank=True, null=True)
    photo = models.BinaryField()
    photo_mimetype = models.CharField(max_length=50, null=True, blank=True)
    bio = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.city}"


class MatrimonialInterest(models.Model):
    from_profile = models.ForeignKey(MatrimonialProfile, on_delete=models.CASCADE, related_name='sent_interests')
    to_profile = models.ForeignKey(MatrimonialProfile, on_delete=models.CASCADE, related_name='received_interests')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_profile', 'to_profile')

    def __str__(self):
        return f"{self.from_profile.user.name} → {self.to_profile.user.name}"


# --- Magazine Models ---
class Article(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.BinaryField(null=True, blank=True)
    image_mimetype = models.CharField(max_length=50, null=True, blank=True)
    pdf = models.BinaryField(null=True, blank=True)
    pdf_filename = models.CharField(max_length=255, null=True, blank=True)
    category = models.CharField(max_length=100) # e.g. 'Magazine', 'News'
    published_at = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class EventQuerySet(models.QuerySet):
    def upcoming(self):
        return self.filter(is_active=True, event_date__gte=timezone.now())


class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.BinaryField(null=True, blank=True)
    image_mimetype = models.CharField(max_length=50, null=True, blank=True)
    event_date = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = EventQuerySet.as_manager()

    def __str__(self):
        return self.title

class EventRegistration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='event_registrations')
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')

    def __str__(self):
        return f"{self.user.name} - {self.event.title}"

# --- Core (Settings) Models ---
class HeroCarouselImage(models.Model):
    image = models.BinaryField()
    image_mimetype = models.CharField(max_length=50, default='image/jpeg')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Carousel Image {self.id}"

class SiteSettings(models.Model):
    hero_text = models.CharField(max_length=255, default="Welcome to Sahu Sabha")
    hero_subtext = models.TextField(default="Empowering our community")
    contact_email = models.EmailField(default="contact@sahusabha.com")
    contact_phone = models.CharField(max_length=20, default="+91 00000 00000")
    about_text = models.TextField(default="About Sahu Sabha")

    def save(self, *args, **kwargs):
        self.pk = 1
        super(SiteSettings, self).save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Site Settings"
