package jsonutil

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
)

func Write(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if data != nil {
		if err := json.NewEncoder(w).Encode(data); err != nil {
			http.Error(w, `{"error":"Internal Server Error"}`, http.StatusInternalServerError)
		}
	}
}

// WriteError is a helper specifically designed to format uniform error responses.
func WriteError(w http.ResponseWriter, status int, message string) {
	Write(w, status, map[string]string{"error": message})
}

// Read decodes the JSON request body into the target destination struct.
// It automatically closes the body and handles basic validation checks.
func Read(r *http.Request, dst interface{}) error {
	if r.Body == nil {
		return errors.New("request body is empty")
	}
	defer r.Body.Close()

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(dst); err != nil {
		if errors.Is(err, io.EOF) {
			return errors.New("request body is empty")
		}
		return err
	}
	return nil
}
