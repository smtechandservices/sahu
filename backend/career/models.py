from django.db import models

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
    image = models.ImageField(upload_to='ads/')
    description = models.TextField()
    link = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
