COMPOSE := docker compose
BACKEND := $(COMPOSE) exec backend

.PHONY: up down build rebuild logs shell migrate makemigrations createsuperuser seed test

up_d:
	$(COMPOSE) up -d

up:
	$(COMPOSE) up


down:
	$(COMPOSE) down

build:
	$(COMPOSE) build

rebuild:
	$(COMPOSE) build --no-cache

logs:
	$(COMPOSE) logs -f

shell:
	$(BACKEND) python manage.py shell

migrate:
	$(BACKEND) python manage.py migrate

makemigrations:
	$(BACKEND) python manage.py makemigrations

createsuperuser:
	$(BACKEND) python manage.py createsuperuser

seed:
	$(BACKEND) python manage.py migrate
	$(BACKEND) python manage.py seed

test:
	$(BACKEND) python manage.py test
