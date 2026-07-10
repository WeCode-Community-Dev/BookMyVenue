import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.logging import setup_logging

setup_logging()

logger = logging.getLogger(__name__)

import app.models  # noqa: F401 — register every ORM model before any job queries run

from app.jobs.runner import JOBS, run_job as _run_job


def run_job(job_name: str) -> bool:
    if job_name not in JOBS:
        print(f"Unknown job: {job_name}")
        return False

    print(f"\n🚀 Running {job_name}")

    try:
        processed = _run_job(job_name)
        print(f"✅ {job_name} completed. Processed: {processed}")
        return True

    except Exception:
        logger.exception("%s failed", job_name)
        print(f"❌ {job_name} failed")
        return False


def run_all():
    print("Running ALL jobs...\n")

    success = 0

    for job_name in JOBS:
        if run_job(job_name):
            success += 1

    print(f"\nCompleted {success}/{len(JOBS)} jobs.")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "all":
        run_all()
    elif len(sys.argv) > 1:
        run_job(sys.argv[1])
    else:
        print("Usage:")
        print("  python run_job.py <job_name>")
        print("  python run_job.py all")
        print("\nAvailable jobs:", list(JOBS.keys()))
