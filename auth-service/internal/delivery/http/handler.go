package http

import (
	"auth-service/internal/auth"
	"auth-service/internal/pkg/jsonutil"
	"encoding/json"
	"net/http"
	"strings"
)

type AuthHandler struct {
	Service auth.AuthService
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func NewAuthHandler(mux *http.ServeMux, svc auth.AuthService) {
	h := &AuthHandler{Service: svc}
	mux.HandleFunc("/login", h.Login)
	mux.HandleFunc("/verify", h.Verify)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonutil.WriteError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonutil.WriteError(w, http.StatusBadRequest, "Malformed request")
		return
	}

	token, err := h.Service.Login(req.Username, req.Password)
	if err != nil {
		jsonutil.WriteError(w, http.StatusUnauthorized, "Invalid Credentials")
		return
	}

	res := LoginResponse{Token: token}
	jsonutil.Write(w, http.StatusOK, res)
}

func (h *AuthHandler) Verify(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonutil.WriteError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		jsonutil.WriteError(w, http.StatusUnauthorized, "Missing or malformed token")
		return
	}
	tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

	claims, err := h.Service.Verify(tokenStr)
	if err != nil {
		jsonutil.WriteError(w, http.StatusUnauthorized, err.Error())
		return
	}

	jsonutil.Write(w, http.StatusOK, claims)
}
