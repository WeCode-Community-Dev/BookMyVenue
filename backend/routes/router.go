package routes

import (
	"github.com/WeCode-Community-Dev/BookMyVenue/db/sqlc"
	"github.com/WeCode-Community-Dev/BookMyVenue/internal/auth"
	"github.com/WeCode-Community-Dev/BookMyVenue/internal/venues"
	"github.com/WeCode-Community-Dev/BookMyVenue/internal/web"
	"github.com/gin-gonic/gin"
)

func SetupRouter(r *gin.Engine, db *sqlc.Queries) {
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

	// userRoutes := api.Group("/user")
	// {
	// 	userRoutes.GET("/", userResponse)
	// }
}

// func userResponse(ctx *gin.Context) {
// 	ctx.JSON(200, gin.H{
// 		"message": "user",
// 	})
// }

// func venueResponse(ctx *gin.Context) {
// 	ctx.JSON(200, gin.H{
// 		"message": "venue",
// 	})
// }
