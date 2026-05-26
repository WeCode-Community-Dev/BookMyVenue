package middlewares

import (
	"net/http"

	"github.com/WeCode-Community-Dev/BookMyVenue/api/services"
	"github.com/WeCode-Community-Dev/BookMyVenue/api/utils"
	"github.com/gin-gonic/gin"
)

type UserMiddleware struct {
	userService services.UserService
}

func NewUserMiddleware() *UserMiddleware {
	return &UserMiddleware{
		userService: services.NewUserService(),
	}
}

func (m *UserMiddleware) ValidateAuthToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			return
		}

		tokenString := authHeader[len("Bearer "):]
		token, err := utils.ValidateLoginToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		userID, _, _, err := utils.ExtractClaimsFromLoginToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		if userID == 0 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		c.Set("userID", userID)
		c.Next()
	}
}
