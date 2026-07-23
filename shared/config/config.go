// Package config provides lightweight environment-based configuration helpers.
package config

import "os"

// MustGetEnv returns the value of the environment variable named by key.
// If the variable is unset or empty, fallback is returned instead.
func MustGetEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
