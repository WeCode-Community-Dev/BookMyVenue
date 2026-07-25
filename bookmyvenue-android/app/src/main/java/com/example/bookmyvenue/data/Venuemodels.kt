package com.example.bookmyvenue.data

import com.google.gson.annotations.SerializedName

data class GenericResponseDto(
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String? = null
)

data class VenueResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: List<VenueItem>
)

data class VenueItem(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("description") val description: String?,
    @SerializedName("location") val location: String,
    @SerializedName("pricePerHour") val pricePerHour: Double,
    @SerializedName("capacity") val capacity: Int,
    @SerializedName("category") val category: VenueCategoryObject,
    @SerializedName("imageUrls") val imageUrls: List<String>,
    @SerializedName("amenities") val amenities: List<String>?,
    @SerializedName("cancellationWindowHours") val cancellationWindowHours: Int,
    @SerializedName("isListed") val isListed: Boolean
)

data class UserProfileResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: UserProfilePayload?
)

data class UserProfilePayload(
    @SerializedName("user") val user: UserProfileData?
)

data class UserProfileData(
    @SerializedName("id") val id: String?,
    @SerializedName("name") val name: String?,
    @SerializedName("email") val email: String?,
    @SerializedName("role") val role: String?
)

data class CategoryResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: List<CategoryItem>
)

data class CategoryItem(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("isListed") val isListed: Boolean
)

data class RegisterVenueRequest(
    val name: String,
    val description: String,
    val location: String,
    val address: String,
    val pricePerHour: Double,
    val capacity: Int,
    val imageUrls: List<String>,
    val amenities: List<String>,
    val categoryId: String
)

data class RegisterVenueResponse(
    val success: Boolean,
    val message: String?,
    val data: BackendVenueItem?
)

data class OwnerVenuesResponse(
    val success: Boolean,
    val message: String?,
    val data: List<BackendVenueItem>?
)

data class VenueCategoryObject(
    val id: String,
    val name: String
)

data class VenueOwnerInfo(
    @SerializedName("id") val id: String?,
    @SerializedName("name") val name: String?,
    @SerializedName("email") val email: String?
)

data class BackendVenueItem(
    val id: String,
    val name: String,
    val location: String,
    val pricePerHour: Double,
    val capacity: Int,
    val description: String?,
    val category: VenueCategoryObject,
    val imageUrls: List<String>?,
    val amenities: List<String>?,
    val moderationStatus: String,
    @SerializedName("rejectionReason") val rejectReason: String?,
    @SerializedName("isListed") val isListed: Boolean,
    @SerializedName("owner") val owner: VenueOwnerInfo? = null
)

data class CreateCategoryRequest(
    val name: String,
    val description: String? = null
)

data class SingleCategoryResponse(
    val success: Boolean,
    val message: String?,
    val data: CategoryItem?
)

data class UploadImageResponse(
    val success: Boolean,
    val imageUrl: String
)

data class SlotsResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: List<VenueSlotDto>
)

data class SlotBookingDto(
    @SerializedName("status") val status: String
)

data class VenueSlotDto(
    @SerializedName("id") val id: String,
    @SerializedName("venueId") val venueId: String,
    @SerializedName("startTime") val startTime: String,
    @SerializedName("endTime") val endTime: String,
    @SerializedName("price") val price: Double,
    @SerializedName("isActive") val isActive: Boolean,
    @SerializedName("bookings") val bookings: List<SlotBookingDto>? = emptyList()
)

data class CreateBookingDto(
    @SerializedName("slotId") val slotId: String
)

data class BookingResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String?,
    @SerializedName("data") val data: BookingDataDto
)

data class BookingDataDto(
    @SerializedName("id") val id: String,
    @SerializedName("status") val status: String,
    @SerializedName("totalPrice") val totalPrice: Double,
    @SerializedName("bookedStartTime") val bookedStartTime: String,
    @SerializedName("bookedEndTime") val bookedEndTime: String,
    @SerializedName("expiresAt") val expiresAt: String?
)

