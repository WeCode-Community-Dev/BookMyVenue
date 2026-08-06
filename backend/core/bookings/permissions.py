from rest_framework import permissions

from accounts.models import UserRole


class CanAccessBooking(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user.is_authenticated:
            return False
        if user.role == UserRole.ADMIN:
            return True
        if obj.user_id == user.id:
            return True
        return obj.venue_schedule.group.venue.owner_id == user.id
