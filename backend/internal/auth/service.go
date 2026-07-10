package auth

import (
	"context"
	"database/sql"
	"errors"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/hash"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/token"
)

// Service provides business logic for authentication operations.
type service struct {
	repo *repository
}

func newService(db *sqlc.Queries) *service {
	return &service{
		repo: newRepository(db),
	}
}

func (s *service) Register(ctx context.Context, req RegisterRequest) (*sqlc.User, error) {

	// check if email already exists
	existingUser, _ := s.repo.getUserByEmail(ctx, req.Email)
	if existingUser.ID.String() != "" {
		return nil, errors.New("email already registered")
	}

	// hash password
	hashedPassword, err := hash.HashPassword(req.Password)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	// save user to DB
	user, err := s.repo.createUser(ctx, sqlc.CreateUserParams{
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
	Role         string `json:"role"`
}

func (s *service) Login(ctx context.Context, req LoginRequest) (*TokenPair, error) {

	user, err := s.repo.getUserByEmail(ctx, req.Email)
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
		Role:         user.Role,
	}, nil
}

func (s *service) refresh(ctx context.Context, refreshToken string) (string, error) {
	// verify token
	claims, err := token.VerifyRefreshToken(refreshToken)
	if err != nil {
		return "", errors.New("Invalid or expired refresh token")
	}

	user, err := s.repo.getUserByID(ctx, claims.UserID)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", errors.New("user not found")
		}
		return "", errors.New("cannot find user")
	}

	accessToken, err := token.GenerateAccessToken(claims.UserID, user.Email, user.Role)
	if err != nil {
		return "", errors.New("cannot generate access token")
	}

	return accessToken, nil

}
