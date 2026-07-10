package venues

import (
	"mime/multipart"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type uploadImage struct {
}

func newUploadImage() *uploadImage {
	return &uploadImage{}
}

func (u *uploadImage) saveImage(c *gin.Context, file *multipart.FileHeader, filename string) (string, error) {
	filePath := uuid.New().String() + filepath.Ext(filename)
	filePath = "./internal/venues/uploads/" + filePath

	err := c.SaveUploadedFile(file, filePath)
	if err != nil {
		return "", nil
	}

	return filePath, nil
}
