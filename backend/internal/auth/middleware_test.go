package auth

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/WeCode-Community-Dev/BookMyVenue/pkg/token"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/assert/v2"
	"github.com/stretchr/testify/require"
)

// JWTAuthentication
func TestJWTAuthentication_NoToken(t *testing.T) {
	router := gin.New()
	router.Use(JWTAuthentication)

	router.GET("/protected", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"user_id": ctx.GetString("user_id"),
			"email":   ctx.GetString("email"),
			"role":    ctx.GetString("role"),
		})
	})

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestJWTAuthentication_InvalidToken(t *testing.T) {
	router := gin.New()
	router.Use(JWTAuthentication)

	router.GET("/protected", func(ctx *gin.Context) {
		ctx.Status(http.StatusOK)
	})

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.AddCookie(&http.Cookie{
		Name:  "access_token",
		Value: "invalid-token",
	})

	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestJWTAuthentication_ValidToken(t *testing.T) {
	router := gin.New()
	router.Use(JWTAuthentication)

	router.GET("/protected", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"user_id": ctx.GetString("user_id"),
			"email":   ctx.GetString("email"),
			"role":    ctx.GetString("role"),
		})
	})

	tokenString, err := token.GenerateAccessToken("user123", "test@example.com", "owner")
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.AddCookie(&http.Cookie{
		Name:  "access_token",
		Value: tokenString,
	})

	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestJWTAuthentication_SetsContext(t *testing.T) {
	router := gin.New()
	router.Use(JWTAuthentication)

	router.GET("/protected", func(ctx *gin.Context) {
		assert.Equal(t, "user123", ctx.GetString("user_id"))
		assert.Equal(t, "test@example.com", ctx.GetString("email"))
		assert.Equal(t, "owner", ctx.GetString("role"))

		ctx.Status(http.StatusOK)
	})

	tokenString, err := token.GenerateAccessToken("user123", "test@example.com", "owner")
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.AddCookie(&http.Cookie{
		Name:  "access_token",
		Value: tokenString,
	})

	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

// RoleGuarde
func TestRoleGuarde(t *testing.T) {
	tests := []struct {
		name       string
		userRole   string
		required   []string
		wantStatus int
	}{
		{
			name:       "role missing",
			userRole:   "",
			required:   []string{"owner"},
			wantStatus: http.StatusForbidden,
		},
		{
			name:       "role matches",
			userRole:   "owner",
			required:   []string{"owner"},
			wantStatus: http.StatusOK,
		},
		{
			name:       "role deos not match any allowed role",
			userRole:   "user",
			required:   []string{"owner", "admin"},
			wantStatus: http.StatusForbidden,
		},
		{
			name:       "role matches admin from multiple roles",
			userRole:   "admin",
			required:   []string{"owner", "admin"},
			wantStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			router := gin.New()

			// Mock JWT middleware
			router.Use(func(ctx *gin.Context) {
				if tt.userRole != "" {
					ctx.Set("role", tt.userRole)
				}
				ctx.Next()
			})

			router.Use(RoleGuarde(tt.required...))

			router.GET("/protected", func(ctx *gin.Context) {
				ctx.Status(http.StatusOK)
			})

			req := httptest.NewRequest(http.MethodGet, "/protected", nil)

			w := httptest.NewRecorder()

			router.ServeHTTP(w, req)

			assert.Equal(t, tt.wantStatus, w.Code)
		})
	}
}
