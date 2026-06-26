package bookings

import (
	"net/http"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/ctxutil"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/redis"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/response"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Handler struct {
	service *service
}

func NewHandler(db *sqlc.Queries, pool *pgxpool.Pool, redis *redis.Client) *Handler {
	return &Handler{service: newService(db, pool, redis)}
}

func (h *Handler) BookSlot(c *gin.Context) {
	slotID := c.Param("slot_id")
	userID := ctxutil.GetUserID(c)

	booking, err := h.service.bookSlot(c.Request.Context(), slotID, userID)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "slot blocked", booking)
}

func (h *Handler) ConfirmBooking(c *gin.Context) {
	bookingID := c.Param("booking_id")
	slotID := c.Param("slot_id")

	err := h.service.confirmBooking(c.Request.Context(), bookingID, slotID)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "slot successfuly booked", nil)
}
