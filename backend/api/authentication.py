from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from datetime import timedelta
from api.models import UserSession

SESSION_IDLE_TIMEOUT = timedelta(minutes=15)

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)

        # Auto-expire sessions idle for more than 15 minutes
        cutoff = timezone.now() - SESSION_IDLE_TIMEOUT
        UserSession.objects.filter(user=user, is_active=True, last_activity__lt=cutoff).update(is_active=False)

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
