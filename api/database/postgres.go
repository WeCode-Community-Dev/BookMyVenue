package database

import (
	"fmt"
	"log"
	"os"

	"github.com/WeCode-Community-Dev/BookMyVenue/api/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

// ConnectPostgres establishes a new connection to the PostgreSQL database or returns an existing one using GORM.
func ConnectPostgres() *gorm.DB {
	if db != nil {
		return db
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_SSLMODE"),
		os.Getenv("DB_TIMEZONE"),
	)
	var err error

	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}
	return db
}

func MigrateModels() {
	db := ConnectPostgres()
	err := db.AutoMigrate(
		&models.User{},
		&models.RefreshToken{},
		&models.OTP{},
	)
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
}
