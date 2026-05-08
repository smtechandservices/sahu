from rest_framework import viewsets
from .models import JobListing, Advertisement
from .serializers import JobListingSerializer, AdvertisementSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from core.permissions import IsAdminOrReadOnly

class JobListingViewSet(viewsets.ModelViewSet):
    serializer_class = JobListingSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['type', 'location']
    search_fields = ['title', 'company', 'description']

    def get_queryset(self):
        if self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False):
            return JobListing.objects.all().order_by('-created_at')
        return JobListing.objects.filter(is_active=True).order_by('-created_at')

class AdvertisementViewSet(viewsets.ModelViewSet):
    serializer_class = AdvertisementSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False):
            return Advertisement.objects.all().order_by('-created_at')
        return Advertisement.objects.filter(is_active=True).order_by('-created_at')
