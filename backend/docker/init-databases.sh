#!/bin/bash
# Creates per-service databases inside the same Postgres instance.
# Runs only on first volume init (docker-entrypoint-initdb.d).
set -euo pipefail

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE EXTENSION IF NOT EXISTS postgis;
	CREATE EXTENSION IF NOT EXISTS pg_trgm;
EOSQL

create_db_if_missing() {
	local db_name="$1"
	local exists
	exists="$(psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres -tAc \
		"SELECT 1 FROM pg_database WHERE datname='${db_name}'")"
	if [[ "${exists}" != "1" ]]; then
		psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres \
			-c "CREATE DATABASE ${db_name} OWNER ${POSTGRES_USER};"
	fi
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$db_name" <<-EOSQL
		CREATE EXTENSION IF NOT EXISTS postgis;
		CREATE EXTENSION IF NOT EXISTS pg_trgm;
	EOSQL
}

create_db_if_missing bookmyvenue_reviews
create_db_if_missing bookmyvenue_venue
