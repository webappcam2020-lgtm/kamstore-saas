import csv
import io
from typing import Any, List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api import deps
from app.models.user import User
from app.models.scraping_job import ScrapingJob, ScrapingStatus
from app.models.lead import Lead
from app.schemas.scraping import (
    ScrapingJobCreate,
    ScrapingJobResponse,
    ProxyStatusResponse,
    ProxyConfig
)
from app.schemas.lead import LeadResponse
from app.services.scraper_service import scraper_service
from app.tasks.scraping_tasks import run_async_scraping_job

router = APIRouter()

@router.post("/jobs", response_model=ScrapingJobResponse)
async def create_scraping_job(
    job_in: ScrapingJobCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Launch a web scraping job with proxy rotation and AI lead extraction.
    Queues job in Celery worker or executes synchronously if worker not active.
    """
    job = ScrapingJob(
        user_id=current_user.id,
        target_url=job_in.target_url,
        keyword=job_in.keyword,
        engine=job_in.engine,
        proxy_rotation_enabled=job_in.enable_proxy_rotation,
        status=ScrapingStatus.pending
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)

    # Trigger async Celery task
    try:
        task = run_async_scraping_job.delay(str(job.id), ai_model=job_in.ai_model or "auto")
        job.celery_task_id = task.id
        await db.commit()
    except Exception:
        # Fallback to direct synchronous execution in background
        await scraper_service.execute_job(
            db, job,
            extract_leads=job_in.extract_leads_with_ai,
            ai_model=job_in.ai_model or "auto"
        )

    return job

@router.get("/jobs", response_model=List[ScrapingJobResponse])
async def list_scraping_jobs(
    skip: int = 0,
    limit: int = 20,
    status: Optional[ScrapingStatus] = None,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """List scraping jobs for the current user."""
    query = select(ScrapingJob).where(ScrapingJob.user_id == current_user.id)
    if status:
        query = query.where(ScrapingJob.status == status)
    query = query.order_by(ScrapingJob.created_at.desc()).offset(skip).limit(limit)
    res = await db.execute(query)
    return res.scalars().all()

@router.get("/jobs/{id}", response_model=ScrapingJobResponse)
async def get_scraping_job(
    id: UUID,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """Get scraping job status and extracted leads."""
    stmt = (
        select(ScrapingJob)
        .options(selectinload(ScrapingJob.leads))
        .where(ScrapingJob.id == id)
    )
    res = await db.execute(stmt)
    job = res.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return job

@router.get("/proxies", response_model=ProxyStatusResponse)
async def get_proxy_status(
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """View active proxy rotation pool, health scores, and rotation strategy."""
    return scraper_service.rotator.get_status()

@router.post("/proxies/configure")
async def configure_proxies(
    config: ProxyConfig,
    current_user: User = Depends(deps.get_current_admin)
) -> Any:
    """Configure custom proxy pool and rotation strategy."""
    scraper_service.rotator = type(scraper_service.rotator)(
        proxies=config.proxies,
        strategy=config.strategy
    )
    return {"status": "ok", "configured_proxies": len(config.proxies), "strategy": config.strategy}

@router.get("/leads", response_model=List[LeadResponse])
async def list_extracted_leads(
    skip: int = 0,
    limit: int = 50,
    category: Optional[str] = None,
    city: Optional[str] = None,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """List extracted leads with category/city filters."""
    query = select(Lead).where((Lead.user_id == current_user.id) | (Lead.user_id.is_(None)))
    if category:
        query = query.where(Lead.category == category)
    if city:
        query = query.where(Lead.city == city)
    query = query.order_by(Lead.confidence_score.desc()).offset(skip).limit(limit)
    res = await db.execute(query)
    return res.scalars().all()

@router.get("/leads/export")
async def export_leads_csv(
    category: Optional[str] = None,
    city: Optional[str] = None,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Response:
    """Export extracted leads as CSV file."""
    query = select(Lead).where((Lead.user_id == current_user.id) | (Lead.user_id.is_(None)))
    if category:
        query = query.where(Lead.category == category)
    if city:
        query = query.where(Lead.city == city)
    res = await db.execute(query)
    leads = res.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Entreprise", "Contact", "Email", "Téléphone", "Catégorie", "Ville", "Adresse", "Confiance", "Résumé IA"])

    for l in leads:
        writer.writerow([
            l.company_name,
            l.contact_person or "",
            l.email or "",
            l.phone or "",
            l.category or "",
            l.city or "",
            l.address or "",
            f"{l.confidence_score:.2f}",
            l.ai_summary or ""
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="kamstore_leads_export.csv"'}
    )
