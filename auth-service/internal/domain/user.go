package domain

import "errors"

// Role constants — the single source of truth for role strings across services.
const (
	RoleUser  = "user"
	RoleOwner = "owner"
	RoleAdmin = "admin"
)

var (
	ErrUserNotFound  = errors.New("user not found")
	ErrDuplicateEmail = errors.New("user already exists")
	ErrInvalidRole   = errors.New("invalid role: must be 'user' or 'owner'")
)

type User struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Email        string `json:"email"`
	PasswordHash string `json:"-"` //NOTE: Hidden from JSON outputs
	Role         string `json:"role"`
}

type UserRepository interface {
	GetByEmail(email string) (*User, error)
	Create(user *User) error
	ListUsers() ([]User, error)
}
