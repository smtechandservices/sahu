from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()

# Accommodation
router.register(r'accommodations', views.AccommodationViewSet, basename='accommodation')
router.register(r'bookings', views.BookingViewSet, basename='booking')

# Career
router.register(r'jobs', views.JobListingViewSet, basename='job')
router.register(r'ads', views.AdvertisementViewSet, basename='ad')

# Matrimonial
router.register(r'matrimonial', views.MatrimonialProfileViewSet, basename='matrimonial')

# Magazine
router.register(r'articles', views.ArticleViewSet, basename='article')
router.register(r'events', views.EventViewSet, basename='event')
router.register(r'event-registrations', views.EventRegistrationViewSet, basename='event-registration')

urlpatterns = [
    # Auth
    path('auth/send-otp/', views.send_otp, name='send_otp'),
    path('auth/verify-otp/', views.verify_otp, name='verify_otp'),
    path('auth/admin-login/', views.admin_login, name='admin_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', views.profile_view, name='profile_view'),
    
    # Site Settings
    path('core/settings/', views.SiteSettingsView.as_view(), name='site_settings'),
    
    # Router based endpoints
    path('', include(router.urls)),
]
