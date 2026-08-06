from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from accounts.models import AuthAccount, User


class AuthAccountInline(admin.TabularInline):
    model = AuthAccount
    extra = 0
    readonly_fields = ("created_at",)
    fields = ("provider", "provider_user_id", "password_hash", "created_at")


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    inlines = (AuthAccountInline,)
    list_display = (
        "email",
        "phone",
        "full_name",
        "role",
        "is_active",
        "is_blocked",
        "created_at",
    )
    list_filter = ("role", "is_active", "is_blocked", "is_email_verified")
    search_fields = ("email", "phone", "full_name")
    ordering = ("-created_at",)
    readonly_fields = ("last_login", "created_at", "updated_at")
    filter_horizontal = ()

    fieldsets = (
        (None, {"fields": ("email", "phone", "password")}),
        ("Personal info", {"fields": ("full_name", "avatar_url")}),
        (
            "Permissions",
            {
                "fields": (
                    "role",
                    "is_active",
                    "is_blocked",
                    "is_email_verified",
                    "is_phone_verified",
                ),
            },
        ),
        ("Important dates", {"fields": ("last_login", "created_at", "updated_at")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "phone",
                    "password1",
                    "password2",
                    "role",
                    "full_name",
                ),
            },
        ),
    )


# @admin.register(AuthAccount)
# class AuthAccountAdmin(admin.ModelAdmin):
#     list_display = ("user", "provider", "provider_user_id", "created_at")
#     list_filter = ("provider",)
#     search_fields = ("user__email", "user__phone", "provider_user_id")
#     readonly_fields = ("created_at",)
#     ordering = ("-created_at",)
#     autocomplete_fields = ("user",)
