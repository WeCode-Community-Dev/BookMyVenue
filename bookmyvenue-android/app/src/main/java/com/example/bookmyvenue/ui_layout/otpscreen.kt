package com.example.bookmyvenue.ui_layout

import android.widget.Toast
import androidx.compose.foundation.border
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.bookmyvenue.data.NetworkClient
import com.example.bookmyvenue.data.ResendOtpRequest
import com.example.bookmyvenue.data.VerifyOtpRequest
import kotlinx.coroutines.launch

@Composable
fun OtpScreen(email: String, onVerificationSuccess: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var otpCode by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    val maxOtpLength = 6

    val brandColorRed = Color(0xFFE51E26)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Verify Your Email", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1E293B))
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "An OTP has been sent to $email",
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(32.dp))
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.fillMaxWidth()
        ) {
            BasicTextField(
                value = otpCode,
                onValueChange = {
                    if (it.length <= maxOtpLength && it.all { char -> char.isDigit() }) {
                        otpCode = it
                    }
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier
                    .fillMaxWidth()
                    .alpha(0.01f),
                enabled = !isLoading
            )
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally),
                modifier = Modifier.fillMaxWidth()
            ) {
                repeat(maxOtpLength) { index ->
                    val char = when {
                        index < otpCode.length -> otpCode[index].toString()
                        else -> ""
                    }
                    val isFocused = index == otpCode.length
                    val borderColor = if (isFocused) brandColorRed else Color.LightGray
                    val borderWidth = if (isFocused) 2.dp else 1.dp

                    Box(
                        modifier = Modifier
                            .size(50.dp)
                            .background(Color.White, RoundedCornerShape(8.dp))
                            .border(borderWidth, borderColor, RoundedCornerShape(8.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = char,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            textAlign = TextAlign.Center,
                            color = Color(0xFF1E293B)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
        TextButton(
            onClick = {
                isLoading = true
                coroutineScope.launch {
                    try {
                        val request = ResendOtpRequest(email = email)
                        val response = NetworkClient.authService.resendOtp(request)

                        isLoading = false
                        if (response.isSuccessful && response.body()?.success == true) {
                            Toast.makeText(
                                context,
                                "A fresh signup OTP has been sent!",
                                Toast.LENGTH_SHORT
                            ).show()
                        } else {
                            val errorMsg = response.body()?.message
                                ?: "Failed to resend OTP. Please try again."
                            Toast.makeText(context, errorMsg, Toast.LENGTH_LONG).show()
                        }
                    } catch (e: Exception) {
                        isLoading = false
                        Toast.makeText(
                            context,
                            "Network Error: ${e.localizedMessage}",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }
            },
            enabled = !isLoading
        ) {
            Text(
                text = "Didn't receive the code? Resend OTP",
                color = brandColorRed
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                if (otpCode.length < maxOtpLength) {
                    Toast.makeText(
                        context,
                        "Please enter the full 6-digit code",
                        Toast.LENGTH_SHORT
                    ).show()
                    return@Button
                }

                isLoading = true
                coroutineScope.launch {
                    try {
                        val request = VerifyOtpRequest(email = email, otp = otpCode)
                        val response = NetworkClient.authService.verifyOtp(request)

                        isLoading = false
                        if (response.isSuccessful) {
                            Toast.makeText(
                                context,
                                "Account verified successfully!",
                                Toast.LENGTH_LONG
                            ).show()
                            onVerificationSuccess()
                        } else {
                            val errorMsg = response.body()?.message ?: "Invalid OTP code"
                            Toast.makeText(context, errorMsg, Toast.LENGTH_LONG).show()
                        }
                    } catch (e: Exception) {
                        isLoading = false
                        Toast.makeText(
                            context,
                            "Network Error: ${e.localizedMessage}",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp),
            shape = RoundedCornerShape(8.dp),
            colors = ButtonDefaults.buttonColors(containerColor = brandColorRed),
            enabled = !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    color = Color.White,
                    modifier = Modifier.size(24.dp)
                )
            } else {
                Text("Verify", fontSize = 16.sp, color = Color.White)
            }
        }
    }
}