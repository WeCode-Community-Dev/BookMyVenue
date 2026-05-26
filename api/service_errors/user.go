package service_errors

import "errors"

var (
	UserErrNotFound                  error = errors.New("user not found")
	UserErrAllFieldsRequired         error = errors.New("all fields are required")
	UserErrEmailAlreadyExists        error = errors.New("email already exists")
	UserErrMobileNumberAlreadyExists error = errors.New("mobile number already exists")
	UserErrInvalidEmailFormat        error = errors.New("invalid email format")
	UserErrEmailNotFound             error = errors.New("email not found")
	UserErrEmptyEmail                error = errors.New("email is required")

	UserErrEmptyCredentials   error = errors.New("email and password are required")
	UserErrInvalidCredentials error = errors.New("invalid email or password")

	UserErrInvalidRefreshToken error = errors.New("invalid refresh token")

	UserErrInvalidOTP error = errors.New("invalid OTP")
)
