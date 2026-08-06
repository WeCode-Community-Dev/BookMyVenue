from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    VENUE = "venue"


class AuthProvider(str, Enum):
    EMAIL = "EMAIL"
    PHONE = "PHONE"
    GOOGLE = "GOOGLE"