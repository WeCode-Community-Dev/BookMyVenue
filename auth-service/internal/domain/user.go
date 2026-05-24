package domain

import "errors"

var ErrUserNotFound = errors.New("user not found")
var ErrDuplicateUsername = errors.New("user already exists")

type User struct {
	ID           string `json:"id"`
	Username     string `json:"username"`
	Name         string `json:"name"`
	Email        string `json:"email"`
	PasswordHash string `json:"-"` //NOTE: Hidden from JSON outputs
	Role         string `json:"role"`
}

type UserRepository interface {
	GetByUsername(username string) (*User, error)
	Create(user *User) error
}
