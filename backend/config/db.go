package config

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func ConnectDB(cfg Config) (*pgxpool.Pool, error) {
	dbURL := cfg.PostgresURL

	// configure connection pool
	config, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse DB config: %w", err)
	}

	// pool settings
	config.MaxConns = 10                      // max open connections
	config.MinConns = 2                       // min idle connections
	config.MaxConnLifetime = 1 * time.Hour    // max connection lifetime
	config.MaxConnIdleTime = 30 * time.Minute // close idle connections after 30 min

	// create connection pool
	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	// test the connection
	if err := pool.Ping(context.Background()); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("connected to PostgreSQL successfully")

	return pool, nil
}
