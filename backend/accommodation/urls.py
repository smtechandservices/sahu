from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccommodationViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'', AccommodationViewSet, basename='accommodation')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
]
