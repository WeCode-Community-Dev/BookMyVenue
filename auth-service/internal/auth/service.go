package auth

import (
	"errors"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"

	"auth-service/internal/domain"

	"github.com/golang-jwt/jwt/v5"
)

type AuthService interface {
	Login(username, password string) (string, error)
	Verify(token string) (jwt.MapClaims, error)
	Register(name, email, role, password string) (*domain.User, error)
	List() ([]domain.User, error)
}

type authService struct {
	repo       domain.UserRepository
	jwtManager *JWTManager
}

func NewAuthService(repo domain.UserRepository, jwt *JWTManager) AuthService {
	return &authService{jwtManager: jwt, repo: repo}
}

func (s *authService) Login(email, password string) (string, error) {
	user, err := s.repo.GetByEmail(email)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			log.Printf("user not found")
			return "", errors.New("invalid credentials")
		}
		return "", err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		log.Printf("invalid credentials")
		return "", errors.New("invalid credentials")
	}

	return s.jwtManager.GenerateToken(user.ID, user.Role, time.Hour)
}

func (s *authService) Register(name, email, role, password string) (*domain.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing")
		return nil, err
	}

	// Default empty role to 'user'; block self-registration as admin.
	switch role {
	case "":
		role = domain.RoleUser
	case domain.RoleUser, domain.RoleOwner:
		// allowed
	default:
		return nil, domain.ErrInvalidRole
	}

	newUser := &domain.User{
		Name:         name,
		Email:        email,
		PasswordHash: string(hashedPassword),
		Role:         role,
	}
	if err := s.repo.Create(newUser); err != nil {
		return nil, err // Will pass up domain.ErrDuplicateEmail cleanly
	}

	return newUser, nil
}

func (s *authService) Verify(token string) (jwt.MapClaims, error) {
	return s.jwtManager.VerifyToken(token)
}

func (s *authService) List() ([]domain.User, error) {
	users, err := s.repo.ListUsers()
	if err != nil {
		return nil, err
	}
	return users, nil
}
