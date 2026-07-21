FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install --no-cache-dir uv && uv pip install --system -e .

COPY . .

# Shell form so $PORT (injected by Render) expands; defaults to 8000 locally.
# No --reload: this image is what Render deploys (render.yaml), and the
# file-watcher that flag starts has no place in production — any runtime
# write under /app (temp files, __pycache__, uploads) can trigger an
# unwanted full restart and drop in-flight requests.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
