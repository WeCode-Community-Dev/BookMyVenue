from django.contrib.auth.backends import BaseBackend
from django.db.models import Q

from accounts.models import User


class AuthAccountBackend(BaseBackend):
    def authenticate(
        self,
        request,
        username=None,
        password=None,
        email=None,
        phone=None,
        **kwargs,
    ):
        if not password:
            return None

        identifier = email or phone or username
        if not identifier:
            return None

        user = User.objects.filter(
            Q(email=identifier) | Q(phone=identifier),
        ).first()
        if user is None or not user.is_active or user.is_blocked:
            return None

        if user.check_password(password):
            return user
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
