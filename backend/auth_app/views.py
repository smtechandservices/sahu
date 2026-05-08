from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, OTPRecord
from .serializers import UserSerializer
from django.utils import timezone
from datetime import timedelta

@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    phone = request.data.get('phone')
    if not phone:
        return Response({'error': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    OTPRecord.generate_otp(phone)
    return Response({'message': 'OTP sent successfully (mocked as 123456)'})

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    phone = request.data.get('phone')
    code = request.data.get('code')
    name = request.data.get('name') # Optional for login, required for signup
    
    if not phone or not code:
        return Response({'error': 'Phone and code are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check mock OTP
    if code != '123456':
        return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

    user, created = User.objects.get_or_create(phone=phone, defaults={'name': name or 'User'})
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': UserSerializer(user).data,
        'created': created
    })

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
