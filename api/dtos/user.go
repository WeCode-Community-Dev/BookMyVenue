package dtos

type UserSignupRequest struct {
	Name         string `json:"name" binding:"required"`
	Email        string `json:"email" binding:"required,email"`
	MobileNumber string `json:"mobile_number" binding:"required"`
	Password     string `json:"password" binding:"required,min=6"`
}
