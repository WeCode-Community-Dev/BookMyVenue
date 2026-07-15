from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    supabase_url: str
    supabase_jwt_secret: str
    supabase_service_role_key: str
    # "development" | "production". In production the interactive API docs
    # (/docs, /redoc) are disabled so the endpoint surface isn't publicly listed.
    environment: str = "development"

    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_currency: str = "inr"

    # Signing secret for Supabase's "Send Email" Auth Hook (Standard Webhooks
    # format, e.g. "v1,whsec_..."). Configured in supabase/config.toml
    # ([auth.hook.send_email]) to point at /api/auth/hooks/send-email, so we
    # send confirmation/recovery emails ourselves instead of via Supabase's
    # own mailer (same reason as request_password_reset).
    supabase_auth_hook_secret: str = ""

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    # Email — Resend is primary, SMTP is the fallback transport
    resend_api_key: str = ""
    email_from: str = "Venue404 <no-reply@venue404.app>"
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""

    # Used to build deep links inside notification emails
    frontend_base_url: str = "https://venue404-user-web-git-main-venue123.vercel.app"

    # Used to build the Supabase invite redirect for admin-invited venue owners
    owner_portal_base_url: str = "https://venue404-owner-portal-git-main-venue123.vercel.app"

    # Comma-separated list of allowed browser origins for CORS. Defaults to the
    # local dev ports; in production set this to the deployed Vercel app URLs.
    cors_origins: str = "https://venue404-owner-portal-git-main-venue123.vercel.app,https://venue404-user-web-git-main-venue123.vercel.app,https://venue404-admin-panel-git-main-venue123.vercel.app,http://localhost:5397,http://localhost:5398,http://localhost:5399"

    # Shared secret guarding the machine-to-machine job-runner endpoint. Empty
    # disables the endpoint (returns 503). Set to a long random value in prod.
    job_runner_token: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    # Only the process that owns scheduling should flip this on
    enable_jobs: bool = False

    super_admin_name: str = ""
    super_admin_email: str = ""
    super_admin_password: str = ""
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    # Upstash Redis — used as a fast delivery channel for search index jobs.
    # If unset, the worker falls back to polling search_index_jobs directly.
    upstash_redis_url: str = ""
    upstash_redis_token: str = ""
    upstash_search_queue_key: str = "search_index_jobs"
    upstash_invoice_queue_key: str = "booking_invoice_jobs"

    # Jina AI — used to generate venue embeddings for semantic search.
    jina_api_key: str = ""
    jina_embedding_model: str = "jina-embeddings-v3"
    embedding_dimensions: int = 1024

    search_diagnostics_enabled: bool = False

    # Groq — used for Deep Research's query-understanding stage (OpenAI-compatible API).
    groq_api_key: str = ""
    groq_model: str = "llama-3.1-8b-instant"
    groq_base_url: str = "https://api.groq.com/openai/v1"

    # Google Places API Key
    google_places_api_key: str = ""

    # Sentry — unset disables it entirely (no-op), matching the fail-open
    # pattern used for the other optional integrations in this file.
    sentry_dsn: str = ""
    sentry_traces_sample_rate: float = 0.0

    log_level: str = "INFO"  # DEBUG / INFO / WARNING / ERROR

    class Config:
        env_file = ".env"
        # Business constants (token_advance_pct, platform_fee_pct,
        # deep_research_rate_limit_per_minute, deep_research_daily_limit, ...)
        # moved to the DB-backed platform_settings table — ignore, don't crash
        # on, leftover .env entries for them during rollout.
        extra = "ignore"


settings = Settings()
