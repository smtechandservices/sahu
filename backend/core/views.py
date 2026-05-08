from rest_framework import views, response, permissions, status
from .models import SiteSettings
from .serializers import SiteSettingsSerializer

class SiteSettingsView(views.APIView):
    def get(self, request):
        settings = SiteSettings.load()
        serializer = SiteSettingsSerializer(settings)
        return response.Response(serializer.data)

    def put(self, request):
        if not (request.user.is_authenticated and getattr(request.user, 'is_admin', False)):
            return response.Response(status=status.HTTP_403_FORBIDDEN)
        settings = SiteSettings.load()
        serializer = SiteSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
