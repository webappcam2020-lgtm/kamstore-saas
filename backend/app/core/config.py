import json
from typing import List, Union, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "KamStore SaaS"
    debug: bool = False
    environment: str = "development"
    
    # Database
    database_url: str = "postgresql+asyncpg://kamstore:kamstore_secret_2024@localhost:5432/kamstore_db"
    redis_url: str = "redis://:kamstore_redis_2024@localhost:6379/0"
    
    # Celery
    celery_broker_url: Optional[str] = None
    celery_result_backend: Optional[str] = None
    
    # JWT
    secret_key: str = "super-secret-kamstore-key-change-in-production-2024"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    refresh_token_expire_days: int = 7
    
    # Payment Gateway - Notch Pay
    notchpay_public_key: str = ""
    notchpay_private_key: str = ""
    notchpay_hash_key: str = ""
    notchpay_webhook_secret: str = ""
    notchpay_base_url: str = "https://api.notchpay.co"
    
    # Payment Gateway - Campay
    campay_username: str = ""
    campay_password: str = ""
    campay_webhook_secret: str = ""
    campay_environment: str = "sandbox"  # sandbox or prod
    campay_base_url: str = "https://demo.campay.net/api"  # or https://campay.net/api
    
    # Legacy direct Momo / Orange (optional)
    momo_api_key: str = ""
    momo_api_secret: str = ""
    orange_api_key: str = ""
    
    # AI / NLP Engines
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    huggingface_api_token: str = ""
    gemini_api_key: str = ""
    
    # Scraping & Proxy Rotation
    scraper_proxies: str = ""  # Comma-separated proxies
    scraper_user_agents: str = ""
    scraper_request_timeout: int = 15
    scraper_max_retries: int = 3
    
    # External APIs
    numverify_api_key: str = ""
    
    # Email / SMTP
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    email_from: str = "noreply@kamstore.cm"
    
    # CORS
    cors_origins: Union[str, List[str]] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    @property
    def get_cors_origins(self) -> List[str]:
        if isinstance(self.cors_origins, str):
            try:
                return json.loads(self.cors_origins)
            except json.JSONDecodeError:
                return [origin.strip() for origin in self.cors_origins.split(",")]
        return self.cors_origins
    
    @property
    def get_celery_broker(self) -> str:
        return self.celery_broker_url or self.redis_url
        
    @property
    def get_celery_backend(self) -> str:
        return self.celery_result_backend or self.redis_url

settings = Settings()