data class RazorpayOrderResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String?,
    @SerializedName("data") val data: RazorpayOrderDto
)

data class RazorpayOrderDto(
    @SerializedName("bookingId") val bookingId: String,
    @SerializedName("paymentId") val paymentId: String,
    @SerializedName("keyId") val keyId: String,
    @SerializedName("amount") val amount: Int,
    @SerializedName("currency") val currency: String,
    @SerializedName("razorpayOrderId") val razorpayOrderId: String,
    @SerializedName("bookingStatus") val bookingStatus: String,
    @SerializedName("prefill") val prefill: PrefillDataDto,
    @SerializedName("description") val description: String
)

data class PrefillDataDto(
    @SerializedName("name") val name: String,
    @SerializedName("email") val email: String
)

data class VerifyPaymentDto(
    @SerializedName("razorpay_payment_id") val razorpayPaymentId: String,
    @SerializedName("razorpay_order_id") val razorpayOrderId: String,
    @SerializedName("razorpay_signature") val razorpaySignature: String
)

data class PaymentVerificationResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String?,
    @SerializedName("data") val data: PaymentVerificationPayloadDto
)

data class PaymentVerificationPayloadDto(
    @SerializedName("id") val id: String,
    @SerializedName("bookingId") val bookingId: String,
    @SerializedName("status") val status: String,
    @SerializedName("amount") val amount: Int
)

data class PaymentDetailsDto(
    @SerializedName("paymentId") val paymentId: String? = null,
    @SerializedName("razorpayOrderId") val razorpayOrderId: String? = null,
    @SerializedName("method") val method: String? = "Razorpay",
    @SerializedName("status") val status: String? = "PAID"
)

data class UserHistoryResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: List<HistoryBookingItemDto>
)

data class HistoryBookingItemDto(
    @SerializedName("id") val id: String,
    @SerializedName("userId") val userId: String,
    @SerializedName("venueId") val venueId: String,
    @SerializedName("slotId") val slotId: String,
    @SerializedName("status") val status: String,
    @SerializedName("totalPrice") val totalPrice: Double,
    @SerializedName("bookedStartTime") val bookedStartTime: String,
    @SerializedName("bookedEndTime") val bookedEndTime: String,
    @SerializedName("createdAt") val createdAt: String,
    @SerializedName("expiresAt") val expiresAt: String?,
    @SerializedName("cancelledAt") val cancelledAt: String?,
    @SerializedName("cancellationReason") val cancellationReason: String?,
    @SerializedName("payment") val payment: PaymentDetailsDto? = null,
    @SerializedName("user") val user: HistoryUserSummaryDto?,
    @SerializedName("venue") val venue: HistoryVenueSummaryDto,
    @SerializedName("slot") val slot: HistorySlotSummaryDto
)

data class HistoryUserSummaryDto(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("email") val email: String
)

data class HistoryVenueSummaryDto(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("location") val location: String,
    @SerializedName("ownerId") val ownerId: String
)

data class HistorySlotSummaryDto(
    @SerializedName("id") val id: String,
    @SerializedName("startTime") val startTime: String,
    @SerializedName("endTime") val endTime: String,
    @SerializedName("price") val price: Double,
    @SerializedName("isActive") val isActive: Boolean
)

data class OwnerOverviewResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: OwnerOverviewDataDto
)

data class OwnerOverviewDataDto(
    @SerializedName("totalEarnings") val totalEarnings: Double,
    @SerializedName("totalBookingsCount") val totalBookingsCount: Int,
    @SerializedName("upcomingBookings") val upcomingBookings: List<HistoryBookingItemDto> = emptyList(),
    @SerializedName("completedBookings") val completedBookings: List<HistoryBookingItemDto> = emptyList(),
    @SerializedName("allBookings") val allBookings: List<HistoryBookingItemDto> = emptyList()
)

data class UpdateVenueDto(
    val pricePerHour: Double? = null,
    val capacity: Int? = null,
    val description: String? = null,
    val amenities: List<String>? = null,
    val imageUrls: List<String>? = null
)