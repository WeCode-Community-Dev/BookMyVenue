package service_errors

import "errors"

var (
	UserErrNotFound                  error = errors.New("user not found")
	UserErrAllFieldsRequired         error = errors.New("all fields are required")
	UserErrEmailAlreadyExists        error = errors.New("email already exists")
	UserErrMobileNumberAlreadyExists error = errors.New("mobile number already exists")
)
