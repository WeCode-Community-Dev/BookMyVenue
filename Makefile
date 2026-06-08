.PHONY: up down lint format install

up:
	docker-compose up -d

down:
	docker-compose down

install:
	cd backend && pip install -r requirements.txt
	cd payment-service && pip install -r requirements.txt
	cd frontend && npm install

format:
	ruff check --fix backend/ payment-service/
	ruff format backend/ payment-service/

lint:
	cd frontend && npm run lint
