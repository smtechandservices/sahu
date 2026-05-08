from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phone', 'name', 'email', 'profile_photo', 'is_member', 'is_admin', 'date_joined']
        read_only_fields = ['is_admin', 'date_joined', 'is_member']
