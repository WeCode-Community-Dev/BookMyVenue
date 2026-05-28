package http

import (
	"auth-service/internal/domain"
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// ---------------------------------------------------------------------------
// Mock AuthService
// ---------------------------------------------------------------------------

type mockAuthService struct {
	loginFn    func(email, password string) (string, error)
	verifyFn   func(token string) (jwt.MapClaims, error)
	registerFn func(name, email, role, password string) (*domain.User, error)
	listFn     func() ([]domain.User, error)
}

func (m *mockAuthService) Login(email, password string) (string, error) {
	return m.loginFn(email, password)
}

func (m *mockAuthService) Verify(token string) (jwt.MapClaims, error) {
	return m.verifyFn(token)
}

func (m *mockAuthService) Register(name, email, role, password string) (*domain.User, error) {
	return m.registerFn(name, email, role, password)
}

func (m *mockAuthService) List() ([]domain.User, error) {
	return m.listFn()
}

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

// newTestRouter builds a Gin engine in test mode wired to the given service.
func newTestRouter(svc *mockAuthService) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New() // no middleware noise in test output
	api := r.Group("/")
	NewAuthHandler(api, svc)
	return r
}

// jsonBody serialises v to a *bytes.Buffer suitable for http.Request bodies.
func jsonBody(t *testing.T, v any) *bytes.Buffer {
	t.Helper()
	b, err := json.Marshal(v)
	if err != nil {
		t.Fatalf("jsonBody: marshal error: %v", err)
	}
	return bytes.NewBuffer(b)
}

// decode unmarshals the response body into dst.
func decode(t *testing.T, body []byte, dst any) {
	t.Helper()
	if err := json.Unmarshal(body, dst); err != nil {
		t.Fatalf("decode: %v (body was: %s)", err, body)
	}
}

// ---------------------------------------------------------------------------
// POST /register
// ---------------------------------------------------------------------------

func TestRegister(t *testing.T) {
	tests := []struct {
		name       string
		body       any
		mockReturn func(name, email, role, password string) (*domain.User, error)
		wantStatus int
		wantError  string // non-empty → assert {"error": ...} in body
		wantUser   bool   // true → assert a domain.User shape in body
	}{
		{
			name: "success",
			body: map[string]string{
				"name":     "Alice",
				"username": "alice",
				"email":    "alice@example.com",
				"password": "s3cr3t",
				"role":     "user",
			},
			mockReturn: func(name, email, role, password string) (*domain.User, error) {
				return &domain.User{
					ID:    "uuid-1",
					Name:  name,
					Email: email,
					Role:  role,
				}, nil
			},
			wantStatus: http.StatusCreated,
			wantUser:   true,
		},
		{
			name: "missing username",
			body: map[string]string{
				"email":    "alice@example.com",
				"password": "s3cr3t",
			},
			mockReturn: nil, // service should not be called
			wantStatus: http.StatusBadRequest,
			wantError:  "Username and password are required",
		},
		{
			name: "missing password",
			body: map[string]string{
				"username": "alice",
				"email":    "alice@example.com",
			},
			mockReturn: nil,
			wantStatus: http.StatusBadRequest,
			wantError:  "Username and password are required",
		},
		{
			name: "malformed json",
			body: "not-json",
			mockReturn: nil,
			wantStatus: http.StatusBadRequest,
			wantError:  "Malformed request",
		},
		{
			name: "duplicate email",
			body: map[string]string{
				"name":     "Bob",
				"username": "bob",
				"email":    "bob@example.com",
				"password": "s3cr3t",
			},
			mockReturn: func(name, email, role, password string) (*domain.User, error) {
				return nil, domain.ErrDuplicateEmail
			},
			wantStatus: http.StatusConflict,
			wantError:  domain.ErrDuplicateEmail.Error(),
		},
		{
			name: "service internal error",
			body: map[string]string{
				"name":     "Charlie",
				"username": "charlie",
				"email":    "charlie@example.com",
				"password": "s3cr3t",
			},
			mockReturn: func(name, email, role, password string) (*domain.User, error) {
				return nil, errors.New("db is on fire")
			},
			wantStatus: http.StatusInternalServerError,
			wantError:  "Internal server error",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			svc := &mockAuthService{
				registerFn: tc.mockReturn,
			}
			// For cases where the service should never be called, guard against panics.
			if svc.registerFn == nil {
				svc.registerFn = func(_, _, _, _ string) (*domain.User, error) {
					t.Error("Register: service should not have been called")
					return nil, nil
				}
			}

			var buf *bytes.Buffer
			if s, ok := tc.body.(string); ok {
				buf = bytes.NewBufferString(s)
			} else {
				buf = jsonBody(t, tc.body)
			}

			req := httptest.NewRequest(http.MethodPost, "/register", buf)
			req.Header.Set("Content-Type", "application/json")
			rec := httptest.NewRecorder()

			newTestRouter(svc).ServeHTTP(rec, req)

			if rec.Code != tc.wantStatus {
				t.Errorf("status: got %d, want %d (body: %s)", rec.Code, tc.wantStatus, rec.Body)
			}

			if tc.wantError != "" {
				var resp map[string]string
				decode(t, rec.Body.Bytes(), &resp)
				if resp["error"] != tc.wantError {
					t.Errorf("error message: got %q, want %q", resp["error"], tc.wantError)
				}
			}

			if tc.wantUser {
				var user domain.User
				decode(t, rec.Body.Bytes(), &user)
				if user.Email == "" {
					t.Errorf("expected a user in body, got: %s", rec.Body)
				}
			}
		})
	}
}

