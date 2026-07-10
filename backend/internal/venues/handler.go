package venues

import (
	"net/http"

	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/ctxutil"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/response"
	"github.com/gin-gonic/gin"
)

// Handler exposes HTTP endpoints for venue-related operations.
type Handler struct {
	service *service
}

// NewHandler creates and returns a new venue handler.
func NewHandler(db *sqlc.Queries) *Handler {
	return &Handler{
		service: newService(db),
	}
}

// AddVenue handles requests to create a new venue and assign its amenities.
func (h *Handler) AddVenue(c *gin.Context) {
	ownerID := ctxutil.GetUserID(c)
	var req CreateVenueRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "invalid input")
		return
	}

	venue, err := h.service.addVenue(c.Request.Context(), req, ownerID)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	err = h.service.addAmenities(c.Request.Context(), req.Amenities, venue.ID)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "venue added", venue)
}

// AddImage handles uploading up to five images for a venue.
func (h *Handler) AddImage(c *gin.Context) {
	venueID := c.Param("id")
	ownerID := ctxutil.GetUserID(c)

	form, err := c.MultipartForm()
	if err != nil {
		response.Error(c, http.StatusBadRequest, "invalid form data")
		return
	}

	// get all images at once
	files := form.File["images"]

	if len(files) == 0 {
		response.Error(c, http.StatusBadRequest, "no images provided")
		return
	}

	if len(files) > 5 {
		response.Error(c, http.StatusBadRequest, "maximum 5 images allowed")
		return
	}

	for _, fileHeader := range files {

		// validate size
		if fileHeader.Size > 5*1024*1024 {
			response.Error(c, http.StatusBadRequest, fileHeader.Filename+" exceeds 5MB")
			return
		}

		// upload each image
		_, err = h.service.uploadImage(c, venueID, ownerID, fileHeader, fileHeader.Filename)
		if err != nil {
			// TODO: Replace string-based errors with sentinel/custom errors
			// and return more specific HTTP status codes (e.g. 404, 403)
			// instead of always returning 403
			response.Error(c, http.StatusForbidden, err.Error())
			return
		}
	}

	response.Success(c, http.StatusOK, "images uploaded successfully", nil)
}

func (h *Handler) ViewRejectedVenues(c *gin.Context) {
	ownerID := ctxutil.GetUserID(c)

	venues, err := h.service.viewRejectedVenues(c.Request.Context(), ownerID)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Rejected Venues", venues)

}

func (h *Handler) ViewPendingVenues(c *gin.Context) {
	ownerID := ctxutil.GetUserID(c)

	venues, err := h.service.viewPendingVenues(c.Request.Context(), ownerID)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Pending Venues", venues)
}

func (h *Handler) ViewApprovedVenues(c *gin.Context) {
	ownerID := ctxutil.GetUserID(c)

	venues, err := h.service.viewApprovedVenues(c.Request.Context(), ownerID)
	if err != nil {
		response.Error(c, http.StatusForbidden, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Approved Venues", venues)
}

// CreateVenueRequest represents the payload required to create a new venue.
type CreateVenueRequest struct {
	Name         string   `json:"name" binding:"required"`
	Description  string   `json:"description" binding:"required"`
	Category     string   `json:"category" binding:"required"`
	Address      string   `json:"address" binding:"required"`
	City         string   `json:"city" binding:"required"`
	State        string   `json:"state" binding:"required"`
	Pincode      string   `json:"pincode"`
	Capacity     int32    `json:"capacity" binding:"required"`
	PricePerHour float64  `json:"price_per_hour"`
	PricePerDay  float64  `json:"price_per_day"`
	Amenities    []string `json:"amenities"`
}
