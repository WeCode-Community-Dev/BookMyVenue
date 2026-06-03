package response

import "github.com/gin-gonic/gin"

// Success sends a standardized JSON success response containing
// a message and optional data payload with the specified HTTP status code.
func Success(c *gin.Context, status int, message string, data any) {
	c.JSON(status, gin.H{
		"message": message,
		"data":    data,
	})
}

func Error(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{
		"Error": message,
	})
}
