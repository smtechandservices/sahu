from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from api.models import UserSession

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        
        # Check if the session is active using refresh_jti claim
        refresh_jti = validated_token.get('refresh_jti')
        if refresh_jti:
            session_exists = UserSession.objects.filter(
                user=user,
                refresh_jti=refresh_jti,
                is_active=True
            ).exists()
            if not session_exists:
                raise AuthenticationFailed(
                    'Session has been terminated or is invalid.',
                    code='session_terminated'
                )
        return user
