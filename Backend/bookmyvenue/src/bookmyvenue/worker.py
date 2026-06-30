import os
from celery import Celery
from src.bookmyvenue.core.config import settings


app = Celery(
    app_name="bookmyvenue",
    broker=os.environ.get("UPSTASH_REDIS_CELERY_URL"),
    backend=settings.CELERY_RESULT_BACKEND
)

#auto-discover is used to look into the tasks.py files present inside the src.bookmyvenue package which may contain many other sub modules.
app.autodiscover_tasks(
    packages=['src.bookmyvenue.BackgroundWorker.Owner']
)

app.conf.update(
    task_track_started=True,
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    broker_use_ssl={"ssl_cert_reqs": 0},
    redis_backend_use_ssl={"ssl_cert_reqs": 0},
)