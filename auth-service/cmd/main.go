package main

import (
	"auth-service/internal/auth"
	delivery "auth-service/internal/delivery/http"
	"auth-service/internal/repository"
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
	"time"
)

func main() {
	// Setup Database
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	connStr := "postgres://postgres:secret@localhost:5432/wecode_auth?sslmode=disable"
	dbPool, err := pgxpool.New(ctx, connStr)
	if err != nil {
		log.Fatalf("DB Connection failed: %v", err)
	}
	defer dbPool.Close()

	jwtSecret := "secret"
	jwtManager := auth.NewJWTManager(jwtSecret)

	userRepo := repository.NewPostgresUserRepository(dbPool)

	authSvc := auth.NewAuthService(userRepo, jwtManager)

	mux := http.NewServeMux()
	delivery.NewAuthHandler(mux, authSvc)

	port := ":8080"
	log.Printf("auth-service listening: %s", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Fatal: Server hit an error: %v", err)
	}
}
