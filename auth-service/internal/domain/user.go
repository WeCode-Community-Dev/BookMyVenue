package domain

import "errors"

var ErrUserNotFound = errors.New("user not found")
var ErrDuplicateEmail = errors.New("user already exists")

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
