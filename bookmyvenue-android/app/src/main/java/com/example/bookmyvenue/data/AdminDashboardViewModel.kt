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
        val categories: List<CategoryItem>
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

                val venuesResponse = NetworkClient.venueService.getAllVenuesForAdmin("Bearer $token")
                val categoriesResponse = NetworkClient.venueService.getAllCategoriesForAdmin("Bearer $token")

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
                            ownerName = "Venue Owner"
                        )
                    }

                    val pendingMapped = allMapped.filter { it.status == "PENDING" }

                    adminUiState = AdminUiState.Success(
                        pendingVenues = pendingMapped,
                        allVenues = allMapped,
                        categories = rawCategories
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