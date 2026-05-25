package services

import (
	"errors"
	"regexp"

	"github.com/WeCode-Community-Dev/BookMyVenue/api/models"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/repositories"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/service_errors"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/utils"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService interface {
	Signup(name string, email string, mobileNumber string, password string) error
	Login(email string, password string) (accessToken string, refreshToken string, err error)
}

type userService struct {
	userRepo         repositories.UserRepository
	refreshTokenRepo repositories.RefreshTokenRepository
}

func NewUserService() UserService {
	return &userService{
		userRepo:         repositories.NewUserRepository(),
		refreshTokenRepo: repositories.NewRefreshTokenRepository(),
	}
}

func (s *userService) Signup(name string, email string, mobileNumber string, password string) error {

	if name == "" || email == "" || mobileNumber == "" || password == "" {
		return service_errors.UserErrAllFieldsRequired
	}

	if !s.isValidEmail(email) {
		return service_errors.UserErrInvalidEmailFormat
	}

	// Check if email or mobile number already exists
	_, err := s.userRepo.FindByEmail(email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	} else if err == nil {
		return service_errors.UserErrEmailAlreadyExists
	}

	// Check if mobile number already exists
	_, err = s.userRepo.FindByMobileNumber(mobileNumber)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	} else if err == nil {
		return service_errors.UserErrMobileNumberAlreadyExists
	}

	// Hash the password before storing it
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &models.User{
		Name:         name,
		Email:        email,
		MobileNumber: mobileNumber,
		PasswordHash: string(passwordHash),
		Status:       models.ActiveUserStatus,
	}

	return s.userRepo.Create(user)
}

func (s *userService) Login(email string, password string) (accessToken string, refreshToken string, err error) {
	if email == "" || password == "" {
		return "", "", service_errors.UserErrEmptyCredentials
	}

	if !s.isValidEmail(email) {
		return "", "", service_errors.UserErrInvalidEmailFormat
	}

	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", "", service_errors.UserErrInvalidCredentials
		}
		return "", "", err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return "", "", service_errors.UserErrInvalidCredentials
	}

	rt := &models.RefreshToken{
		Token:  uuid.NewString(),
		UserID: user.ID,
	}

	err = s.refreshTokenRepo.Create(rt)
	if err != nil {
		return "", "", err
	}

	accessToken, err = utils.GenerateLoginToken(user.ID, user.Email, user.Name)
	if err != nil {
		return "", "", err
	}

	return accessToken, rt.Token, nil
}

func (s *userService) isValidEmail(email string) bool {
	// Simple regex for email validation
	const emailRegex = `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`
	matched, _ := regexp.MatchString(emailRegex, email)
	return matched
}
