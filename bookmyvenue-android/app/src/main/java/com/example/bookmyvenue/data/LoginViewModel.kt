package com.example.bookmyvenue.data

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
private val android.content.Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "user_session")

sealed class LoginUiState {
    object Idle : LoginUiState()
    object Loading : LoginUiState()
    data class Success(val role: String) : LoginUiState()
    data class Error(val message: String) : LoginUiState()
}

class LoginViewModel(application: Application) : AndroidViewModel(application) {

    var uiState by mutableStateOf<LoginUiState>(LoginUiState.Idle)
        private set

    private val tokenKey = stringPreferencesKey("jwt_token")
    private val roleKey = stringPreferencesKey("user_role")

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
                    getApplication<Application>().applicationContext.dataStore.edit { preferences ->
                        preferences[tokenKey] = token
                        preferences[roleKey] = userRole
                    }

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