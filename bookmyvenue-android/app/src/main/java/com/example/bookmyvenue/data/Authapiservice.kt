package com.example.bookmyvenue.data
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {
    @POST("api/auth/register")
    suspend fun registerUser(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("api/auth/login")
    suspend fun loginUser(@Body request: LoginRequest): Response<AuthResponse>

    @POST("api/auth/verify-otp")
    suspend fun verifyOtp(@Body request: VerifyOtpRequest): Response<AuthResponse>

    @POST("api/auth/resend-otp")
    suspend fun resendOtp(@Body request: ResendOtpRequest): Response<AuthResponse>

    @POST("api/auth/forgot-password")
    suspend fun forgotPassword(@Body request: ForgotPasswordRequest): Response<GenericResponse>

    @POST("api/auth/verify-forgot-password-otp")
    suspend fun verifyForgotPasswordOtp(@Body request: VerifyForgotPasswordOtpRequest): Response<GenericResponse>

    @POST("api/auth/reset-password")
    suspend fun resetPassword(@Body request: ResetPasswordRequest): Response<GenericResponse>

    @POST("api/auth/logout")
    suspend fun logoutUser(): Response<AuthResponse>

}