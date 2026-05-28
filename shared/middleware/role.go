package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RequireRole returns a Gin middleware that aborts with 403 if the authenticated
// user's role (set by JWTAuth) is not in the allowed list.
// Must be chained after JWTAuth.
func RequireRole(roles ...string) gin.HandlerFunc {
	allowed := make(map[string]struct{}, len(roles))
	for _, r := range roles {
		allowed[r] = struct{}{}
	}

	return func(c *gin.Context) {
		role := c.GetString(CtxUserRole)
		if _, ok := allowed[role]; !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "insufficient permissions"})
			return
		}
		c.Next()
	}
}
