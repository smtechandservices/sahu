from rest_framework import serializers
from .models import MatrimonialProfile
from auth_app.serializers import UserSerializer

class MatrimonialProfileSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)

    class Meta:
        model = MatrimonialProfile
        fields = '__all__'
        read_only_fields = ['user', 'is_approved', 'created_at']
