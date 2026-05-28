package main

import (
	"log"
	"os"

	"github.com/WeCode-Community-Dev/BookMyVenue/api/database"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/routes"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file
	err := godotenv.Load(".env")
	if err != nil {
		log.Printf("Error loading .env file: %v", err)
	}
	database.ConnectPostgres()
	database.MigrateModels()

	// Create a new Gin server instance
	server := gin.Default()

	// Set Gin mode based on environment variable
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Set the port based on the environment variable, defaulting to 8080 if not set
	port := os.Getenv("GIN_ENGINE_PORT")
	if port == "" {
		port = "8080" // Default port if not specified
	}

	// Register api routes
	routes.RegisterUserRoutes(server.Group("/api"))

	// Run the server on the specified/Default port
	server.Run(":" + port)
}
