from django.contrib import admin

# Register your models here.
from .models import User,OwnerProfile,UserProfile

admin.site.register(User)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "address", "phone_number")


@admin.register(OwnerProfile)
class OwnerProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "address", "phone_number")