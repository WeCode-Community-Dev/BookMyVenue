package utils

import (
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateLoginToken(userID uint, email string, name string) (string, error) {
	expStr := os.Getenv("LOGIN_TOKEN_EXPIRATION_MINUTES")
	secret := os.Getenv("LOGIN_TOKEN_SECRET")
	if strings.TrimSpace(secret) == "" {
		return "", jwt.ErrInvalidKey
	}

	if strings.TrimSpace(expStr) == "" {
		expStr = "10" // Default to 10 minutes if not set
	}
	expMinutes, err := time.ParseDuration(expStr + "m")
	if err != nil {
		expMinutes = 10 * time.Minute // Default to 10 minutes if parsing fails
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		// Custom claims
		"user_id": userID,
		"email":   email,
		"name":    name,

		// Standard claims
		"exp": time.Now().Add(expMinutes).Unix(),
		"iat": time.Now().Unix(),
		"nbf": time.Now().Unix(),
	})
	return token.SignedString([]byte(secret))
}

func ValidateLoginToken(tokenString string) (*jwt.Token, error) {
	secret := os.Getenv("LOGIN_TOKEN_SECRET")
	if strings.TrimSpace(secret) == "" {
		return nil, jwt.ErrInvalidKey
	}

	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(secret), nil
	})
}

func ExtractClaimsFromLoginToken(token *jwt.Token) (userID uint, email, name string, err error) {
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID = uint(claims["user_id"].(float64))
		email = claims["email"].(string)
		name = claims["name"].(string)
		return userID, email, name, nil
	}
	return 0, "", "", jwt.ErrInvalidKey
}
