package com.example.bookmyvenue.data

data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val role: String = "USER"
)

data class LoginRequest(
    val email: String,
    val password: String
)


data class VerifyOtpRequest(
    val email: String,
    val otp: String
)


data class ResendOtpRequest(
    val email: String
)

data class AuthResponse(
    val success: Boolean,
    val message: String,
    val data: AuthData?
)

data class AuthData(
    val accessToken: String?,
    val user: UserProfile?
)

data class UserProfile(
    val id: String,
    val email: String,
    val name: String,
    val role: String
)

data class ForgotPasswordRequest(
    val email: String
)

data class VerifyForgotPasswordOtpRequest(
    val email: String,
    val otp: String
)

data class ResetPasswordRequest(
    val email: String,
    val newPassword: String,
    val confirmPassword: String
)

data class GenericResponse(
    val success: Boolean,
    val message: String
)