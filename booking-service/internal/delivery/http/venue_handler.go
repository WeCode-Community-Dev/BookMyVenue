package http

import (
	"booking-service/internal/domain"
	"booking-service/internal/venue"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"bookmyvenue.com/shared/middleware"
)

type VenueHandler struct {
	svc venue.Service
}

type createVenueRequest struct {
	Name         string  `json:"name"          binding:"required"`
	Description  string  `json:"description"`
	Location     string  `json:"location"      binding:"required"`
	Capacity     int     `json:"capacity"      binding:"required,min=1"`
	PricePerHour float64 `json:"price_per_hour" binding:"required,min=0"`
}

type updateVenueRequest struct {
	Name         string  `json:"name"          binding:"required"`
	Description  string  `json:"description"`
	Location     string  `json:"location"      binding:"required"`
	Capacity     int     `json:"capacity"      binding:"required,min=1"`
	PricePerHour float64 `json:"price_per_hour" binding:"required,min=0"`
}

// RegisterVenueRoutes mounts venue endpoints on the router group.
// Public routes require no auth; protected routes require JWTAuth + RequireRole.
func RegisterVenueRoutes(rg *gin.RouterGroup, svc venue.Service, jwtSecret string) {
	h := &VenueHandler{svc: svc}

	auth := middleware.JWTAuth(jwtSecret)
	ownerOrAdmin := middleware.RequireRole(domain.RoleOwner, domain.RoleAdmin)

	// Public
	rg.GET("/venues", h.ListVenues)
	rg.GET("/venues/:id", h.GetVenue)

	// Owner / Admin only
	rg.POST("/venues", auth, ownerOrAdmin, h.CreateVenue)
	rg.PUT("/venues/:id", auth, ownerOrAdmin, h.UpdateVenue)
	rg.DELETE("/venues/:id", auth, ownerOrAdmin, h.DeleteVenue)

	// Owner: list own venues
	rg.GET("/venues/mine", auth, middleware.RequireRole(domain.RoleOwner, domain.RoleAdmin), h.ListMyVenues)
}

func (h *VenueHandler) ListVenues(c *gin.Context) {
	venues, err := h.svc.ListVenues()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	c.JSON(http.StatusOK, venues)
}

func (h *VenueHandler) GetVenue(c *gin.Context) {
	v, err := h.svc.GetVenue(c.Param("id"))
	if err != nil {
		if errors.Is(err, domain.ErrVenueNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	c.JSON(http.StatusOK, v)
}

func (h *VenueHandler) CreateVenue(c *gin.Context) {
	var req createVenueRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ownerID := c.GetString(middleware.CtxUserID)
	v, err := h.svc.CreateVenue(ownerID, req.Name, req.Description, req.Location, req.Capacity, req.PricePerHour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	c.JSON(http.StatusCreated, v)
}

func (h *VenueHandler) UpdateVenue(c *gin.Context) {
	var req updateVenueRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	callerID := c.GetString(middleware.CtxUserID)
	callerRole := c.GetString(middleware.CtxUserRole)
	v := &domain.Venue{
		ID:           c.Param("id"),
		Name:         req.Name,
		Description:  req.Description,
		Location:     req.Location,
		Capacity:     req.Capacity,
		PricePerHour: req.PricePerHour,
	}
	if err := h.svc.UpdateVenue(callerID, callerRole, v); err != nil {
		switch {
		case errors.Is(err, domain.ErrVenueNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		case errors.Is(err, domain.ErrVenueForbidden):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "venue updated"})
}

func (h *VenueHandler) DeleteVenue(c *gin.Context) {
	callerID := c.GetString(middleware.CtxUserID)
	callerRole := c.GetString(middleware.CtxUserRole)
	if err := h.svc.DeleteVenue(callerID, callerRole, c.Param("id")); err != nil {
		switch {
		case errors.Is(err, domain.ErrVenueNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		case errors.Is(err, domain.ErrVenueForbidden):
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "venue deleted"})
}

func (h *VenueHandler) ListMyVenues(c *gin.Context) {
	ownerID := c.GetString(middleware.CtxUserID)
	venues, err := h.svc.ListMyVenues(ownerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	c.JSON(http.StatusOK, venues)
}
