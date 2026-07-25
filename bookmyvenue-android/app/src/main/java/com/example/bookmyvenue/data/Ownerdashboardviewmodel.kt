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
import org.json.JSONArray
import org.json.JSONObject

sealed interface OwnerUiState {
    object Loading : OwnerUiState
    data class Success(
        val venues: List<OwnerVenueItem>,
        val rawVenues: List<BackendVenueItem>,
        val categories: List<String>,
        val userName: String,
        val userEmail: String
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

    var ownerOverviewState by mutableStateOf<OwnerOverviewDataDto?>(null)
        private set

    var isOverviewLoading by mutableStateOf(false)
        private set

    private var cachedVenues = listOf<OwnerVenueItem>()
    private var rawBackendVenues = listOf<BackendVenueItem>()
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
                var fetchedEmail = ""
                val profileResponse = NetworkClient.authService.getUserProfile(authHeader)
                if (profileResponse.isSuccessful) {
                    val userPayload = profileResponse.body()?.data?.user
                    fetchedName = userPayload?.name ?: "Owner"
                    fetchedEmail = userPayload?.email ?: ""
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
                    rawBackendVenues = backendVenues

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
                        rawVenues = rawBackendVenues,
                        categories = cachedCategories,
                        userName = fetchedName,
                        userEmail = fetchedEmail
                    )
                } else {
                    ownerUiState = OwnerUiState.Error("Failed to fetch owner details from database")
                }
            } catch (e: Exception) {
                ownerUiState = OwnerUiState.Error("Network Error: ${e.localizedMessage}")
            }
        }
    }

    fun fetchOwnerOverview() {
        viewModelScope.launch {
            isOverviewLoading = true
            try {
                val token = tokenManager.token.first()
                val authHeader = "Bearer $token"

                val response = NetworkClient.venueService.getOwnerOverview(authHeader)
                if (response.isSuccessful && response.body()?.success == true) {
                    ownerOverviewState = response.body()?.data
                }
            } catch (_: Exception) {
            } finally {
                isOverviewLoading = false
            }
        }
    }

    fun updateOwnerVenueDetails(
        venueId: String,
        pricePerHour: Double,
        capacity: Int,
        description: String,
        amenities: List<String>,
        imageUrls: List<String>
    ) {
        viewModelScope.launch {
            try {
                val token = tokenManager.token.first()
                val authHeader = "Bearer $token"

                val request = UpdateVenueDto(
                    pricePerHour = pricePerHour,
                    capacity = capacity,
                    description = description,
                    amenities = amenities,
                    imageUrls = imageUrls
                )

                val response = NetworkClient.venueService.updateOwnerVenue(authHeader, venueId, request)
                if (response.isSuccessful && response.body()?.success == true) {
                    fetchOwnerDashboardData()
                }
            } catch (_: Exception) {}
        }
    }

    fun fetchSlotsForVenue(
        venueId: String,
        onResult: (List<VenueSlotDto>) -> Unit,
        onError: (String) -> Unit
    ) {
        viewModelScope.launch {
            try {
                val response = NetworkClient.venueService.getPublicVenueSlots(venueId)
                if (response.isSuccessful && response.body() != null) {
                    val slotsResponse = response.body()!!
                    if (slotsResponse.success) {
                        onResult(slotsResponse.data)
                    } else {
                        onError("Failed to load listed slots.")
                    }
                } else {
                    onError("Failed to retrieve operational slots from server.")
                }
            } catch (e: Exception) {
                onError(e.localizedMessage ?: "An unexpected error occurred.")
            }
        }
    }

    fun createSlotForVenue(
        venueId: String,
        startTimeIso: String,
        endTimeIso: String,
        price: Double,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        viewModelScope.launch {
            try {
                val token = tokenManager.token.first()
                val authHeader = "Bearer $token"

                val response = NetworkClient.venueService.createVenueSlot(
                    token = authHeader,
                    venueId = venueId,
                    dto = CreateSlotDto(
                        startTime = startTimeIso,
                        endTime = endTimeIso,
                        price = price
                    )
                )

                if (response.isSuccessful && response.body()?.success == true) {
                    onSuccess()
                } else {
                    val errorBodyString = response.errorBody()?.string()
                    val parsedMsg = parseBackendErrorMessage(errorBodyString)
                    onError(parsedMsg ?: response.body()?.message ?: "Failed to generate slot on backend.")
                }
            } catch (e: Exception) {
                onError("Network Error: ${e.localizedMessage}")
            }
        }
    }

    fun deactivateSlot(
        slotId: String,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        viewModelScope.launch {
            try {
                val token = tokenManager.token.first()
                val authHeader = "Bearer $token"

                val response = NetworkClient.venueService.deactivateSlot(authHeader, slotId)
                if (response.isSuccessful && response.body()?.success == true) {
                    onSuccess()
                } else {
                    val errorBodyString = response.errorBody()?.string()
                    val parsedMsg = parseBackendErrorMessage(errorBodyString)
                    onError(parsedMsg ?: "Failed to deactivate slot.")
                }
            } catch (e: Exception) {
                onError("Network Error: ${e.localizedMessage}")
            }
        }
    }

    private fun parseBackendErrorMessage(rawErrorBody: String?): String? {
        if (rawErrorBody.isNullOrBlank()) return null
        return try {
            val json = JSONObject(rawErrorBody)
            when {
                json.has("message") -> {
                    val messageElement = json.get("message")
                    if (messageElement is JSONArray && messageElement.length() > 0) {
                        messageElement.getString(0)
                    } else {
                        messageElement.toString()
                    }
                }
                json.has("error") -> json.getString("error")
                else -> null
            }
        } catch (_: Exception) {
            null
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