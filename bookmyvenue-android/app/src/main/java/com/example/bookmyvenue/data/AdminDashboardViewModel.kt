package com.example.bookmyvenue.data

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.bookmyvenue.ui_layout.AdminVenueItem
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

sealed class AdminUiState {
    object Loading : AdminUiState()
    data class Success(
        val pendingVenues: List<AdminVenueItem>,
        val allVenues: List<AdminVenueItem>,
        val categories: List<CategoryItem>,
        val allBookings: List<HistoryBookingItemDto>,
        val userName: String,
        val userEmail: String,
        val totalRevenue: Double = 0.0,
        val totalBookingsCount: Int = 0
    ) : AdminUiState()
    data class Error(val message: String) : AdminUiState()
}

class AdminDashboardViewModel(application: Application) : AndroidViewModel(application) {

    var adminUiState by mutableStateOf<AdminUiState>(AdminUiState.Loading)
        private set

    private val tokenManager = TokenManager(application.applicationContext)

    fun fetchAdminDashboardData() {
        viewModelScope.launch {
            adminUiState = AdminUiState.Loading
            try {
                val token = tokenManager.token.first()
                if (token.isNullOrBlank()) {
                    adminUiState = AdminUiState.Error("Authentication token missing.")
                    return@launch
                }

                val authHeader = "Bearer $token"
                var fetchedName = "Admin Account"
                var fetchedEmail = ""

                val profileResponse = NetworkClient.authService.getUserProfile(authHeader)
                if (profileResponse.isSuccessful) {
                    val userPayload = profileResponse.body()?.data?.user
                    fetchedName = userPayload?.name ?: "Admin"
                    fetchedEmail = userPayload?.email ?: ""
                }

                val venuesResponse = NetworkClient.venueService.getAllVenuesForAdmin(authHeader)
                val categoriesResponse = NetworkClient.venueService.getAllCategoriesForAdmin(authHeader)
                val bookingsResponse = NetworkClient.venueService.getAllBookingsForAdmin(authHeader)

                if (venuesResponse.isSuccessful && categoriesResponse.isSuccessful) {
                    val rawVenues = venuesResponse.body()?.data ?: emptyList()
                    val rawCategories = categoriesResponse.body()?.data ?: emptyList()

                    val allMapped = rawVenues.map { backendItem ->
                        val calculatedStatus = when (backendItem.moderationStatus.uppercase()) {
                            "APPROVED", "ACTIVE" -> "ACTIVE"
                            "REJECTED" -> "REJECTED"
                            else -> "PENDING"
                        }

                        AdminVenueItem(
                            id = backendItem.id,
                            name = backendItem.name,
                            location = backendItem.location,
                            pricePerHour = backendItem.pricePerHour,
                            capacity = backendItem.capacity,
                            description = backendItem.description ?: "",
                            category = backendItem.category.name,
                            status = calculatedStatus,
                            ownerName = backendItem.owner?.name ?: "",
                            ownerEmail = backendItem.owner?.email ?: "",
                            imageUrls = backendItem.imageUrls ?: emptyList(),
                            amenities = backendItem.amenities ?: emptyList()
                        )
                    }

                    val pendingMapped = allMapped.filter { it.status == "PENDING" }

                    var rawBookingsList = emptyList<HistoryBookingItemDto>()
                    var platformRevenue = 0.0
                    var confirmedCount = 0

                    if (bookingsResponse.isSuccessful && bookingsResponse.body() != null) {
                        rawBookingsList = bookingsResponse.body()!!.data
                        val confirmedBookings = rawBookingsList.filter { it.status.equals("CONFIRMED", ignoreCase = true) }
                        platformRevenue = confirmedBookings.sumOf { it.totalPrice }
                        confirmedCount = confirmedBookings.size
                    }

                    adminUiState = AdminUiState.Success(
                        pendingVenues = pendingMapped,
                        allVenues = allMapped,
                        categories = rawCategories,
                        allBookings = rawBookingsList,
                        userName = fetchedName,
                        userEmail = fetchedEmail,
                        totalRevenue = platformRevenue,
                        totalBookingsCount = confirmedCount
                    )
                } else {
                    adminUiState = AdminUiState.Error("Failed to fetch admin metrics.")
                }
            } catch (e: Exception) {
                adminUiState = AdminUiState.Error("Network Error: ${e.localizedMessage}")
            }
        }
    }

    fun approveVenue(venueId: String) {
        viewModelScope.launch {
            try {
                val token = tokenManager.token.first()
                val response = NetworkClient.venueService.approveVenue("Bearer $token", venueId)
                if (response.isSuccessful) {
                    delay(300)
                    fetchAdminDashboardData()
                }
            } catch (_: Exception) {}
        }
    }

    fun rejectVenue(venueId: String, reason: String) {
        viewModelScope.launch {
            try {
                val token = tokenManager.token.first()
                val response = NetworkClient.venueService.rejectVenue(
                    "Bearer $token", venueId, RejectVenueRequest(reason)
                )
                if (response.isSuccessful) {
                    delay(300)
                    fetchAdminDashboardData()
                }
            } catch (_: Exception) {}
        }
    }

    fun createCategory(name: String, description: String) {
        viewModelScope.launch {
            try {
                val token = tokenManager.token.first()
                val request = CreateCategoryRequest(
                    name = name,
                    description = description.takeIf { it.isNotBlank() }
                )
                val response = NetworkClient.venueService.createCategory("Bearer $token", request)
                if (response.isSuccessful) {
                    delay(300)
                    fetchAdminDashboardData()
                }
            } catch (_: Exception) {}
        }
    }
}