package web

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct{}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) LoginPage(c *gin.Context) {
	c.HTML(http.StatusOK, "login.html", nil)
}

func (h *Handler) RegisterPage(c *gin.Context) {
	c.HTML(http.StatusOK, "register.html", nil)
}

func (h *Handler) UserPage(c *gin.Context) {
	c.HTML(http.StatusOK, "user_homepage.html", nil)
}

func (h *Handler) OwnerPage(c *gin.Context) {
	c.HTML(http.StatusOK, "venue_owner_homepage.html", nil)
}

func (h *Handler) AdminPage(c *gin.Context) {
	c.HTML(http.StatusOK, "admin_homepage.html", nil)
}

func (h *Handler) AddVenuePage(c *gin.Context) {
	c.HTML(http.StatusOK, "add_venue.html", nil)
}

func (h *Handler) ViewRejectedVenuesPage(c *gin.Context) {
	c.HTML(http.StatusOK, "view_unapprovedVenues.html", nil)
}

func (h *Handler) ViewPendingVenuesPage(c *gin.Context) {
	c.HTML(http.StatusOK, "view_pendingVenue.html", nil)
}

func (h *Handler) ViewApprovedVenues(c *gin.Context) {
	c.HTML(http.StatusOK, "view_approvedVenues.html", nil)
}

// ---------Admin-------------
func (h *Handler) Admin_viewPendingVenues(c *gin.Context) {
	c.HTML(http.StatusOK, "admin_view_venuePending.html", nil)
}

func (h *Handler) Admin_viewApprovedVenues(c *gin.Context) {
	c.HTML(http.StatusOK, "admin_view_venueApproved.html", nil)
}
