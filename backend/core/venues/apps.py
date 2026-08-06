from django.apps import AppConfig


class VenuesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "venues"

    def ready(self):
        from django.contrib import admin

        import venues.signals  # noqa: F401
        from core.admin_dashboard import get_dashboard_stats

        original_index = admin.site.index

        def index(request, extra_context=None):
            extra_context = extra_context or {}
            user = request.user
            if user.is_authenticated and user.is_staff:
                extra_context["bmv_dashboard_stats"] = get_dashboard_stats()
            return original_index(request, extra_context)

        admin.site.index = index
