package com.example.bookmyvenue.data

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

sealed class BookingUiState {
    object Idle : BookingUiState()
    object Loading : BookingUiState()
    data class SlotsLoaded(val slots: List<VenueSlotDto>) : BookingUiState()
    data class OrderCreated(val orderDetails: RazorpayOrderDto) : BookingUiState()
    object PaymentVerified : BookingUiState()
    data class Error(val message: String) : BookingUiState()
}

sealed interface UserBookingsUiState {
    object Loading : UserBookingsUiState
    data class Success(val bookings: List<HistoryBookingItemDto>) : UserBookingsUiState
    data class Error(val message: String) : UserBookingsUiState
}

sealed interface OwnerOverviewUiState {
    object Loading : OwnerOverviewUiState
    data class Success(val overview: OwnerOverviewDataDto) : OwnerOverviewUiState
    data class Error(val message: String) : OwnerOverviewUiState
}

class BookingViewModel(
    private val apiService: VenueApiService,
    private val tokenManager: TokenManager
) : ViewModel() {

    private val _uiState = MutableStateFlow<BookingUiState>(BookingUiState.Idle)
    val uiState: StateFlow<BookingUiState> = _uiState.asStateFlow()

    private val _userBookingsState = MutableStateFlow<UserBookingsUiState>(UserBookingsUiState.Loading)
    val userBookingsState: StateFlow<UserBookingsUiState> = _userBookingsState.asStateFlow()

    private val _ownerOverviewState = MutableStateFlow<OwnerOverviewUiState>(OwnerOverviewUiState.Loading)
    val ownerOverviewState: StateFlow<OwnerOverviewUiState> = _ownerOverviewState.asStateFlow()

    init {
        viewModelScope.launch {
            val token = tokenManager.token.first()
            if (token.isNullOrBlank()) {
                _userBookingsState.value = UserBookingsUiState.Success(emptyList())
                _ownerOverviewState.value = OwnerOverviewUiState.Error("User not authenticated")
            }
        }
    }

    private suspend fun getAuthHeader(): String? {
        val rawToken = tokenManager.token.first()
        if (rawToken.isNullOrBlank()) return null
        return if (rawToken.startsWith("Bearer ")) rawToken else "Bearer $rawToken"
    }

    fun fetchSlots(venueId: String) {
        viewModelScope.launch {
            _uiState.value = BookingUiState.Loading
            try {
                val response = apiService.getPublicVenueSlots(venueId)
                if (response.isSuccessful && response.body() != null) {
                    val slotsResponse = response.body()!!
                    if (slotsResponse.success) {
                        _uiState.value = BookingUiState.SlotsLoaded(slotsResponse.data)
                    } else {
                        _uiState.value = BookingUiState.Error("Failed to load slots.")
                    }
                } else {
                    _uiState.value = BookingUiState.Error("Failed to fetch slots from server.")
                }
            } catch (e: Exception) {
                _uiState.value = BookingUiState.Error(e.localizedMessage ?: "An error occurred.")
            }
        }
    }

    fun initiateCheckout(slotId: String) {
        viewModelScope.launch {
            _uiState.value = BookingUiState.Loading
            try {
                val token = getAuthHeader() ?: run {
                    _uiState.value = BookingUiState.Error("Authentication required.")
                    return@launch
                }
                val bookingResponse = apiService.createBooking(token, CreateBookingDto(slotId))

                if (bookingResponse.isSuccessful && bookingResponse.body() != null) {
                    val bookingResult = bookingResponse.body()!!
                    if (bookingResult.success) {
                        val bookingId = bookingResult.data.id
                        val orderResponse = apiService.createPaymentOrder(token, bookingId)
                        if (orderResponse.isSuccessful && orderResponse.body() != null) {
                            val orderResult = orderResponse.body()!!
                            if (orderResult.success) {
                                _uiState.value = BookingUiState.OrderCreated(orderResult.data)
                            } else {
                                _uiState.value = BookingUiState.Error(orderResult.message ?: "Payment engine generation failed.")
                            }
                        } else {
                            _uiState.value = BookingUiState.Error("Failed to initialize payment order.")
                        }
                    } else {
                        _uiState.value = BookingUiState.Error(bookingResult.message ?: "Slot locking failed.")
                    }
                } else {
                    _uiState.value = BookingUiState.Error("Slot locking failed. It might have expired.")
                }
            } catch (e: Exception) {
                _uiState.value = BookingUiState.Error(e.localizedMessage ?: "Transaction initiation aborted.")
            }
        }
    }

    fun verifyTransaction(paymentId: String, orderId: String, signature: String) {
        viewModelScope.launch {
            _uiState.value = BookingUiState.Loading
            try {
                val token = getAuthHeader() ?: run {
                    _uiState.value = BookingUiState.Error("Authentication required.")
                    return@launch
                }
                val verifyDto = VerifyPaymentDto(paymentId, orderId, signature)
                val response = apiService.verifyPayment(token, verifyDto)

                if (response.isSuccessful && response.body() != null) {
                    val verificationResult = response.body()!!
                    if (verificationResult.success) {
                        _uiState.value = BookingUiState.PaymentVerified
                    } else {
                        _uiState.value = BookingUiState.Error(verificationResult.message ?: "Payment verification failed.")
                    }
                } else {
                    _uiState.value = BookingUiState.Error("Verification communication error.")
                }
            } catch (e: Exception) {
                _uiState.value = BookingUiState.Error(e.localizedMessage ?: "Verification communication error.")
            }
        }
    }

    fun fetchUserBookings() {
        viewModelScope.launch {
            _userBookingsState.value = UserBookingsUiState.Loading
            try {
                val token = getAuthHeader() ?: run {
                    _userBookingsState.value = UserBookingsUiState.Error("Authentication required.")
                    return@launch
                }
                val response = apiService.getMyBookings(token)
                if (response.isSuccessful && response.body() != null) {
                    val historyResponse = response.body()!!
                    if (historyResponse.success) {
                        _userBookingsState.value = UserBookingsUiState.Success(historyResponse.data)
                    } else {
                        _userBookingsState.value = UserBookingsUiState.Error("Failed to fetch bookings.")
                    }
                } else if (response.code() == 403) {
                    _userBookingsState.value = UserBookingsUiState.Success(emptyList())
                } else {
                    _userBookingsState.value = UserBookingsUiState.Error("Server communication error while getting history.")
                }
            } catch (e: Exception) {
                _userBookingsState.value = UserBookingsUiState.Error(e.localizedMessage ?: "An unexpected error occurred.")
            }
        }
    }

    fun fetchOwnerOverview() {
        viewModelScope.launch {
            _ownerOverviewState.value = OwnerOverviewUiState.Loading
            try {
                val token = getAuthHeader() ?: run {
                    _ownerOverviewState.value = OwnerOverviewUiState.Error("Authentication required.")
                    return@launch
                }
                val response = apiService.getOwnerOverview(token)
                if (response.isSuccessful && response.body() != null) {
                    val overviewResponse = response.body()!!
                    if (overviewResponse.success) {
                        _ownerOverviewState.value = OwnerOverviewUiState.Success(overviewResponse.data)
                    } else {
                        _ownerOverviewState.value = OwnerOverviewUiState.Error("Failed to fetch overview metrics.")
                    }
                } else if (response.code() == 403) {
                    _ownerOverviewState.value = OwnerOverviewUiState.Error("Access restricted to venue owners.")
                } else {
                    _ownerOverviewState.value = OwnerOverviewUiState.Error("Server communication error while getting dashboard metrics.")
                }
            } catch (e: Exception) {
                _ownerOverviewState.value = OwnerOverviewUiState.Error(e.localizedMessage ?: "An unexpected error occurred.")
            }
        }
    }
}