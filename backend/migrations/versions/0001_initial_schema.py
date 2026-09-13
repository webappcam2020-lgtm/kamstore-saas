"""Initial schema with Leads, Scraping Jobs, Payments (Notch Pay & Campay), and Bookings

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-09-13 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Extensions
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    op.execute('CREATE EXTENSION IF NOT EXISTS "vector"')
    op.execute('CREATE EXTENSION IF NOT EXISTS "pg_trgm"')

    # Users
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('email', sa.String(), nullable=False, unique=True, index=True),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('role', sa.Enum('user', 'admin', 'host', name='user_role'), server_default='user', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('is_verified', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('avatar_url', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now())
    )

    # Scraping Jobs
    op.create_table(
        'scraping_jobs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=True),
        sa.Column('target_url', sa.String(), nullable=False),
        sa.Column('keyword', sa.String(), nullable=True),
        sa.Column('engine', sa.Enum('scrapy', 'playwright', 'puppeteer', 'async_http', name='scraping_engine'), server_default='async_http', nullable=False),
        sa.Column('proxy_rotation_enabled', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('proxy_used', sa.String(), nullable=True),
        sa.Column('status', sa.Enum('pending', 'running', 'completed', 'failed', name='scraping_status'), server_default='pending', nullable=False),
        sa.Column('leads_extracted', sa.Integer(), server_default='0', nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('celery_task_id', sa.String(), nullable=True),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True)
    )

    # Leads
    op.create_table(
        'leads',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=True),
        sa.Column('job_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('scraping_jobs.id', ondelete='SET NULL'), nullable=True),
        sa.Column('company_name', sa.String(), nullable=False, index=True),
        sa.Column('contact_person', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=True, index=True),
        sa.Column('phone', sa.String(), nullable=True, index=True),
        sa.Column('category', sa.String(), nullable=True, index=True),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('city', sa.String(), server_default='Douala', nullable=True, index=True),
        sa.Column('country', sa.String(), server_default='Cameroun', nullable=True),
        sa.Column('source_url', sa.String(), nullable=True),
        sa.Column('confidence_score', sa.Float(), server_default='0.85', nullable=False),
        sa.Column('raw_text', sa.Text(), nullable=True),
        sa.Column('ai_summary', sa.Text(), nullable=True),
        sa.Column('sentiment', sa.String(), server_default='neutral', nullable=True),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )

    # Listings
    op.create_table(
        'listings',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('owner_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.Enum('hotel', 'restaurant', 'activity', 'housing', name='listing_category'), nullable=False),
        sa.Column('type', sa.Enum('tourism', 'housing', name='listing_type'), nullable=False),
        sa.Column('price_per_night', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(), server_default='XAF', nullable=False),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('city', sa.String(), nullable=False),
        sa.Column('country', sa.String(), server_default='Cameroun', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )

    # Listing Images
    op.create_table(
        'listing_images',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('listing_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('listings.id', ondelete='CASCADE'), nullable=False),
        sa.Column('image_url', sa.String(), nullable=False),
        sa.Column('is_primary', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('order', sa.Integer(), server_default='0', nullable=False)
    )

    # Bookings
    op.create_table(
        'bookings',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('listing_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('listings.id', ondelete='CASCADE'), nullable=False),
        sa.Column('check_in', sa.DateTime(timezone=True), nullable=False),
        sa.Column('check_out', sa.DateTime(timezone=True), nullable=False),
        sa.Column('guests', sa.Integer(), server_default='1', nullable=False),
        sa.Column('total_price', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(), server_default='XAF', nullable=False),
        sa.Column('status', sa.Enum('pending', 'confirmed', 'cancelled', 'completed', name='booking_status'), server_default='pending', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )

    # Payments
    op.create_table(
        'payments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('booking_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('bookings.id', ondelete='SET NULL'), nullable=True),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(), server_default='XAF', nullable=False),
        sa.Column('provider', sa.Enum('notch_pay', 'campay', 'mtn_momo', 'orange_money', 'card', name='payment_provider'), nullable=False),
        sa.Column('status', sa.Enum('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', name='payment_status'), server_default='pending', nullable=False),
        sa.Column('transaction_ref', sa.String(), unique=True, index=True, nullable=False),
        sa.Column('provider_ref', sa.String(), nullable=True, index=True),
        sa.Column('checkout_url', sa.String(), nullable=True),
        sa.Column('customer_phone', sa.String(), nullable=True),
        sa.Column('customer_email', sa.String(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )

def downgrade() -> None:
    op.drop_table('payments')
    op.drop_table('bookings')
    op.drop_table('listing_images')
    op.drop_table('listings')
    op.drop_table('leads')
    op.drop_table('scraping_jobs')
    op.drop_table('users')
