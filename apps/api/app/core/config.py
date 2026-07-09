from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    supabase_url: str
    supabase_jwt_secret: str
    supabase_service_role_key: str
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_currency: str = "inr"

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
    cors_origins: str = ("https://venue404-owner-portal-git-main-venue123.vercel.app,https://venue404-user-web-git-main-venue123.vercel.app,https://venue404-admin-panel-git-main-venue123.vercel.app,http://localhost:5397,http://localhost:5398,http://localhost:5399"
    )

    # Shared secret guarding the machine-to-machine job-runner endpoint. Empty
    # disables the endpoint (returns 503). Set to a long random value in prod.
    job_runner_token: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    # Booking economics (percent of venue price)
    token_advance_pct: int = 20
    platform_fee_pct: int = 5

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

    search_min_vector_similarity: float = 0.15
    search_wedding_boost: float = 1.85
    search_event_boost: float = 1.40
    search_fts_weight: float = 0.3
    search_corporate_boost: float = 1.40
    search_vector_weight: float = 0.7
    search_diagnostics_enabled: bool = False

    search_normalizer_match_threshold: int = 85
    search_normalizer_min_token_len: int = 3

    # Groq — used for Deep Research's query-understanding stage (OpenAI-compatible API).
    groq_api_key: str = ""
    groq_model: str = "llama-3.1-8b-instant"
    groq_base_url: str = "https://api.groq.com/openai/v1"

    # Google Places API Key
    google_places_api_key: str = ""

    # Deep Research rate limiting — protects the Groq / Google Places /
    # Cloudinary calls behind /search and /external from burst abuse and
    # caps the per-user daily cost. Backed by Upstash Redis; if Upstash isn't
    # configured, limiting is skipped (fails open, matching indexer.py).
    deep_research_rate_limit_per_minute: int = 5
    deep_research_daily_limit: int = 4

    log_level: str = "INFO"  # DEBUG / INFO / WARNING / ERROR

    class Config:
        env_file = ".env"


settings = Settings()
