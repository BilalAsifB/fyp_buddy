# Run the API normally
dev:
	uv run python main.py

# Run API with auto-reload for local development
dev-reload:
	uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests
test:
	uv run pytest tests/ -v

# Run tests with coverage
test-cov:
	uv run pytest tests/ --cov=app --cov=src --cov-report=html

# Lint and format code
lint:
	uv run black .
	uv run isort .
	uv run flake8 .

# Format code only
format:
	uv run black .
	uv run isort .

# Type checking
type-check:
	uv run mypy app/ src/
