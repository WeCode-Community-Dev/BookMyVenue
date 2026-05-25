package utils

import "github.com/gin-gonic/gin"

func WriteSuccessResponse(c *gin.Context, statusCode int, message string, data any) {
	response := gin.H{
		"status":  "success",
		"message": message,
	}
	if data != nil {
		response["data"] = data
	}
	c.JSON(statusCode, response)
}

func WriteFailedResponse(c *gin.Context, statusCode int, message string, err error) {
	response := gin.H{
		"status":  "failed",
		"message": message,
	}
	if err != nil {
		response["error"] = err.Error()
	}
	c.JSON(statusCode, response)
}
