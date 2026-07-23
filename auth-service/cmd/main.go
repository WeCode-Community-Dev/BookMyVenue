package main

import (
	"auth-service/internal/auth"
	delivery "auth-service/internal/delivery/http"
	amqp "github.com/rabbitmq/amqp091-go"

	"auth-service/internal/repository"
	"context"
	"log"
	"time"

	"bookmyvenue.com/shared/config"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type amqpPublisher struct {
	ch    *amqp.Channel
	queue string
}

func (p *amqpPublisher) PublishLogin(userID string) error {
	body := []byte(`{"user_id":"` + userID + `"}`)
	return p.ch.Publish(
		"", // exchange
		p.queue,
		false, // mandatory
		false, // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
			Timestamp:   time.Now(),
		},
	)
}

func main() {
	// ── Config ────────────────────────────────────────────────────────────────
	connStr := config.MustGetEnv("DATABASE_URL",
		"postgres://postgres:secret@localhost:5432/wecode_auth?sslmode=disable")
	jwtSecret := config.MustGetEnv("JWT_SECRET", "secret")
	broker, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatal(err)
	}
	defer broker.Close()

	// Create a channel for publishing. We keep a single publisher instance
	// and pass it to the auth service.
	ch, err := broker.Channel()
	if err != nil {
		log.Fatalf("failed to open amqp channel: %v", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"logins",
		true,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		log.Fatalf("failed to declare exchange: %v", err)
	}

	pub := &amqpPublisher{ch: ch, queue: q.Name}

	port := config.MustGetEnv("PORT", ":8080")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	dbPool, err := pgxpool.New(ctx, connStr)
	if err != nil {
		log.Fatalf("DB Connection failed: %v", err)
	}
	defer dbPool.Close()

	jwtManager := auth.NewJWTManager(jwtSecret)
	userRepo := repository.NewPostgresUserRepository(dbPool)
	authSvc := auth.NewAuthService(userRepo, jwtManager, pub)

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	api := r.Group("/")
	delivery.NewAuthHandler(api, authSvc)

	log.Printf("auth-service listening: %s", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Fatal: Server hit an error: %v", err)
	}
}
