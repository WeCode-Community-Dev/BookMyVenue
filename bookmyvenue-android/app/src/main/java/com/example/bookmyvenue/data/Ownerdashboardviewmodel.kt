package com.example.bookmyvenue.data

import android.app.Application
import android.content.Context
import android.net.Uri
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.bookmyvenue.ui_layout.OwnerVenueItem
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

sealed interface OwnerUiState {
    object Loading : OwnerUiState
    data class Success(
        val venues: List<OwnerVenueItem>,
        val categories: List<String>,
        val userName: String
    ) : OwnerUiState
    data class Error(val message: String) : OwnerUiState
}

class OwnerDashboardViewModel(application: Application) : AndroidViewModel(application) {

    var ownerUiState: OwnerUiState by mutableStateOf(OwnerUiState.Loading)
        private set

    val uploadedImageUrls = mutableStateListOf<String>()

    var isUploadingImage by mutableStateOf(false)
        private set

    var imageUploadError by mutableStateOf<String?>(null)
        private set

    private var cachedVenues = listOf<OwnerVenueItem>()
    private var cachedCategories = listOf<String>()
    private var rawCategoriesList = listOf<CategoryItem>()
    private val tokenManager = TokenManager(application.applicationContext)

    fun fetchOwnerDashboardData() {
        ownerUiState = OwnerUiState.Loading
        viewModelScope.launch {
            try {
                val token = tokenManager.token.first()
                val authHeader = "Bearer $token"

                var fetchedName = "Owner Panel"
                val profileResponse = NetworkClient.authService.getUserProfile(authHeader)
                if (profileResponse.isSuccessful) {
                    fetchedName = profileResponse.body()?.data?.user?.name ?: "Owner"
                }

                val categoriesResponse = NetworkClient.venueService.getCategories()
                if (categoriesResponse.isSuccessful) {
                    rawCategoriesList = categoriesResponse.body()?.data ?: emptyList()
                    cachedCategories = rawCategoriesList.map { it.name }
                } else {
                    rawCategoriesList = emptyList()
                    cachedCategories = emptyList()
                }

                val venuesResponse = NetworkClient.venueService.getOwnerVenues(authHeader)
                if (venuesResponse.isSuccessful) {
                    val backendVenues = venuesResponse.body()?.data ?: emptyList()

                    cachedVenues = backendVenues.map { backendVenue ->
                        val displayStatus = when (backendVenue.moderationStatus.uppercase()) {
                            "APPROVED", "ACTIVE" -> "ACTIVE"
                            "REJECTED" -> "REJECTED"
                            else -> "PENDING"
                        }

                        OwnerVenueItem(
                            id = backendVenue.id,
                            name = backendVenue.name,
                            location = backendVenue.location,
                            pricePerHour = backendVenue.pricePerHour,
                            category = backendVenue.category.name,
                            status = displayStatus,
                            rejectReason = backendVenue.rejectReason,
                            isListed = backendVenue.isListed
                        )
                    }

                    ownerUiState = OwnerUiState.Success(
                        venues = cachedVenues,
                        categories = cachedCategories,
                        userName = fetchedName
                    )
                } else {
                    ownerUiState = OwnerUiState.Error("Failed to fetch owner details from database")
                }
            } catch (e: Exception) {
                ownerUiState = OwnerUiState.Error("Network Error: ${e.localizedMessage}")
            }
        }
    }

    fun uploadVenueImage(context: Context, imageUri: Uri) {
        viewModelScope.launch {
            isUploadingImage = true
            imageUploadError = null
            try {
                val token = tokenManager.token.first()
                val authHeader = "Bearer $token"

                val multipartBodyPart = context.createMultipartImagePart(imageUri, "image")
                if (multipartBodyPart != null) {
                    val response = NetworkClient.venueService.uploadVenueImage(authHeader, multipartBodyPart)
                    if (response.isSuccessful && response.body()?.success == true) {
                        response.body()?.imageUrl?.let { url ->
                            uploadedImageUrls.add(url)
                        }
                    } else {
                        imageUploadError = "Upload failed server-side."
                    }
                } else {
                    imageUploadError = "Failed to resolve file buffer path."
                }
            } catch (e: Exception) {
                imageUploadError = "Upload Network Error: ${e.localizedMessage}"
            } finally {
                isUploadingImage = false
            }
        }
    }

    fun removeUploadedImage(url: String) {
        uploadedImageUrls.remove(url)
    }

    fun clearUploadedImageState() {
        uploadedImageUrls.clear()
        imageUploadError = null
        isUploadingImage = false
    }

    fun submitVenue(
        name: String,
        location: String,
        address: String,
        price: Double,
        capacity: Int,
        description: String,
        category: String,
        amenities: List<String>,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        if (uploadedImageUrls.size != 6) {
            onError("You must upload exactly 6 photos to submit!")
            return
        }

        val targetCategory = rawCategoriesList.find { it.name.equals(category, ignoreCase = true) }
        if (targetCategory == null) {
            onError("Selected category configuration is invalid.")
            return
        }

        viewModelScope.launch {
            try {
                val token = tokenManager.token.first()
                val authHeader = "Bearer $token"

                val request = RegisterVenueRequest(
                    name = name,
                    description = description,
                    location = location,
                    address = address,
                    pricePerHour = price,
                    capacity = capacity,
                    imageUrls = uploadedImageUrls.toList(),
                    amenities = amenities,
                    categoryId = targetCategory.id
                )

                val response = NetworkClient.venueService.createVenue(authHeader, request)
                if (response.isSuccessful && response.body()?.success == true) {
                    clearUploadedImageState()
                    fetchOwnerDashboardData()
                    onSuccess()
                } else {
                    val errorMsg = response.body()?.message ?: "Submission rejected by server"
                    onError(errorMsg)
                }
            } catch (e: Exception) {
                onError("Network Error: ${e.localizedMessage}")
            }
        }
    }

    fun toggleVenueListing(venueId: String, currentStatus: Boolean) {
        viewModelScope.launch {
            try {
                val token = tokenManager.token.first()
                val authHeader = "Bearer $token"

                val response = if (currentStatus) {
                    NetworkClient.venueService.unlistVenue(authHeader, venueId)
                } else {
                    NetworkClient.venueService.listVenue(authHeader, venueId)
                }

                if (response.isSuccessful && response.body()?.success == true) {
                    fetchOwnerDashboardData()
                }
            } catch (_: Exception) {
            }
        }
    }
}