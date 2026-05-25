package models

import "gorm.io/gorm"

type UserStatus int

const (
	ActiveUserStatus    UserStatus = 1
	SuspendedUserStatus UserStatus = 2
)

type User struct {
	gorm.Model
	Name         string     `json:"name" gorm:"not null"`
	Email        string     `json:"email" gorm:"unique;not null"`
	MobileNumber string     `json:"mobile_number" gorm:"unique;not null"`
	PasswordHash string     `json:"-" gorm:"not null"`
	Status       UserStatus `json:"status" gorm:"not null;default:1"`
}
