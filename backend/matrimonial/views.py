from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import MatrimonialProfile
from .serializers import MatrimonialProfileSerializer

class MatrimonialProfileViewSet(viewsets.ModelViewSet):
    serializer_class = MatrimonialProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated and getattr(self.request.user, 'is_admin', False):
            return MatrimonialProfile.objects.all()
        # Users can see all approved profiles, or their own profile
        return MatrimonialProfile.objects.filter(is_approved=True) | MatrimonialProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
