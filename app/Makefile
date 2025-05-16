include .env

run:
	poetry run uvicorn main:app --reload --use-colors --port 4000

### alembic
revision:
	poetry run alembic revision --autogenerate -m $(filter-out $@,$(MAKECMDGOALS))

upgrade:
	poetry run alembic upgrade head

downgrade:
	poetry run alembic downgrade -1

history:
	poetry run alembic history

add_event:
	poetry run python3 add_event.py --hero rSem2cgrfgbQPuYZi2hJ2yrJNC3dZHkvHSqVV7L26At --category 3

cron:
	poetry run python3 scheduler.py

metadata:
	poetry run uvicorn metadata:app --reload --use-colors --port 5000
