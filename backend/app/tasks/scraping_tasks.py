import asyncio
import logging
import uuid
from app.core.celery_app import celery_app
from app.core.database import AsyncSessionLocal
from app.models.scraping_job import ScrapingJob
from app.services.scraper_service import scraper_service
from sqlalchemy import select

logger = logging.getLogger(__name__)

@celery_app.task(name="app.tasks.scraping_tasks.run_async_scraping_job", bind=True)
def run_async_scraping_job(self, job_id: str, ai_model: str = "auto"):
    """Celery background worker task for web scraping with proxy rotation and AI lead extraction."""
    logger.info(f"Starting Celery async scraping task {self.request.id} for job {job_id}")

    async def _execute():
        async with AsyncSessionLocal() as session:
            stmt = select(ScrapingJob).where(ScrapingJob.id == uuid.UUID(job_id))
            res = await session.execute(stmt)
            job = res.scalar_one_or_none()
            if not job:
                logger.error(f"Job {job_id} not found")
                return {"status": "error", "message": "Job not found"}

            job.celery_task_id = self.request.id
            await scraper_service.execute_job(session, job, extract_leads=True, ai_model=ai_model)
            return {
                "status": job.status.value,
                "leads_extracted": job.leads_extracted,
                "proxy_used": job.proxy_used
            }

    loop = asyncio.get_event_loop()
    if loop.is_running():
        import nest_asyncio
        nest_asyncio.apply()
        return loop.run_until_complete(_execute())
    else:
        return asyncio.run(_execute())

@celery_app.task(name="app.tasks.scraping_tasks.scheduled_health_check")
def scheduled_health_check():
    """Periodic Celery Beat task to check proxy health and queue status."""
    logger.info("Executing scheduled scraper queue and proxy health check.")
    status = scraper_service.rotator.get_status()
    return {"status": "ok", "active_proxies": status.get("active_proxies_count")}
