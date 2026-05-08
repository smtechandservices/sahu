from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to='magazine/', blank=True, null=True)
    category = models.CharField(max_length=100)
    published_at = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return self.title
