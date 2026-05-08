from django.db import models
from django.conf import settings

class AccommodationType(models.TextChoices):
    HOSTEL = 'Hostel', 'Hostel'
    COMMUNITY_HALL = 'Community Hall', 'Community Hall'
    GUEST_ROOMS = 'Guest Rooms', 'Guest Rooms'

class Accommodation(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=50, choices=AccommodationType.choices)
    badge = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='accommodations/')
    price_label = models.CharField(max_length=100, default="Starting from")
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
    check_out = models.DateField()
    guests = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.accommodation.title}"
