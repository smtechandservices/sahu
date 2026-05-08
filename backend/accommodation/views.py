from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Accommodation, Booking
from .serializers import AccommodationSerializer, BookingSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from core.permissions import IsAdminOrReadOnly

class AccommodationViewSet(viewsets.ModelViewSet):
    serializer_class = AccommodationSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['type', 'location']
    search_fields = ['title', 'location', 'description']

    def get_queryset(self):
        if self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False):
            return Accommodation.objects.all().order_by('-created_at')
        return Accommodation.objects.filter(is_active=True).order_by('-created_at')

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status not in ['Pending', 'Confirmed']:
            return Response({'error': 'Cannot cancel this booking'}, status=status.HTTP_400_BAD_REQUEST)
        
        booking.status = 'Cancelled'
        booking.save()
        return Response({'message': 'Booking cancelled successfully'})
