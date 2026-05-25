package handlers

import (
	"errors"
	"net/http"

	"github.com/WeCode-Community-Dev/BookMyVenue/api/dtos"
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
	var req dtos.UserSignupRequest
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
