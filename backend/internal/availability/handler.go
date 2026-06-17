package availability

import (
	"net/http"
	"strings"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/ctxutil"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/response"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *service
}

func NewService(db *sqlc.Queries) *Handler {
	return &Handler{service: newService(db)}
}

func (h *Handler) AvailableSlots(c *gin.Context) {
	venuesID := c.Param("id")

	slots, err := h.service.availableSlots(c.Request.Context(), venuesID)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	var res createSlot
	for _, slot := range slots {
		date := strings.Split(slot.StartTime.Time.String(), " ")[0]
		start_time := strings.Split(slot.StartTime.Time.String(), " ")[1]
		end_time := strings.Split(slot.EndTime.Time.String(), " ")[1]

		s := ResposeSlot{
			ID: slot.ID.String(),
			Slot: Slot{
				Date:      date,
				StartTime: start_time,
				EndTime:   end_time,
			},
		}

		res.Slots = append(res.Slots, s)
	}

	response.Success(c, http.StatusOK, "Venue Slots", res)
}

func (h *Handler) SetNewSlot(c *gin.Context) {
	// TODO:
	// Support availability crossing midnight.
	// Example:
	// 2026-07-03 19:00 -> 2026-07-04 02:00
	// Currently only same-day availability is supported.
	venuesID := c.Param("id")
	ownerID := ctxutil.GetUserID(c)

	var req createSlot
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	slots, err := h.service.setNewSlot(c.Request.Context(), req, venuesID, ownerID)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "slots", slots)
}

func (h *Handler) DeleteSlot(c *gin.Context) {
	slot_id := c.Param("slot_id")

	err := h.service.deleteSlot(c.Request.Context(), slot_id)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "delete id", slot_id)
}

type Slot struct {
	Date      string `json:"date"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
}

type ResposeSlot struct {
	ID string `json:"id"`
	Slot
}

type createSlot struct {
	Slots []ResposeSlot `json:"slots"`
}
