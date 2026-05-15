from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()

# Users
router.register(r'users', views.UserViewSet, basename='user')

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
router.register(r'carousel-images', views.HeroCarouselImageViewSet, basename='carousel-image')

urlpatterns = [
    # Auth
    path('auth/send-otp/', views.send_otp, name='send_otp'),
    path('auth/verify-otp/', views.verify_otp, name='verify_otp'),
    path('auth/send-register-otp/', views.send_register_otp, name='send_register_otp'),
    path('auth/verify-register-otp/', views.verify_register_otp, name='verify_register_otp'),
    path('auth/register/', views.register, name='register'),
    path('auth/admin-login/', views.admin_login, name='admin_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', views.profile_view, name='profile_view'),
    
    # Public stats
    path('magazine-stats/', views.public_stats, name='magazine_stats'),

    # Admin dashboard
    path('admin/dashboard-stats/', views.admin_dashboard_stats, name='admin_dashboard_stats'),

    # Site Settings
    path('core/settings/', views.SiteSettingsView.as_view(), name='site_settings'),
    
    # Router based endpoints
    path('', include(router.urls)),
]
