package com.example.bookmyvenue.data

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

sealed class DashboardUiState {
    object Loading : DashboardUiState()
    data class Success(
        val venues: List<VenueItem>,
        val categories: List<String>,
        val isLoggedIn: Boolean,
        val userName: String,
        val role: String
    ) : DashboardUiState()
    data class Error(val message: String) : DashboardUiState()
}

class DashboardViewModel(application: Application) : AndroidViewModel(application) {
    var dashboardState by mutableStateOf<DashboardUiState>(DashboardUiState.Loading)
        internal set

    private val tokenManager = TokenManager(application.applicationContext)

    fun fetchDashboardData() {
        viewModelScope.launch {
            dashboardState = DashboardUiState.Loading
            try {
                val token = tokenManager.token.first()

                var isLoggedIn = false
                var fetchedName = "Guest"
                var fetchedRole = "USER"

                if (!token.isNullOrBlank()) {
                    val profileResponse = NetworkClient.authService.getUserProfile("Bearer $token")
                    if (profileResponse.isSuccessful) {
                        val body = profileResponse.body()
                        val serverRole = body?.data?.user?.role
                        if (body != null && body.success && body.data?.user != null && serverRole != null) {
                            isLoggedIn = true
                            fetchedName = body.data.user.name ?: "User"
                            fetchedRole = serverRole
                        } else {
                            tokenManager.clearSession()
                            isLoggedIn = false
                            fetchedName = "Guest"
                            fetchedRole = "USER"
                        }
                    } else {
                        tokenManager.clearSession()
                    }
                }

                val venuesResponse = NetworkClient.venueService.getApprovedVenues()
                val categoriesResponse = NetworkClient.venueService.getCategories()

                if (venuesResponse.isSuccessful && categoriesResponse.isSuccessful) {
                    val venuesList = venuesResponse.body()?.data ?: emptyList()
                    val categoriesList = categoriesResponse.body()?.data?.map { it.name } ?: emptyList()

                    dashboardState = DashboardUiState.Success(
                        venues = venuesList,
                        categories = categoriesList,
                        isLoggedIn = isLoggedIn,
                        userName = fetchedName,
                        role = fetchedRole
                    )
                } else {
                    dashboardState = DashboardUiState.Error("Failed to fetch data from backend.")
                }
            } catch (e: Exception) {
                dashboardState = DashboardUiState.Error("Network Error: ${e.localizedMessage}")
            }
        }
    }

    fun clearSession() {
        viewModelScope.launch {
            tokenManager.clearSession()
            fetchDashboardData()
        }
    }
    fun resetToGuestState() {
        val currentSuccess = dashboardState as? DashboardUiState.Success
        dashboardState = DashboardUiState.Success(
            venues = currentSuccess?.venues ?: emptyList(),
            categories = currentSuccess?.categories ?: emptyList(),
            isLoggedIn = false,
            userName = "Guest",
            role = "USER"
        )
    }
}