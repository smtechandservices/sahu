from django.db import models
from django.conf import settings

class MatrimonialProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='matrimonial_profile')
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=(('Male', 'Male'), ('Female', 'Female')))
    city = models.CharField(max_length=255)
    education = models.CharField(max_length=255)
    occupation = models.CharField(max_length=255)
    family_type = models.CharField(max_length=50)
    photo = models.ImageField(upload_to='matrimonial/')
    bio = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.city}"
