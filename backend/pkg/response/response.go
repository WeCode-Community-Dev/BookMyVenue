package response

import "github.com/gin-gonic/gin"

type Response struct {
	Sucess  bool   `json:"success"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
}

// Success sends a standardized JSON success response containing
// a message and optional data payload with the specified HTTP status code.
func Success(c *gin.Context, statusCode int, message string, data any) {
	c.JSON(statusCode, Response{
		Sucess:  true,
		Message: message,
		Data:    data,
	})
}

func Error(c *gin.Context, statusCode int, errMessage string) {
	c.JSON(statusCode, Response{
		Sucess:  false,
		Message: errMessage,
		Error:   errMessage,
	})
}
