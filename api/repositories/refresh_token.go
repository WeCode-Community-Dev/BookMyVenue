package repositories

import (
	"os"
	"time"

	"github.com/WeCode-Community-Dev/BookMyVenue/api/database"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type RefreshTokenRepository interface {
	Create(token *models.RefreshToken) error
	FindValidTokenByTokenStringAndUserID(token string, userID uint) (*models.RefreshToken, error)
	RevokeTokenByIDAndUserID(id uint, userID uint) error
}

type refreshTokenRepository struct {
	db *gorm.DB
}

func NewRefreshTokenRepository() RefreshTokenRepository {
	return &refreshTokenRepository{
		db: database.ConnectPostgres(),
	}
}

func (r *refreshTokenRepository) Create(token *models.RefreshToken) error {
	token.Status = models.ActiveRefreshTokenStatus
	expStr := os.Getenv("REFRESH_TOKEN_EXPIRATION_HOURS")
	if expStr == "" {
		expStr = "168" // Default to 168 hours (7 days) if not set
	}
	expHours, err := time.ParseDuration(expStr + "h")
	if err != nil {
		expHours = 168 * time.Hour // Default to 168 hours (7 days) if parsing fails
	}
	token.ExpiredAt = time.Now().Add(expHours)
	return r.db.Create(token).Error
}

// FindValidTokenByTokenStringAndUserID retrieves the most recent valid refresh token for a given token string and user ID
func (r *refreshTokenRepository) FindValidTokenByTokenStringAndUserID(token string, userID uint) (*models.RefreshToken, error) {
	var refreshToken models.RefreshToken
	err := r.db.Where("token = ? AND user_id = ? AND expired_at > ? AND status = ?", token, userID, time.Now(), models.ActiveRefreshTokenStatus).Order(clause.OrderByColumn{
		Column: clause.Column{Name: "created_at"},
		Desc:   true,
	}).First(&refreshToken).Error
	if err != nil {
		return nil, err
	}
	return &refreshToken, nil
}

// RevokeTokenByIDAndUserID updates the status of a refresh token to revoked based on its ID and associated user ID
func (r *refreshTokenRepository) RevokeTokenByIDAndUserID(id uint, userID uint) error {
	return r.db.Model(&models.RefreshToken{}).Where("id = ? AND user_id = ?", id, userID).Update("status", models.RevokedRefreshTokenStatus).Error
}
