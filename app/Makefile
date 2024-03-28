run:
	set -o allexport; source .env; set +o allexport; . .venv/bin/activate; uvicorn main:app --reload --use-colors --port 4000

### alembic
revision:
	set -o allexport; source .env; set +o allexport; . .venv/bin/activate; alembic revision --autogenerate -m $(filter-out $@,$(MAKECMDGOALS))

upgrade:
	set -o allexport; source .env; set +o allexport; . .venv/bin/activate; alembic upgrade head

downgrade:
	set -o allexport; source .env; set +o allexport; . .venv/bin/activate; alembic downgrade -1

history:
	set -o allexport; source .env; set +o allexport; . .venv/bin/activate; alembic history

generate:
	anchorpy client-gen ../anchor/target/idl/autohero.json autohero/

add_event:
	set -o allexport; source .env; set +o allexport; . .venv/bin/activate; python3 add_event.py

chain:
	set -o allexport; source .env; set +o allexport; . .venv/bin/activate; python3 chain.py

cron:
	set -o allexport; source .env; set +o allexport; . .venv/bin/activate; python3 scheduler.py
