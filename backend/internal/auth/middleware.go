package auth

import (
	"net/http"
	"strings"

	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/ctxutil"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/response"
	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/token"
	"github.com/gin-gonic/gin"
)

func JWTAuthentication(ctx *gin.Context) {

	// get token from Authorization header
	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" {
		response.Error(ctx, http.StatusUnauthorized, "authorization header missing")
		ctx.Abort()
		return
	}

	// header must be "Bearer <token>"
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		response.Error(ctx, http.StatusUnauthorized, "invalid authorization format")
		ctx.Abort()
		return
	}

	tokenString := parts[1]

	// verify token signature and expiry
	claims, err := token.VerifyAccessToken(tokenString)
	if err != nil {
		response.Error(ctx, http.StatusUnauthorized, "invalid or expired token")
		ctx.Abort()
		return
	}

	// attach user info to context for use in handlers
	ctx.Set("user_id", claims.UserID)
	ctx.Set("email", claims.Email)
	ctx.Set("role", claims.Role)

	ctx.Next()
}

// checks if user has the required role to access the route
func RoleGuarde(role string) gin.HandlerFunc {
	return func(ctx *gin.Context) {

		// get role from context (set by AuthMiddleware)
		userRole := ctxutil.GetUserRole(ctx)
		if userRole == "" {
			response.Error(ctx, http.StatusForbidden, "role not found")
			ctx.Abort()
			return
		}

		if userRole == role {
			ctx.Next()
			return
		}

		response.Error(ctx, http.StatusForbidden, "you do not have permission to access this resource")
		ctx.Abort()
	}
}
