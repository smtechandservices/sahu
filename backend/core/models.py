from django.db import models

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
