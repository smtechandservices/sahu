from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer

from core.permissions import IsAdminOrReadOnly

class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False):
            return Article.objects.all().order_by('-published_at')
        return Article.objects.filter(is_published=True).order_by('-published_at')
