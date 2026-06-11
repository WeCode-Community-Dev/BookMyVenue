package main

import (
	"log/slog"

	"github.com/WeCode-Community-Dev/BookMyVenue/config"
	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/routes"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		slog.Error("Error loading .env file", "err", err)
	}

	cfg := config.LoadConfig()
	db, err := config.ConnectDB(cfg)
	if err != nil {
		slog.Error("Failed to connect to database", "err", err)
		return
	}
	defer db.Close()

	queries := sqlc.New(db)

	// Create a Gin router with default middleware (logger and recovery)
	r := gin.Default()
	r.LoadHTMLGlob("../frontend/*")
	r.Static("/uploads", "./internal/venues/uploads")

	routes.SetupRouter(r, queries)

	// Start server on port 8080 (default)
	// Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
	r.Run()
}
