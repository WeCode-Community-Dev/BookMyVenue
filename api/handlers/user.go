package handlers

import (
	"errors"
	"net/http"

	"github.com/WeCode-Community-Dev/BookMyVenue/api/dtos"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/models"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/service_errors"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/services"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/utils"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService services.UserService
}

func NewUserHandler() *UserHandler {
	return &UserHandler{
		userService: services.NewUserService(),
	}
}

func (h *UserHandler) Signup(c *gin.Context) {
	var req dtos.UserDataRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	err := h.userService.Signup(req.Name, req.Email, req.MobileNumber, req.Password)
	if err != nil {
		if errors.Is(err, service_errors.UserErrAllFieldsRequired) {
			utils.WriteFailedResponse(c, http.StatusBadRequest, "All fields are required", nil)
			return
		} else if errors.Is(err, service_errors.UserErrEmailAlreadyExists) {
			utils.WriteFailedResponse(c, http.StatusConflict, "Email already exists", nil)
			return
		} else if errors.Is(err, service_errors.UserErrMobileNumberAlreadyExists) {
			utils.WriteFailedResponse(c, http.StatusConflict, "Mobile number already exists", nil)
			return
		}
		utils.WriteFailedResponse(c, http.StatusInternalServerError, "Failed to create user", err)
		return
	}

	utils.WriteSuccessResponse(c, http.StatusCreated, "User created successfully", nil)
}

func (h *UserHandler) Login(c *gin.Context) {
	var req dtos.UserLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	accessToken, refreshToken, err := h.userService.Login(req.Email, req.Password)
	if err != nil {
		if errors.Is(err, service_errors.UserErrEmptyCredentials) {
			utils.WriteFailedResponse(c, http.StatusBadRequest, "Email and password are required", nil)
			return
		} else if errors.Is(err, service_errors.UserErrInvalidEmailFormat) {
			utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid email format", nil)
			return
		} else if errors.Is(err, service_errors.UserErrInvalidCredentials) {
			utils.WriteFailedResponse(c, http.StatusUnauthorized, "Invalid email or password", nil)
			return
		}
		utils.WriteFailedResponse(c, http.StatusInternalServerError, "Failed to login", err)
		return
	}

	utils.WriteSuccessResponse(c, http.StatusOK, "Login successful", gin.H{
		"access-token":  accessToken,
		"refresh-token": refreshToken,
	})
}

