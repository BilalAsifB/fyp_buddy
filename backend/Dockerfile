# Backend Dockerfile with UV support
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH="/app" \
    PORT=8000 \
    UV_CACHE_DIR=/tmp/uv-cache

# Install system dependencies and uv
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir uv

# Create app directory
WORKDIR /app

# Create logs directory
RUN mkdir -p /app/logs

# Copy dependency files first for caching
COPY pyproject.toml .
COPY uv.lock .

# Install Python dependencies using uv
# Use uv pip instead of uv sync for Docker compatibility
RUN uv venv .venv && \
    uv pip install --python .venv/bin/python -r pyproject.toml

# Activate virtual environment by updating PATH
ENV PATH="/app/.venv/bin:$PATH"

# Copy application code
COPY . .

# Create non-root user for security
RUN adduser --disabled-password --gecos '' --uid 1000 appuser && \
    chown -R appuser:appuser /app && \
    chmod -R 755 /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health', timeout=5)"

# Run the application
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]