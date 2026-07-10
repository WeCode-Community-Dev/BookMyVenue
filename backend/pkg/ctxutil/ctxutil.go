package ctxutil

import "github.com/gin-gonic/gin"

func GetUserID(c *gin.Context) string {
	return c.GetString("user_id")
}

func GetUserRole(c *gin.Context) string {
	return c.GetString("role")
}

func GetUserEmail(c *gin.Context) string {
	return c.GetString("email")
}
