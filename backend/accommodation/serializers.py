from rest_framework import serializers
from .models import Accommodation, Booking
from auth_app.serializers import UserSerializer

class AccommodationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accommodation
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    accommodation_detail = AccommodationSerializer(source='accommodation', read_only=True)
    user_detail = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['user', 'status', 'total_price', 'created_at']
