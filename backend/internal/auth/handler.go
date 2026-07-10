package auth

import (
	"net/http"
	"os"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/response"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *service
}

func NewHandler(db *sqlc.Queries) *Handler {
	return &Handler{
		service: newService(db),
	}
}

func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "invalid input")
		return
	}

	user, err := h.service.Register(c.Request.Context(), req)
	if err != nil {
		response.Error(c, http.StatusConflict, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "", user)
}

func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadGateway, err.Error())
		return
	}
	token, err := h.service.Login(c.Request.Context(), req)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, err.Error())
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "access_token",
		Value:    token.AccessToken,
		HttpOnly: true,
		Secure:   os.Getenv("ENV") == "production",
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
		MaxAge:   15 * 60, // 15 minutes
	})
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "refresh_token",
		Value:    token.RefreshToken,
		HttpOnly: true,
		Secure:   os.Getenv("ENV") == "production",
		SameSite: http.SameSiteLaxMode,
		Path:     "/api/v1/auth/refresh",
		MaxAge:   7 * 24 * 60 * 60, // 7 days
	})
	response.Success(c, http.StatusOK, "Login successful", token.Role)
}

func (h *Handler) Logout(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "logout",
	})
}

// Refresh validates the refresh token and issues a new access token.
// If the refresh token is invalid or expired, it clears the authentication
// cookies and returns an unauthorized response.
func (h *Handler) Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "cannot find refresh token")
		return
	}

	newToken, err := h.service.refresh(c.Request.Context(), refreshToken)
	if err != nil {
		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "access_token",
			Value:    "",
			Path:     "/",
			MaxAge:   -1,
			HttpOnly: true,
		})

		http.SetCookie(c.Writer, &http.Cookie{
			Name:     "refresh_token",
			Value:    "",
			Path:     "/api/v1/auth/refresh",
			MaxAge:   -1,
			HttpOnly: true,
		})
		response.Error(c, http.StatusUnauthorized, "invalid or expired refresh token")
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "access_token",
		Value:    newToken,
		HttpOnly: true,
		Secure:   os.Getenv("ENV") == "production",
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
		MaxAge:   15 * 60, // 15 minutes
	})

	response.Success(c, http.StatusOK, "access token refreshed", nil)
}

type LoginRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role" binding:"required,oneof=user owner"`
}
