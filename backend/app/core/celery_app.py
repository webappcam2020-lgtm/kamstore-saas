from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "kamstore_tasks",
    broker=settings.get_celery_broker,
    backend=settings.get_celery_backend,
    include=[
        "app.tasks.scraping_tasks",
        "app.tasks.email_tasks",
    ]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Africa/Douala",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,
    worker_prefetch_multiplier=1,
    beat_schedule={
        "check-scraping-queue-every-5-min": {
            "task": "app.tasks.scraping_tasks.scheduled_health_check",
            "schedule": 300.0,
        },
    }
)
