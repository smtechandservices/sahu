from rest_framework import serializers
from .models import JobListing, Advertisement

class JobListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = '__all__'

class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = '__all__'
