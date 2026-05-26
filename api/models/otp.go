package models

import "gorm.io/gorm"

type OTPType int
type OTPChannel int
type OTPStatus int

const (
	ForgetPasswordOTPType OTPType = 1
)

const (
	EmailOTPChannel    OTPChannel = 1
	SMSOTPChannel      OTPChannel = 2
	WhatsappOTPChannel OTPChannel = 3
)

const (
	ActiveOTPStatus  OTPStatus = 1
	RevokedOTPStatus OTPStatus = 2
)

type OTP struct {
	gorm.Model
	OwnerID   uint       `json:"owner_id" gorm:"not null"`
	User      User       `json:"-" gorm:"foreignKey:OwnerID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CodeHash  string     `json:"-" gorm:"not null"`
	Type      OTPType    `json:"type" gorm:"not null"`
	Channel   OTPChannel `json:"channel" gorm:"not null"`
	ExpiredAt int64      `json:"expired_at" gorm:"not null"`
	Status    OTPStatus  `json:"status" gorm:"not null"`
}
