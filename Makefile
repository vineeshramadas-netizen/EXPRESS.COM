SHELL := /bin/bash

.PHONY: up logs migrate seed stop down

up:
	docker-compose up --build -d

logs:
	docker-compose logs -f --tail=200

migrate:
	npx prisma migrate dev --name init

seed:
	npx ts-node prisma/seed.ts

stop:
	docker-compose stop

down:
	docker-compose down -v
