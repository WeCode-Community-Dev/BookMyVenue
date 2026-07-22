package main

import (
	"booking-service/internal/booking"
	delivery "booking-service/internal/delivery/http"
	"booking-service/internal/repository"
	"booking-service/internal/venue"
	"context"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"bookmyvenue.com/shared/config"
)

func main() {
	// ── Config ────────────────────────────────────────────────────────────────
	dbURL := config.MustGetEnv("DATABASE_URL",
		"postgres://postgres:secret@localhost:5433/bookmyvenue_bookings?sslmode=disable")
	redisAddr := config.MustGetEnv("REDIS_ADDR", "localhost:6379")
	jwtSecret := config.MustGetEnv("JWT_SECRET", "secret")
	port := config.MustGetEnv("PORT", ":8081")

	// ── PostgreSQL ────────────────────────────────────────────────────────────
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	dbPool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatalf("DB connection failed: %v", err)
	}
	defer dbPool.Close()

	// ── Redis ─────────────────────────────────────────────────────────────────
	redisClient := redis.NewClient(&redis.Options{Addr: redisAddr})
	if _, err := redisClient.Ping(ctx).Result(); err != nil {
		log.Fatalf("Redis connection failed: %v", err)
	}
	defer redisClient.Close()

	// ── Repositories & Services ───────────────────────────────────────────────
	venueRepo := repository.NewPostgresVenueRepository(dbPool)
	bookingRepo := repository.NewPostgresBookingRepository(dbPool)
	bookingCache := repository.NewRedisBookingCache(redisClient)

	venueSvc := venue.NewVenueService(venueRepo)
	bookingSvc := booking.NewBookingService(bookingRepo, bookingCache)

	// ── Router ────────────────────────────────────────────────────────────────
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	api := r.Group("/")
	delivery.RegisterVenueRoutes(api, venueSvc, jwtSecret)
	delivery.RegisterBookingRoutes(api, bookingSvc, jwtSecret)

	log.Printf("booking-service listening on %s", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
