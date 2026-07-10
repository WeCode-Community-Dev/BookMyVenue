package config

import "os"

type Config struct {
	PostgresURL string
}

func LoadConfig() Config {
	return Config{
		PostgresURL: getEnv("DATABASE_URL", "postgres://postgres:password@localhost:5432/bookmyvenue?sslmode=disable"),
	}
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok {
		return v
	}
	return fallback
}
