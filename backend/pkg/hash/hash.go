package hash

import (
	"golang.org/x/crypto/bcrypt"
)

// Compare the provided password with the stored hash. Returns true if they match.
func CheckPassword(requestPassword, storedHash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(requestPassword))
	return err == nil
}

// HashPassword takes a plaintext string and returns its bcrypt hash
func HashPassword(password string) (string, error) {
	// GenerateFromPassword automatically handles salt generation
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(hashedPassword), nil
}
