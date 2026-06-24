package routes

import (
	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/internal/admin"
	"github.com/WeCode-Community-Dev/BookMyVenue/internal/auth"
	"github.com/WeCode-Community-Dev/BookMyVenue/internal/availability"
	"github.com/WeCode-Community-Dev/BookMyVenue/internal/users"
	"github.com/WeCode-Community-Dev/BookMyVenue/internal/venues"
	"github.com/WeCode-Community-Dev/BookMyVenue/internal/web"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/redis"
	"github.com/gin-gonic/gin"
)

func SetupRouter(r *gin.Engine, db *sqlc.Queries, rediClient *redis.Client) {
	adminWebRoutes := r.Group("/admin")
	userWebRoutes := r.Group("/user")

	webHandler := web.NewHandler()
	r.GET("/register", webHandler.RegisterPage)
	r.GET("/login", webHandler.LoginPage)
	r.GET("/user", webHandler.UserPage)
	r.GET("/owner", webHandler.OwnerPage)
	r.GET("/admin", webHandler.AdminPage)
	r.GET("/addVenue", webHandler.AddVenuePage)
	r.GET("/viewApprovedVenues", webHandler.ViewApprovedVenues)
	r.GET("/viewRejectedVenues", webHandler.ViewRejectedVenuesPage)
	r.GET("/viewPendingVenues", webHandler.ViewPendingVenuesPage)
	r.GET("/owner/venues/:id/setslot", webHandler.SetSlotPage)
	adminWebRoutes.GET("viewPendingVenuesPage", webHandler.Admin_viewPendingVenues)
	adminWebRoutes.GET("viewApprovedVenues", webHandler.Admin_viewApprovedVenues)
	adminWebRoutes.GET("viewRejectedVenues", webHandler.Admin_viewRejectedVenues)
	userWebRoutes.GET("/viewVenues", webHandler.User_viewVenues)

	api := r.Group("/api/v1")

	// Auth routes
	authHandler := auth.NewHandler(db)
	authRoutes := api.Group("/auth")
	{
		authRoutes.POST("/register", authHandler.Register)
		authRoutes.POST("/login", authHandler.Login)
		authRoutes.POST("/logout", authHandler.Logout)
	}

	// Venue routes
	ownerHandler := venues.NewHandler(db)
	ownerRoutes := api.Group("/owner")
	ownerRoutes.Use(auth.JWTAuthentication, auth.RoleGuarde("owner"))
	{
		ownerRoutes.POST("/addVenue", ownerHandler.AddVenue)
		ownerRoutes.POST("/:id/images", ownerHandler.AddImage)
		ownerRoutes.GET("/viewRejectedVenues", ownerHandler.ViewRejectedVenues)
		ownerRoutes.GET("/viewPendingVenues", ownerHandler.ViewPendingVenues)
		ownerRoutes.GET("/viewApprovedVenues", ownerHandler.ViewApprovedVenues)
	}

	// Admin routes
	adminHandler := admin.NewHandler(db)
	adminRoutes := api.Group("/admin")
	adminRoutes.Use(auth.JWTAuthentication, auth.RoleGuarde("admin"))
	{
		adminRoutes.GET("/viewPendingVenues", adminHandler.ViewPendingVenues)
		adminRoutes.PUT("/approveVenue/:id", adminHandler.ApproveVenue)
		adminRoutes.PUT("/rejectVenue/:id", adminHandler.RejectVenue)
		adminRoutes.GET("/viewApprovedVenues", adminHandler.ViewApprovedVenues)
		adminRoutes.GET("/viewRejectedVenues", adminHandler.ViewRejectedVenues)
	}

	userHandler := users.NewHandler(db)
	userRoutes := api.Group("/user")
	userRoutes.Use(auth.JWTAuthentication, auth.RoleGuarde("user"))
	{
		userRoutes.GET("/venues", userHandler.ViewVenue)
	}

	availabilityHandler := availability.NewService(db)
	availabilityRoutes := api.Group("")
	availabilityRoutes.Use(auth.JWTAuthentication)
	{
		availabilityRoutes.GET("/venues/:id/availability", auth.RoleGuarde("owner"), availabilityHandler.AvailableSlots)
		availabilityRoutes.POST("/venues/:id/availability", auth.RoleGuarde("owner"), availabilityHandler.SetNewSlot)
		availabilityRoutes.DELETE("/venues/:venue_id/availability/:slot_id", auth.RoleGuarde("owner"), availabilityHandler.DeleteSlot)
	}
}
