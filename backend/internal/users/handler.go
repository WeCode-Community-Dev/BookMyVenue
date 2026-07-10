package users

import (
	"net/http"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/ctxutil"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/response"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *service
}

func NewHandler(db *sqlc.Queries) *Handler {
	return &Handler{service: newService(db)}
}

func (h *Handler) ViewVenues(c *gin.Context) {
	venues, err := h.service.viewVenues(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
	}

	response.Success(c, http.StatusOK, "Venue", venues)
}

func (h *Handler) ViewVenue(c *gin.Context) {
	venueID := c.Param("venue_id")

	venue, err := h.service.viewVenueByVenueID(c.Request.Context(), venueID)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Venue", venue)
}

func (h *Handler) ViewBookedVenues(c *gin.Context) {
	userID := ctxutil.GetUserID(c)

	venues, err := h.service.getBookedVenues(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Booked Venues", venues)
}
