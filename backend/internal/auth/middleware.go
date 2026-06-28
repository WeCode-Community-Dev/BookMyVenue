package auth

import (
	"net/http"
	"slices"

	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/ctxutil"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/response"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/token"
	"github.com/gin-gonic/gin"
)

func JWTAuthentication(c *gin.Context) {

	// get token from cookie
	cookie, err := c.Cookie("access_token")
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "token not found")
	}

	tokenString := cookie

	// verify token signature and expiry
	claims, err := token.VerifyAccessToken(tokenString)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "invalid or expired token")
		c.Abort()
		return
	}

	// attach user info to context for use in handlers
	c.Set("user_id", claims.UserID)
	c.Set("email", claims.Email)
	c.Set("role", claims.Role)

	c.Next()
}

// checks if user has the required role to access the route
func RoleGuarde(roles ...string) gin.HandlerFunc {
	return func(ctx *gin.Context) {

		// get role from context (set by AuthMiddleware)
		userRole := ctxutil.GetUserRole(ctx)
		if userRole == "" {
			response.Error(ctx, http.StatusForbidden, "role not found")
			ctx.Abort()
			return
		}

		if slices.Contains(roles, userRole) {
			ctx.Next()
			return
		}

		response.Error(ctx, http.StatusForbidden, "you do not have permission to access this resource")
		ctx.Abort()
	}
}
