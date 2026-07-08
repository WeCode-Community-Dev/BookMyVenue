package com.example.bookmyvenue.data

import com.google.gson.annotations.SerializedName

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

data class BackendVenueItem(
    val id: String,
    val name: String,
    val location: String,
    val pricePerHour: Double,
    val capacity: Int,
    val description: String,
    val category: VenueCategoryObject,
    val imageUrls: List<String>?,
    val amenities: List<String>?,
    val moderationStatus: String,
    @SerializedName("rejectionReason") val rejectReason: String?,
    @SerializedName("isListed") val isListed: Boolean
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