package admin

import (
	"net/http"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/response"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *service
}

func NewHandler(db *sqlc.Queries) *Handler {
	return &Handler{service: newService(db)}
}

func (h *Handler) ViewPendingVenues(c *gin.Context) {
	venues, err := h.service.viewPendingVenues(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Pending venues", venues)
}

func (h *Handler) ApproveVenue(c *gin.Context) {
	venueID := c.Param("id")

	err := h.service.approveVenue(c.Request.Context(), venueID)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}
}

func (h *Handler) RejectVenue(c *gin.Context) {
	venueID := c.Param("id")

	err := h.service.rejectVenue(c.Request.Context(), venueID)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}
}

func (h *Handler) ViewApprovedVenues(c *gin.Context) {
	venues, err := h.service.viewApprovedVenues(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Approved Venues", venues)
}

func (h *Handler) ViewRejectedVenues(c *gin.Context) {
	venues, err := h.service.viewRejectedVenues(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Rejected Venues", venues)
}
