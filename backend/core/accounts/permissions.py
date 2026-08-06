from rest_framework.permissions import BasePermission


class IsInternalService(BasePermission):
    """Allow requests authenticated with InternalAPIKeyAuthentication."""

    def has_permission(self, request, view):
        return request.auth is not None
