from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatrimonialProfileViewSet

router = DefaultRouter()
router.register(r'', MatrimonialProfileViewSet, basename='matrimonial')

urlpatterns = [
    path('', include(router.urls)),
]
