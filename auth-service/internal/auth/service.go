package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type AuthService interface {
	Login(username, password string) (string, error)
	Verify(token string) (jwt.MapClaims, error)
}

type authService struct {
	jwtManager *JWTManager
}

func NewAuthService(jwt *JWTManager) AuthService {
	return &authService{jwtManager: jwt}
}

func (s *authService) Login(username, password string) (string, error) {
	if username == "admin" && password == "supersecret" {
		return s.jwtManager.GenerateToken("usr_9921", "admin", time.Hour)
	}
	return "", errors.New("invalid credentials")
}

func (s *authService) Verify(token string) (jwt.MapClaims, error) {
	return s.jwtManager.VerifyToken(token)
}
