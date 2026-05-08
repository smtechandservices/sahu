from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('send-otp/', views.send_otp, name='send_otp'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.profile_view, name='profile_view'),
]
