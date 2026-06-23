class ErrorCode:
    VALIDATION_ERROR = "VALIDATION_ERROR"
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
    ACCOUNT_DISABLED = "ACCOUNT_DISABLED"
    EMAIL_EXISTS = "EMAIL_EXISTS"
    UNAUTHORIZED = "UNAUTHORIZED"
    INTERNAL_ERROR = "INTERNAL_ERROR"
    NOT_FOUND = "NOT_FOUND"


ERROR_MESSAGES = {
    ErrorCode.VALIDATION_ERROR: "Please check your input and try again.",
    ErrorCode.INVALID_CREDENTIALS: "Invalid email or password.",
    ErrorCode.ACCOUNT_DISABLED: "Your account has been deactivated.",
    ErrorCode.EMAIL_EXISTS: "Email already registered.",
    ErrorCode.UNAUTHORIZED: "Please log in to continue.",
    ErrorCode.INTERNAL_ERROR: "Something went wrong. Please try again later.",
    ErrorCode.NOT_FOUND: "The requested resource was not found.",
}


def get_error_message(code: str, fallback: str = "An error occurred.") -> str:
    return ERROR_MESSAGES.get(code, fallback)
