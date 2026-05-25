package routes

import (
	"github.com/WeCode-Community-Dev/BookMyVenue/api/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(routes *gin.RouterGroup) {
	userHandler := handlers.NewUserHandler()
	v1 := routes.Group("/v1/users")
	{
		v1.POST("/signup", userHandler.Signup)
		v1.POST("/login", userHandler.Login)
		v1.POST("/refresh-token", userHandler.RotateRefreshToken)
		v1.POST("/revoke-token", userHandler.RevokeRefreshToken)
	}
}
