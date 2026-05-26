package services

import (
	"errors"
	"log"
	"regexp"
	"strings"

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
	RotateRefreshToken(oldToken string, userID uint) (newAccessToken string, newRefreshToken string, err error)
	RevokeRefreshToken(token string, userID uint) error
	ForgetPasswordStep1(email string, channel models.OTPChannel) error
	ForgetPasswordStep2(email string, otp string, newPassword string) error
	ChangePassword(userID uint, oldPassword string, newPassword string) error
	UpdateUserByID(userID uint, name string, email string, mobileNumber string) error
	GetUserByID(userID uint) (*models.User, error)
}

type userService struct {
	userRepo         repositories.UserRepository
	refreshTokenRepo repositories.RefreshTokenRepository
	otpRepo          repositories.OTPRepository
}

func NewUserService() UserService {
	return &userService{
		userRepo:         repositories.NewUserRepository(),
		refreshTokenRepo: repositories.NewRefreshTokenRepository(),
		otpRepo:          repositories.NewOTPRepository(),
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

func (s *userService) RotateRefreshToken(oldToken string, userID uint) (newAccessToken string, newRefreshToken string, err error) {
	rt, err := s.refreshTokenRepo.FindValidTokenByTokenStringAndUserID(oldToken, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", "", service_errors.UserErrInvalidRefreshToken
		}
		return "", "", err
	}

	err = s.refreshTokenRepo.RevokeTokenByIDAndUserID(rt.ID, userID)
	if err != nil {
		return "", "", err
	}

	newRT := &models.RefreshToken{
		Token:  uuid.NewString(),
		UserID: userID,
	}

	err = s.refreshTokenRepo.Create(newRT)
	if err != nil {
		return "", "", err
	}

	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return "", "", err
	}

	newAccessToken, err = utils.GenerateLoginToken(user.ID, user.Email, user.Name)
	if err != nil {
		return "", "", err
	}

	return newAccessToken, newRT.Token, nil
}

func (s *userService) RevokeRefreshToken(token string, userID uint) error {
	rt, err := s.refreshTokenRepo.FindValidTokenByTokenStringAndUserID(token, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return service_errors.UserErrInvalidRefreshToken
		}
		return err
	}

	return s.refreshTokenRepo.RevokeTokenByIDAndUserID(rt.ID, userID)
}

func (s *userService) ForgetPasswordStep1(email string, channel models.OTPChannel) error {
	if email == "" {
		return service_errors.UserErrEmptyEmail
	}

	if !s.isValidEmail(email) {
		return service_errors.UserErrInvalidEmailFormat
	}

	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return service_errors.UserErrEmailNotFound
		}
		return err
	}

	otpStr, err := s.otpRepo.GenerateOTP(user.ID, models.ForgetPasswordOTPType, channel)
	if err != nil {
		return err
	}

	// TODO -> Send OTP to user via the specified channel (email or SMS or WhatsApp)
	log.Printf("Generated OTP for user %d: %s", user.ID, otpStr) // For testing purposes, log the OTP. In production, this should be sent securely to the user.

	return nil
}

func (s *userService) ForgetPasswordStep2(email string, otp string, newPassword string) error {
	if email == "" || otp == "" || newPassword == "" {
		return service_errors.UserErrAllFieldsRequired
	}

	if !s.isValidEmail(email) {
		return service_errors.UserErrInvalidEmailFormat
	}

	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return service_errors.UserErrEmailNotFound
		}
		return err
	}

	valid, err := s.otpRepo.ValidateOTP(user.ID, models.ForgetPasswordOTPType, otp)
	if err != nil {
		return err
	}
	if !valid {
		return service_errors.UserErrInvalidOTP
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.PasswordHash = string(passwordHash)
	return s.userRepo.UpdateByID(user.ID, user)
}

func (s *userService) ChangePassword(userID uint, oldPassword string, newPassword string) error {
	if oldPassword == "" || newPassword == "" {
		return service_errors.UserErrAllFieldsRequired
	}

	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return service_errors.UserErrNotFound
		}
		return err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(oldPassword))
	if err != nil {
		return service_errors.UserErrInvalidOldPassword
	}

	newPasswordHash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.PasswordHash = string(newPasswordHash)
	return s.userRepo.UpdateByID(user.ID, user)
}

func (s *userService) UpdateUserByID(userID uint, name string, email string, mobileNumber string) error {
	if strings.TrimSpace(name) == "" && strings.TrimSpace(email) == "" && strings.TrimSpace(mobileNumber) == "" {
		return service_errors.UserErrAllFieldsRequired
	}

	if !s.isValidEmail(email) {
		return service_errors.UserErrInvalidEmailFormat
	}

	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return service_errors.UserErrNotFound
		}
		return err
	}

	if name != "" {
		user.Name = name
	}

	if email != "" && email != user.Email {
		// Check if email already exists
		_, err := s.userRepo.FindByEmail(email)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		} else if err == nil {
			return service_errors.UserErrEmailAlreadyExists
		}
		user.Email = email
	}

	if mobileNumber != "" && mobileNumber != user.MobileNumber {
		// Check if mobile number already exists
		_, err := s.userRepo.FindByMobileNumber(mobileNumber)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		} else if err == nil {
			return service_errors.UserErrMobileNumberAlreadyExists
		}
		user.MobileNumber = mobileNumber
	}

	return s.userRepo.UpdateByID(user.ID, user)
}

func (s *userService) GetUserByID(userID uint) (*models.User, error) {
	return s.userRepo.FindByID(userID)
}

func (s *userService) isValidEmail(email string) bool {
	// Simple regex for email validation
	const emailRegex = `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`
	matched, _ := regexp.MatchString(emailRegex, email)
	return matched
}
