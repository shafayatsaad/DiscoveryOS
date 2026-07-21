# Purpose: Provide one-command Docker Compose workflows for the hackathon demo.

COMPOSE ?= docker compose

.PHONY: up down test demo logs seed

up:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

test:
	$(COMPOSE) run --rm api pytest
	$(COMPOSE) run --rm frontend npm run typecheck --workspace=apps/web

demo: up
	@echo "DiscoveryOS demo is starting."
	@echo "Frontend: http://localhost:3000"
	@echo "API health: http://localhost:8000/api/v1/health"
	@echo "API readiness: http://localhost:8000/api/v1/ready"
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f api frontend

seed:
	$(COMPOSE) run --rm api python /app/scripts/seed_demo.py
