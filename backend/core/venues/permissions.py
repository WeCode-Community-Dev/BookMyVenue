from rest_framework import permissions

from accounts.models import UserRole


class IsVenueOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user.is_authenticated:
            return False
        if user.role == UserRole.ADMIN:
            return True
        owner_id = getattr(obj, "owner_id", None)
        if owner_id is None and hasattr(obj, "venue"):
            owner_id = obj.venue.owner_id
        return owner_id == user.id


class CanManageVenues(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and user.role in (
            UserRole.VENUE,
            UserRole.ADMIN,
        )
