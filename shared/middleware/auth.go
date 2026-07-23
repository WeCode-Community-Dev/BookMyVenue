// Package middleware provides reusable Gin middleware for all BookMyVenue services.
package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Context keys written by JWTAuth and read by handlers and RequireRole.
const (
	CtxUserID   = "user_id"
	CtxUserRole = "user_role"
)

// JWTAuth returns a Gin middleware that validates a Bearer JWT in the
// Authorization header. On success it writes CtxUserID and CtxUserRole
// into the Gin context for downstream handlers.
func JWTAuth(secretKey string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing or malformed token"})
			return
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return []byte(secretKey), nil
		})
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
			return
		}

		c.Set(CtxUserID, fmt.Sprint(claims["user_id"]))
		c.Set(CtxUserRole, fmt.Sprint(claims["role"]))
		c.Next()
	}
}
