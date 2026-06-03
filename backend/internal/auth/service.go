package auth

import (
	"context"
	"errors"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/hash"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/token"
)

// Service provides business logic for authentication operations.
type Service struct {
	db *sqlc.Queries
}

func NewService(db *sqlc.Queries) *Service {
	return &Service{
		db: db,
	}
}

func (s *Service) Register(ctx context.Context, req RegisterRequest) (*sqlc.User, error) {

	// check if email already exists
	existingUser, _ := s.db.GetUserByEmail(ctx, req.Email)
	if existingUser.ID.String() != "" {
		return nil, errors.New("email already registered")
	}

	// hash password
	hashedPassword, err := hash.HashPassword(req.Password)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	// save user to DB
	user, err := s.db.CreateUser(ctx, sqlc.CreateUserParams{
		Name:     req.Name,
		Email:    req.Email,
		Password: hashedPassword,
		Role:     req.Role,
	})
	if err != nil {
		return nil, errors.New("failed to create user" + err.Error())
	}

	return &user, nil
}

type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func (s *Service) Login(ctx context.Context, req LoginRequest) (*TokenPair, error) {

	user, err := s.db.GetUserByEmail(ctx, req.Email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	if !hash.CheckPassword(req.Password, user.Password) {
		return nil, errors.New("invalid password")
	}

	accessToken, err := token.GenerateAccessToken(user.ID.String(), user.Email, user.Role)
	if err != nil {
		return nil, errors.New("failed to generate access token:" + err.Error())
	}

	refreshToken, err := token.GenerateRefreshToken(user.ID.String())
	if err != nil {
		return nil, errors.New("failed to generate refresh token:" + err.Error())
	}

	return &TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}
