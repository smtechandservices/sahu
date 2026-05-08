from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('auth_app.urls')),
    path('api/accommodations/', include('accommodation.urls')),
    path('api/career/', include('career.urls')),
    path('api/matrimonial/', include('matrimonial.urls')),
    path('api/magazine/', include('magazine.urls')),
    path('api/core/', include('core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
