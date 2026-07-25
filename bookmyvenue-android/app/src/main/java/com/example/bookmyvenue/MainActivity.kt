package com.example.bookmyvenue

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.example.bookmyvenue.data.BookingViewModel
import com.example.bookmyvenue.data.NetworkClient
import com.example.bookmyvenue.data.RazorpayOrderDto
import com.example.bookmyvenue.data.TokenManager
import com.example.bookmyvenue.ui.theme.BookMyVenueTheme
import com.example.bookmyvenue.ui_layout.AppNavigation
import com.razorpay.Checkout
import com.razorpay.PaymentData
import com.razorpay.PaymentResultWithDataListener
import org.json.JSONObject

class MainActivity : ComponentActivity(), PaymentResultWithDataListener {

    private lateinit var bookingViewModel: BookingViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)

        Checkout.preload(applicationContext)

        val apiService = NetworkClient.venueService
        val tokenManager = TokenManager(this)

        bookingViewModel = BookingViewModel(apiService, tokenManager)

        enableEdgeToEdge()
        setContent {
            BookMyVenueTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    AppNavigation(
                        bookingViewModel = bookingViewModel,
                        onLaunchPayment = { orderDetails ->
                            startRazorpayPayment(orderDetails)
                        },
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }

    private fun startRazorpayPayment(order: RazorpayOrderDto) {
        val checkout = Checkout()
        checkout.setKeyID(order.keyId)

        try {
            val options = JSONObject().apply {
                put("name", "BookMyVenue")
                put("description", order.description)
                put("order_id", order.razorpayOrderId)
                put("currency", order.currency)
                put("amount", order.amount)

                val prefill = JSONObject().apply {
                    put("email", order.prefill.email)
                    put("name", order.prefill.name)
                }
                put("prefill", prefill)

                val theme = JSONObject().apply {
                    put("color", "#E51E26")
                }
                put("theme", theme)
            }

            checkout.open(this, options)
        } catch (e: Exception) {
            Toast.makeText(this, "Checkout launch failed: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    override fun onPaymentSuccess(razorpayPaymentId: String?, paymentData: PaymentData?) {
        if (paymentData != null && razorpayPaymentId != null) {
            bookingViewModel.verifyTransaction(
                paymentId = razorpayPaymentId,
                orderId = paymentData.orderId ?: "",
                signature = paymentData.signature ?: ""
            )
        }
    }

    override fun onPaymentError(code: Int, response: String?, paymentData: PaymentData?) {
        Toast.makeText(this, "Payment Cancelled or Failed: $response", Toast.LENGTH_LONG).show()
    }
}