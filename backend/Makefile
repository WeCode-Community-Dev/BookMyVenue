include .env

sqlc:
	sqlc generate

migrate-up:
	migrate -path db/migrations -database "$(DATABASE_URL)" up

migrate-down:
	migrate -path db/migrations -database "$(DATABASE_URL)" down 1

migrate-drop:
	migrate -path db/migrations -database "$(DATABASE_URL)" drop

run:
	go run cmd/server/main.go