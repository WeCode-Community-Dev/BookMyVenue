package services

import (
	"errors"

	"github.com/WeCode-Community-Dev/BookMyVenue/api/service_errors"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/models"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/repositories"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService interface {
	Signup(name string, email string, mobileNumber string, password string) error
}

type userService struct {
	userRepo repositories.UserRepository
}

func NewUserService() UserService {
	return &userService{
		userRepo: repositories.NewUserRepository(),
	}
}

func (s *userService) Signup(name string, email string, mobileNumber string, password string) error {

	if name == "" || email == "" || mobileNumber == "" || password == "" {
		return service_errors.UserErrAllFieldsRequired
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
