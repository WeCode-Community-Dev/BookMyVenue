package com.example.bookmyvenue.data

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import okhttp3.MultipartBody
import retrofit2.http.Multipart
import retrofit2.http.Part
import com.google.gson.annotations.SerializedName

interface VenueApiService {

    @GET("api/venues")
    suspend fun getApprovedVenues(): Response<VenueResponse>

    @GET("api/categories")
    suspend fun getCategories(): Response<CategoryResponse>

    @GET("api/venues/me")
    suspend fun getOwnerVenues(
        @Header("Authorization") token: String
    ): Response<OwnerVenuesResponse>

    @POST("api/venues")
    suspend fun createVenue(
        @Header("Authorization") token: String,
        @Body request: RegisterVenueRequest
    ): Response<RegisterVenueResponse>

    @PATCH("api/venues/{id}/list")
    suspend fun listVenue(
        @Header("Authorization") token: String,
        @Path("id") venueId: String
    ): Response<RegisterVenueResponse>

    @PATCH("api/venues/{id}/unlist")
    suspend fun unlistVenue(
        @Header("Authorization") token: String,
        @Path("id") venueId: String
    ): Response<RegisterVenueResponse>

    @GET("api/venues/admin/all")
    suspend fun getAllVenuesForAdmin(
        @Header("Authorization") token: String
    ): Response<OwnerVenuesResponse>

    @PATCH("api/venues/admin/{id}/approve")
    suspend fun approveVenue(
        @Header("Authorization") token: String,
        @Path("id") venueId: String
    ): Response<RegisterVenueResponse>

    @PATCH("api/venues/admin/{id}/reject")
    suspend fun rejectVenue(
        @Header("Authorization") token: String,
        @Path("id") venueId: String,
        @Body body: RejectVenueRequest
    ): Response<RegisterVenueResponse>

    @GET("api/categories/admin/all")
    suspend fun getAllCategoriesForAdmin(
        @Header("Authorization") token: String
    ): Response<CategoryResponse>

    @POST("api/categories")
    suspend fun createCategory(
        @Header("Authorization") token: String,
        @Body request: CreateCategoryRequest
    ): Response<SingleCategoryResponse>

    @Multipart
    @POST("api/venues/upload")
    suspend fun uploadVenueImage(
        @Header("Authorization") authHeader: String,
        @Part image: MultipartBody.Part
    ): Response<UploadImageResponse>

    @GET("api/venues/{venueId}/slots")
    suspend fun getPublicVenueSlots(
        @Path("venueId") venueId: String
    ): Response<SlotsResponse>

    @POST("api/bookings")
    suspend fun createBooking(
        @Header("Authorization") token: String,
        @Body dto: CreateBookingDto
    ): Response<BookingResponse>

    @POST("api/payments/bookings/{bookingId}/order")
    suspend fun createPaymentOrder(
        @Header("Authorization") token: String,
        @Path("bookingId") bookingId: String
    ): Response<RazorpayOrderResponse>

    @POST("api/payments/verify")
    suspend fun verifyPayment(
        @Header("Authorization") token: String,
        @Body dto: VerifyPaymentDto
    ): Response<PaymentVerificationResponse>

    @POST("api/venues/{venueId}/slots")
    suspend fun createVenueSlot(
        @Header("Authorization") token: String,
        @Path("venueId") venueId: String,
        @Body dto: CreateSlotDto
    ): Response<StandardResponseWrapper>

    @GET("api/bookings/me")
    suspend fun getMyBookings(
        @Header("Authorization") token: String
    ): Response<UserHistoryResponse>

    @GET("api/bookings/owner/overview")
    suspend fun getOwnerOverview(
        @Header("Authorization") token: String
    ): Response<OwnerOverviewResponse>

    @GET("api/bookings/owner/venues/{venueId}")
    suspend fun getOwnerVenueBookings(
        @Header("Authorization") token: String,
        @Path("venueId") venueId: String
    ): Response<UserHistoryResponse>

    @PATCH("api/bookings/{id}/cancel")
    suspend fun cancelBooking(
        @Header("Authorization") token: String,
        @Path("id") bookingId: String
    ): Response<BookingResponse>

    @GET("api/bookings/admin/all")
    suspend fun getAllBookingsForAdmin(
        @Header("Authorization") token: String
    ): Response<UserHistoryResponse>

    @PATCH("api/venues/{id}")
    suspend fun updateOwnerVenue(
        @Header("Authorization") token: String,
        @Path("id") venueId: String,
        @Body dto: UpdateVenueDto
    ): Response<GenericResponseDto>

    @PATCH("api/venue-slots/{slotId}/deactivate")
    suspend fun deactivateSlot(
        @Header("Authorization") token: String,
        @Path("slotId") slotId: String
    ): Response<GenericResponseDto>
}

data class RejectVenueRequest(
    val reason: String
)

data class CreateSlotDto(
    @SerializedName("startTime")
    val startTime: String,
    @SerializedName("endTime")
    val endTime: String,
    @SerializedName("price")
    val price: Double
)

data class StandardResponseWrapper(
    val success: Boolean,
    val message: String
)