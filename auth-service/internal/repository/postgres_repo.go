package repository

import (
	"auth-service/internal/domain"
	"context"
	"errors"
	"log"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresUserRepository struct {
	db *pgxpool.Pool
}

// NewPostgresUserRepository instantiates a concrete database worker mapping to our domain contract
func NewPostgresUserRepository(db *pgxpool.Pool) domain.UserRepository {
	return &PostgresUserRepository{db: db}
}

func (r *PostgresUserRepository) Create(user *domain.User) error {
	ctx := context.Background()
	query := `INSERT INTO users (id, name, username, email, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6)`

	_, err := r.db.Exec(ctx, query, user.ID, user.Name, user.Username, user.Email, user.PasswordHash, user.Role)
	if err != nil {
		//NOTE: parse unique constraint violations here if needed
		log.Println(err)
		return domain.ErrDuplicateUsername
		// return err
	}
	return nil
}

func (r *PostgresUserRepository) GetByID(id string) (*domain.User, error) {
	ctx := context.Background()
	query := `SELECT id, name,username, email FROM users WHERE id = $1`

	var user domain.User
	err := r.db.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.Name,
		&user.Username,
		&user.Email,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrUserNotFound
		}
		return nil, err
	}

	return &user, nil
}

func (r *PostgresUserRepository) GetByUsername(username string) (*domain.User, error) {
	ctx := context.Background()
	query := `SELECT id, name, username, email, password_hash, role FROM users WHERE username = $1`

	var user domain.User
	err := r.db.QueryRow(ctx, query, username).Scan(
		&user.ID,
		&user.Name,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
	)
	if err != nil {
		log.Print(err)
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrUserNotFound
		}
		return nil, err
	}

	return &user, nil
}
