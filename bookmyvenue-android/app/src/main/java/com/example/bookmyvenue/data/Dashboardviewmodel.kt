package com.example.bookmyvenue.data

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import retrofit2.Response

sealed class DashboardUiState {
    object Loading : DashboardUiState()
    data class Success(
        val venues: List<VenueItem>,
        val categories: List<String>,
        val isLoggedIn: Boolean,
        val userName: String,
        val userEmail: String,
        val role: String
    ) : DashboardUiState()
    data class Error(val message: String) : DashboardUiState()
}

class DashboardViewModel(application: Application) : AndroidViewModel(application) {
    var dashboardState by mutableStateOf<DashboardUiState>(DashboardUiState.Loading)
        internal set

    private val tokenManager = TokenManager(application.applicationContext)

    private suspend fun <T> executeWithRetry(
        maxRetries: Int = 3,
        initialDelayMs: Long = 1000,
        block: suspend () -> Response<T>
    ): Response<T> {
        var currentDelay = initialDelayMs
        repeat(maxRetries - 1) {
            try {
                val response = block()
                if (response.isSuccessful || response.code() != 500) {
                    return response
                }
            } catch (e: Exception) {
            }
            delay(currentDelay)
            currentDelay *= 2
        }
        return block()
    }

    fun fetchDashboardData() {
        viewModelScope.launch {
            dashboardState = DashboardUiState.Loading
            try {
                val token = tokenManager.token.first()

                var isLoggedIn = false
                var fetchedName = "Guest"
                var fetchedEmail = ""
                var fetchedRole = "USER"

                if (!token.isNullOrBlank()) {
                    val profileResponse = executeWithRetry {
                        NetworkClient.authService.getUserProfile("Bearer $token")
                    }
                    if (profileResponse.isSuccessful) {
                        val body = profileResponse.body()
                        val serverRole = body?.data?.user?.role
                        if (body != null && body.success && body.data?.user != null && serverRole != null) {
                            isLoggedIn = true
                            fetchedName = body.data.user.name ?: "User"
                            fetchedEmail = body.data.user.email ?: ""
                            fetchedRole = serverRole
                        } else {
                            tokenManager.clearSession()
                            isLoggedIn = false
                            fetchedName = "Guest"
                            fetchedEmail = ""
                            fetchedRole = "USER"
                        }
                    } else if (profileResponse.code() == 401) {
                        tokenManager.clearSession()
                    }
                }

                val venuesResponse = executeWithRetry {
                    NetworkClient.venueService.getApprovedVenues()
                }
                val categoriesResponse = executeWithRetry {
                    NetworkClient.venueService.getCategories()
                }

                if (venuesResponse.isSuccessful && categoriesResponse.isSuccessful) {
                    val venuesList = venuesResponse.body()?.data ?: emptyList()
                    val categoriesList = categoriesResponse.body()?.data?.map { it.name } ?: emptyList()

                    dashboardState = DashboardUiState.Success(
                        venues = venuesList,
                        categories = categoriesList,
                        isLoggedIn = isLoggedIn,
                        userName = fetchedName,
                        userEmail = fetchedEmail,
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
            userEmail = "",
            role = "USER"
        )
    }
}