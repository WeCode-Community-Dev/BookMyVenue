package main

import (
	"auth-service/internal/auth"
	delivery "auth-service/internal/delivery/http"
	"log"
	"net/http"
)

func main() {
	jwtSecret := "secret"

	jwtManager := auth.NewJWTManager(jwtSecret)
	authSvc := auth.NewAuthService(jwtManager)

	mux := http.NewServeMux()
	delivery.NewAuthHandler(mux, authSvc)

	port := ":8080"
	log.Printf("auth-service listening: %s", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Fatal: Server hit an error: %v", err)
	}
}
