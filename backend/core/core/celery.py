import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

app = Celery("bookmyvenue")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.conf.beat_schedule = {
    "expire-booking-sessions": {
        "task": "expire_booking_sessions",
        "schedule": 60.0,
    },
}
app.autodiscover_tasks()
