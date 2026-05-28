package http

import (
	"booking-service/internal/booking"
	"booking-service/internal/domain"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"bookmyvenue.com/shared/middleware"
)

type BookingHandler struct {
	svc booking.Service
}

type createBookingRequest struct {
	VenueID   string    `json:"venue_id"   binding:"required"`
	StartTime time.Time `json:"start_time" binding:"required"`
	EndTime   time.Time `json:"end_time"   binding:"required"`
}

// RegisterBookingRoutes mounts booking endpoints — all require authentication.
func RegisterBookingRoutes(rg *gin.RouterGroup, svc booking.Service, jwtSecret string) {
	h := &BookingHandler{svc: svc}

	auth := middleware.JWTAuth(jwtSecret)
	userOrAdmin := middleware.RequireRole(domain.RoleUser, domain.RoleAdmin)

	rg.POST("/bookings", auth, userOrAdmin, h.CreateBooking)
	rg.GET("/bookings", auth, h.ListBookings)       // user → own; admin → all
	rg.GET("/bookings/:id", auth, h.GetBooking)
	rg.DELETE("/bookings/:id", auth, h.CancelBooking)
}

func (h *BookingHandler) CreateBooking(c *gin.Context) {
	var req createBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if !req.EndTime.After(req.StartTime) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "end_time must be after start_time"})
		return
	}

	userID := c.GetString(middleware.CtxUserID)
	b, err := h.svc.CreateBooking(userID, req.VenueID, req.StartTime, req.EndTime)
	if err != nil {
		if errors.Is(err, domain.ErrVenueUnavailable) {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	c.JSON(http.StatusCreated, b)
}

// ListBookings returns the caller's own bookings; admins receive all bookings.
func (h *BookingHandler) ListBookings(c *gin.Context) {
	callerID := c.GetString(middleware.CtxUserID)
	callerRole := c.GetString(middleware.CtxUserRole)

	var (
		bookings []domain.Booking
		err      error
	)
	if callerRole == domain.RoleAdmin {
		bookings, err = h.svc.ListAllBookings()
	} else {
		bookings, err = h.svc.ListUserBookings(callerID)
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	c.JSON(http.StatusOK, bookings)
}

func (h *BookingHandler) GetBooking(c *gin.Context) {
	callerID := c.GetString(middleware.CtxUserID)
	callerRole := c.GetString(middleware.CtxUserRole)

	b, err := h.svc.GetBooking(callerID, callerRole, c.Param("id"))
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrBookingNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		case errors.Is(err, domain.ErrBookingForbidden):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, b)
}

func (h *BookingHandler) CancelBooking(c *gin.Context) {
	callerID := c.GetString(middleware.CtxUserID)
	callerRole := c.GetString(middleware.CtxUserRole)

	if err := h.svc.CancelBooking(callerID, callerRole, c.Param("id")); err != nil {
		switch {
		case errors.Is(err, domain.ErrBookingNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		case errors.Is(err, domain.ErrBookingForbidden):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "booking cancelled"})
}
