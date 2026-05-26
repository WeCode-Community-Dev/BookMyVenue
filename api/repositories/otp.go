package repositories

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"time"

	"github.com/WeCode-Community-Dev/BookMyVenue/api/database"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type OTPRepository interface {
	GenerateOTP(userID uint, otpType models.OTPType, channel models.OTPChannel) (string, error)
	ValidateOTP(userID uint, otpType models.OTPType, otp string) (bool, error)
}

type otpRepository struct {
	db *gorm.DB
}

func NewOTPRepository() OTPRepository {
	return &otpRepository{
		db: database.ConnectPostgres(),
	}
}

func (r *otpRepository) GenerateOTP(userID uint, otpType models.OTPType, channel models.OTPChannel) (string, error) {
	otp, err := r.generateRandomOTP()
	if err != nil {
		return "", err
	}

	hashedOTP, err := bcrypt.GenerateFromPassword([]byte(otp), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	err = r.db.Create(&models.OTP{
		OwnerID:   userID,
		CodeHash:  string(hashedOTP),
		Type:      otpType,
		Channel:   channel,
		Status:    models.ActiveOTPStatus,
		ExpiredAt: time.Now().Add(5 * time.Minute).Unix(), // OTP expires in 5 minutes
	}).Error
	if err != nil {
		return "", err
	}
	return otp, nil
}

func (r *otpRepository) ValidateOTP(userID uint, otpType models.OTPType, otp string) (bool, error) {
	var otpModel models.OTP
	err := r.db.Where("owner_id = ? AND type = ? AND expired_at > ? AND status = ?", userID, otpType, time.Now().Unix(), models.ActiveOTPStatus).First(&otpModel).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return false, nil // No valid OTP found
		}
		return false, err // Database error
	}

	err = bcrypt.CompareHashAndPassword([]byte(otpModel.CodeHash), []byte(otp))
	if err != nil {
		return false, nil // OTP does not match
	}

	// Optionally, you can mark the OTP as used or revoked here
	err = r.db.Model(&otpModel).Update("status", models.RevokedOTPStatus).Error
	if err != nil {
		return false, err // Database error while updating OTP status
	}
	return true, nil
}

func (r *otpRepository) generateRandomOTP() (string, error) {
	max := big.NewInt(900000)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n), nil
}