// ---------------------------------------------------------------------------
// POST /login
// ---------------------------------------------------------------------------

func TestLogin(t *testing.T) {
	tests := []struct {
		name       string
		body       any
		mockReturn func(email, password string) (string, error)
		wantStatus int
		wantError  string
		wantToken  bool
	}{
		{
			name: "success",
			body: map[string]string{
				"email":    "alice@example.com",
				"password": "s3cr3t",
			},
			mockReturn: func(email, password string) (string, error) {
				return "signed.jwt.token", nil
			},
			wantStatus: http.StatusOK,
			wantToken:  true,
		},
		{
			name: "invalid credentials",
			body: map[string]string{
				"email":    "alice@example.com",
				"password": "wrong",
			},
			mockReturn: func(email, password string) (string, error) {
				return "", errors.New("invalid credentials")
			},
			wantStatus: http.StatusUnauthorized,
			wantError:  "Invalid Credentials",
		},
		{
			name:       "malformed json",
			body:       "not-json",
			mockReturn: nil,
			wantStatus: http.StatusBadRequest,
			wantError:  "Malformed request",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			svc := &mockAuthService{
				loginFn: tc.mockReturn,
			}
			if svc.loginFn == nil {
				svc.loginFn = func(_, _ string) (string, error) {
					t.Error("Login: service should not have been called")
					return "", nil
				}
			}

			var buf *bytes.Buffer
			if s, ok := tc.body.(string); ok {
				buf = bytes.NewBufferString(s)
			} else {
				buf = jsonBody(t, tc.body)
			}

			req := httptest.NewRequest(http.MethodPost, "/login", buf)
			req.Header.Set("Content-Type", "application/json")
			rec := httptest.NewRecorder()

			newTestRouter(svc).ServeHTTP(rec, req)

			if rec.Code != tc.wantStatus {
				t.Errorf("status: got %d, want %d (body: %s)", rec.Code, tc.wantStatus, rec.Body)
			}

			if tc.wantError != "" {
				var resp map[string]string
				decode(t, rec.Body.Bytes(), &resp)
				if resp["error"] != tc.wantError {
					t.Errorf("error message: got %q, want %q", resp["error"], tc.wantError)
				}
			}

			if tc.wantToken {
				var resp LoginResponse
				decode(t, rec.Body.Bytes(), &resp)
				if resp.Token == "" {
					t.Errorf("expected a non-empty token in body, got: %s", rec.Body)
				}
			}
		})
	}
}

// ---------------------------------------------------------------------------
// POST /verify
// ---------------------------------------------------------------------------

func TestVerify(t *testing.T) {
	validClaims := jwt.MapClaims{
		"user_id": "uuid-1",
		"role":    "user",
	}

	tests := []struct {
		name        string
		authHeader  string // value of the Authorization header; "" means omit
		mockReturn  func(token string) (jwt.MapClaims, error)
		wantStatus  int
		wantError   string
		wantClaims  bool
	}{
		{
			name:       "success",
			authHeader: "Bearer valid.jwt.token",
			mockReturn: func(token string) (jwt.MapClaims, error) {
				if token != "valid.jwt.token" {
					return nil, errors.New("unexpected token")
				}
				return validClaims, nil
			},
			wantStatus: http.StatusOK,
			wantClaims: true,
		},
		{
			name:       "missing Authorization header",
			authHeader: "",
			mockReturn: nil,
			wantStatus: http.StatusUnauthorized,
			wantError:  "Missing or malformed token",
		},
		{
			name:       "malformed Authorization header - no Bearer prefix",
			authHeader: "Token somestuff",
			mockReturn: nil,
			wantStatus: http.StatusUnauthorized,
			wantError:  "Missing or malformed token",
		},
		{
			name:       "expired token",
			authHeader: "Bearer expired.jwt.token",
			mockReturn: func(token string) (jwt.MapClaims, error) {
				return nil, errors.New("token has expired")
			},
			wantStatus: http.StatusUnauthorized,
			wantError:  "token has expired",
		},
		{
			name:       "invalid token",
			authHeader: "Bearer tampered.token",
			mockReturn: func(token string) (jwt.MapClaims, error) {
				return nil, errors.New("invalid or altered token")
			},
			wantStatus: http.StatusUnauthorized,
			wantError:  "invalid or altered token",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			svc := &mockAuthService{
				verifyFn: tc.mockReturn,
			}
			if svc.verifyFn == nil {
				svc.verifyFn = func(_ string) (jwt.MapClaims, error) {
					t.Error("Verify: service should not have been called")
					return nil, nil
				}
			}

			req := httptest.NewRequest(http.MethodPost, "/verify", http.NoBody)
			if tc.authHeader != "" {
				req.Header.Set("Authorization", tc.authHeader)
			}
			rec := httptest.NewRecorder()

			newTestRouter(svc).ServeHTTP(rec, req)

			if rec.Code != tc.wantStatus {
				t.Errorf("status: got %d, want %d (body: %s)", rec.Code, tc.wantStatus, rec.Body)
			}

			if tc.wantError != "" {
				var resp map[string]string
				decode(t, rec.Body.Bytes(), &resp)
				if resp["error"] != tc.wantError {
					t.Errorf("error message: got %q, want %q", resp["error"], tc.wantError)
				}
			}

			if tc.wantClaims {
				var claims map[string]any
				decode(t, rec.Body.Bytes(), &claims)
				if _, ok := claims["user_id"]; !ok {
					t.Errorf("expected claims in body, got: %s", rec.Body)
				}
			}
		})
	}
}
