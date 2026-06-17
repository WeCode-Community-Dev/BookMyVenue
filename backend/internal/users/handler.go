package users

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

func (h *Handler) ViewVenue(c *gin.Context) {
	venues, err := h.service.viewVenues(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
	}

	response.Success(c, http.StatusOK, "Venue", venues)
}
