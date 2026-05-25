package models

import (
	"time"

	"gorm.io/gorm"
)

type RefreshTokenStatus int

const (
	ActiveRefreshTokenStatus  RefreshTokenStatus = 1
	RevokedRefreshTokenStatus RefreshTokenStatus = 2
)

type RefreshToken struct {
	gorm.Model
	Token     string             `json:"token" gorm:"not null"`
	UserID    uint               `json:"user_id" gorm:"not null"`
	ExpiredAt time.Time          `json:"expired_at" gorm:"not null"`
	Status    RefreshTokenStatus `json:"status" gorm:"not null;default:1"`
}
