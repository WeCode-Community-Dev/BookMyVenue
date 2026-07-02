FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install --no-cache-dir uv && uv pip install --system -e .

COPY . .

# Shell form so $PORT (injected by Render) expands; defaults to 8000 locally.
CMD ["sh", "-c", "uvicorn app.main:app --reload --host 0.0.0.0 --port ${PORT:-8000}"]
