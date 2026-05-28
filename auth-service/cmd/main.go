package main

import (
	"auth-service/internal/auth"
	delivery "auth-service/internal/delivery/http"
	"auth-service/internal/repository"
	"context"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"bookmyvenue.com/shared/config"
)

func main() {
	// ── Config ────────────────────────────────────────────────────────────────
	connStr := config.MustGetEnv("DATABASE_URL",
		"postgres://postgres:secret@localhost:5432/wecode_auth?sslmode=disable")
	jwtSecret := config.MustGetEnv("JWT_SECRET", "secret")
	port := config.MustGetEnv("PORT", ":8080")

	// ── Database ──────────────────────────────────────────────────────────────
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	dbPool, err := pgxpool.New(ctx, connStr)
	if err != nil {
		log.Fatalf("DB Connection failed: %v", err)
	}
	defer dbPool.Close()

	// ── Wire-up ───────────────────────────────────────────────────────────────
	jwtManager := auth.NewJWTManager(jwtSecret)
	userRepo := repository.NewPostgresUserRepository(dbPool)
	authSvc := auth.NewAuthService(userRepo, jwtManager)

	r := gin.Default()
	api := r.Group("/")
	delivery.NewAuthHandler(api, authSvc)

	log.Printf("auth-service listening: %s", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Fatal: Server hit an error: %v", err)
	}
}
