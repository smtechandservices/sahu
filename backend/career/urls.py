from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobListingViewSet, AdvertisementViewSet

router = DefaultRouter()
router.register(r'jobs', JobListingViewSet, basename='job')
router.register(r'ads', AdvertisementViewSet, basename='ad')

urlpatterns = [
    path('', include(router.urls)),
]
