package com.example.bookmyvenue.data

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

sealed class LoginUiState {
    object Idle : LoginUiState()
    object Loading : LoginUiState()
    data class Success(val role: String) : LoginUiState()
    data class Error(val message: String) : LoginUiState()
}

class LoginViewModel(application: Application) : AndroidViewModel(application) {

    var uiState by mutableStateOf<LoginUiState>(LoginUiState.Idle)
        private set

    private val tokenManager = TokenManager(application.applicationContext)

    fun login(email: String, password: String) {
        viewModelScope.launch {
            uiState = LoginUiState.Loading
            try {
                val request = LoginRequest(email = email, password = password)
                val response = NetworkClient.authService.loginUser(request)

                if (response.isSuccessful && response.body()?.success == true) {
                    val authData = response.body()?.data
                    val userRole = authData?.user?.role ?: "USER"
                    val token = authData?.accessToken ?: ""

                    tokenManager.saveSession(token, userRole)

                    uiState = LoginUiState.Success(userRole)
                } else {
                    val errorMsg = response.body()?.message ?: "Invalid Credentials"
                    uiState = LoginUiState.Error(errorMsg)
                }
            } catch (e: Exception) {
                uiState = LoginUiState.Error("Network Error: ${e.localizedMessage}")
            }
        }
    }

    fun resetState() {
        uiState = LoginUiState.Idle
    }
}