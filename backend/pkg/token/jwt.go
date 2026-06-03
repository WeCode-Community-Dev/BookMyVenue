package token

import (
	"os"
	"time"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/golang-jwt/jwt"
)

func GenerateAccessToken(user sqlc.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"type":    "access",
		"exp":     jwt.TimeFunc().Add(15 * time.Minute).Unix(),
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func GenerateRefreshToken(user sqlc.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"type":    "refresh",
		"exp":     jwt.TimeFunc().Add(7 * 24 * time.Hour).Unix(),
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString([]byte(os.Getenv("JWT_REFRESH_SECRET")))
}
