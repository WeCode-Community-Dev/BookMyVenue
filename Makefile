GONOSUMDB := bookmyvenue.com
export GONOSUMDB

.PHONY: dev build test lint tidy infra-up infra-down migrate clean

dev:
	@scripts/dev.sh

build:
	cd auth-service    && go build -o ../bin/auth-service ./cmd/main.go
	cd booking-service && go build -o ../bin/booking-service ./cmd/main.go

test:
	cd shared          && go test ./...
	cd auth-service    && go test ./...
	cd booking-service && go test ./...

lint:
	cd shared          && go vet ./...
	cd auth-service    && go vet ./...
	cd booking-service && go vet ./...

tidy:
	cd shared          && go mod tidy
	cd auth-service    && go mod tidy
	cd booking-service && go mod tidy

infra-up:
	docker compose -f booking-service/compose.yaml up -d

infra-down:
	docker compose -f booking-service/compose.yaml down

migrate:
	@scripts/migrate.sh

clean:
	rm -rf bin/
