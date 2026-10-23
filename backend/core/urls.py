from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    # Local uploads may be embedded by the admin panel (e.g. KYC PDFs); S3 serves them in production
    urlpatterns += static(settings.MEDIA_URL, xframe_options_exempt(serve), document_root=settings.MEDIA_ROOT)