func (h *UserHandler) RotateRefreshToken(c *gin.Context) {
	var req dtos.RotateRefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	userID, exists := utils.GetUserIDFromContext(c)
	if !exists {
		utils.WriteFailedResponse(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	newAccessToken, newRefreshToken, err := h.userService.RotateRefreshToken(req.RefreshToken, userID)
	if err != nil {
		if errors.Is(err, service_errors.UserErrInvalidRefreshToken) {
			utils.WriteFailedResponse(c, http.StatusUnauthorized, "Invalid refresh token", nil)
			return
		}
		utils.WriteFailedResponse(c, http.StatusInternalServerError, "Failed to rotate refresh token", err)
		return
	}

	utils.WriteSuccessResponse(c, http.StatusOK, "Refresh token rotated successfully", gin.H{
		"access-token":  newAccessToken,
		"refresh-token": newRefreshToken,
	})
}

func (h *UserHandler) RevokeRefreshToken(c *gin.Context) {
	var req dtos.RevokeRefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	userID, exists := utils.GetUserIDFromContext(c)
	if !exists {
		utils.WriteFailedResponse(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	err := h.userService.RevokeRefreshToken(req.RefreshToken, userID)
	if err != nil {
		if errors.Is(err, service_errors.UserErrInvalidRefreshToken) {
			utils.WriteFailedResponse(c, http.StatusUnauthorized, "Invalid refresh token", nil)
			return
		}
		utils.WriteFailedResponse(c, http.StatusInternalServerError, "Failed to revoke refresh token", err)
		return
	}

	utils.WriteSuccessResponse(c, http.StatusOK, "Refresh token revoked successfully", nil)
}

func (h *UserHandler) ForgetPasswordStep1(c *gin.Context) {
	var req dtos.ForgetPasswordStep1Request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	var channel models.OTPChannel
	switch req.Channel {
	case "email":
		channel = models.EmailOTPChannel
	case "sms":
		channel = models.SMSOTPChannel
	case "whatsapp":
		channel = models.WhatsappOTPChannel
	default:
		utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid channel. Must be one of: email, sms, whatsapp", nil)
		return
	}

	err := h.userService.ForgetPasswordStep1(req.Email, channel)
	if err != nil {
		if errors.Is(err, service_errors.UserErrEmptyEmail) {
			utils.WriteFailedResponse(c, http.StatusBadRequest, "Email is required", nil)
			return
		} else if errors.Is(err, service_errors.UserErrInvalidEmailFormat) {
			utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid email format", nil)
			return
		} else if errors.Is(err, service_errors.UserErrNotFound) {
			utils.WriteFailedResponse(c, http.StatusNotFound, "User with the given email not found", nil)
			return
		}
		utils.WriteFailedResponse(c, http.StatusInternalServerError, "Failed to process forget password request", err)
		return
	}

	utils.WriteSuccessResponse(c, http.StatusOK, "OTP sent successfully to the user via the specified channel", nil)
}

func (h *UserHandler) ForgetPasswordStep2(c *gin.Context) {
	var req dtos.ForgetPasswordStep2Request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	err := h.userService.ForgetPasswordStep2(req.Email, req.OTP, req.NewPassword)
	if err != nil {
		if errors.Is(err, service_errors.UserErrEmptyEmail) {
			utils.WriteFailedResponse(c, http.StatusBadRequest, "Email is required", nil)
			return
		} else if errors.Is(err, service_errors.UserErrInvalidEmailFormat) {
			utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid email format", nil)
			return
		} else if errors.Is(err, service_errors.UserErrNotFound) {
			utils.WriteFailedResponse(c, http.StatusNotFound, "User with the given email not found", nil)
			return
		} else if errors.Is(err, service_errors.UserErrInvalidOTP) {
			utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid OTP", nil)
			return
		}
		utils.WriteFailedResponse(c, http.StatusInternalServerError, "Failed to reset password", err)
		return
	}

	utils.WriteSuccessResponse(c, http.StatusOK, "Password reset successfully", nil)
}

func (h *UserHandler) ChangePassword(c *gin.Context) {
	var req dtos.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	userID, exists := utils.GetUserIDFromContext(c)
	if !exists {
		utils.WriteFailedResponse(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	err := h.userService.ChangePassword(userID, req.OldPassword, req.NewPassword)
	if err != nil {
		if errors.Is(err, service_errors.UserErrInvalidOldPassword) {
			utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid old password", nil)
			return
		}
		utils.WriteFailedResponse(c, http.StatusInternalServerError, "Failed to change password", err)
		return
	}

	utils.WriteSuccessResponse(c, http.StatusOK, "Password changed successfully", nil)
}

func (s *UserHandler) UpdateProfile(c *gin.Context) {
	var req dtos.UserDataRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	userID, exists := utils.GetUserIDFromContext(c)
	if !exists {
		utils.WriteFailedResponse(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	err := s.userService.UpdateUserByID(userID, req.Name, req.Email, req.MobileNumber)
	if err != nil {
		if errors.Is(err, service_errors.UserErrAllFieldsRequired) {
			utils.WriteFailedResponse(c, http.StatusBadRequest, "At least one field (name, email or mobile number) is required to update profile", nil)
			return
		} else if errors.Is(err, service_errors.UserErrInvalidEmailFormat) {
			utils.WriteFailedResponse(c, http.StatusBadRequest, "Invalid email format", nil)
			return
		} else if errors.Is(err, service_errors.UserErrNotFound) {
			utils.WriteFailedResponse(c, http.StatusNotFound, "User not found", nil)
			return
		} else if errors.Is(err, service_errors.UserErrEmailAlreadyExists) {
			utils.WriteFailedResponse(c, http.StatusConflict, "Email already exists", nil)
			return
		} else if errors.Is(err, service_errors.UserErrMobileNumberAlreadyExists) {
			utils.WriteFailedResponse(c, http.StatusConflict, "Mobile number already exists", nil)
			return
		}
		utils.WriteFailedResponse(c, http.StatusInternalServerError, "Failed to update profile", err)
		return
	}

	utils.WriteSuccessResponse(c, http.StatusOK, "Profile updated successfully", nil)
}

func (s *UserHandler) GetProfile(c *gin.Context) {
	userID, exists := utils.GetUserIDFromContext(c)
	if !exists {
		utils.WriteFailedResponse(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	user, err := s.userService.GetUserByID(userID)
	if err != nil {
		if errors.Is(err, service_errors.UserErrNotFound) {
			utils.WriteFailedResponse(c, http.StatusNotFound, "User not found", nil)
			return
		}
		utils.WriteFailedResponse(c, http.StatusInternalServerError, "Failed to retrieve user profile", err)
		return
	}

	utils.WriteSuccessResponse(c, http.StatusOK, "User profile retrieved successfully", gin.H{"user": user})
}

