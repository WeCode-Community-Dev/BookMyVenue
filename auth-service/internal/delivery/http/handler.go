package http

import (
	"auth-service/internal/auth"
	"auth-service/internal/domain"
	"auth-service/internal/pkg/jsonutil"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

type AuthHandler struct {
	Service auth.AuthService
}

type RegisterRequest struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type RegisterResponse struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Role     string `json:"role"`
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
	mux.HandleFunc("/register", h.Register)
	mux.HandleFunc("/verify", h.Verify)
	mux.HandleFunc("/list", h.List)
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

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonutil.WriteError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonutil.WriteError(w, http.StatusBadRequest, "Malformed request")
		return
	}

	if req.Username == "" || req.Password == "" {
		jsonutil.WriteError(w, http.StatusBadRequest, "Username and password are required")
		return
	}

	user, err := h.Service.Register(req.Name, req.Email, req.Role, req.Password)
	if err != nil {
		if errors.Is(err, domain.ErrDuplicateEmail) {
			jsonutil.WriteError(w, http.StatusConflict, err.Error())
			return
		}
		jsonutil.WriteError(w, http.StatusInternalServerError, "Internal server error")
		return
	}
	jsonutil.Write(w, http.StatusCreated, user)

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

func (h *AuthHandler) List(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		jsonutil.WriteError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	users, err := h.Service.List()
	if err != nil {
		jsonutil.WriteError(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}
	jsonutil.Write(w, http.StatusOK, users)

}
