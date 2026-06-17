package com.example.bookmyvenue.ui_layout
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.bookmyvenue.data.*
import kotlinx.coroutines.launch

@Composable
fun ForgotPasswordScreen(onNavigateBackToLogin: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var currentStep by remember { mutableStateOf(1) }
    var isLoading by remember { mutableStateOf(false) }
    var email by remember { mutableStateOf("") }
    var otpCode by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    val maxOtpLength = 6

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        if (currentStep == 1) {
            Text("Reset Password", style = MaterialTheme.typography.headlineLarge)
            Spacer(modifier = Modifier.height(8.dp))
            Text("Enter your registered email address to receive a validation code.", textAlign = TextAlign.Center)

            Spacer(modifier = Modifier.height(32.dp))
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email Address") },
                modifier = Modifier.fillMaxWidth(),
                enabled = !isLoading
            )

            Spacer(modifier = Modifier.height(32.dp))
            Button(
                onClick = {
                    if (email.isBlank()) {
                        Toast.makeText(context, "Please enter your email", Toast.LENGTH_SHORT).show()
                        return@Button
                    }

                    isLoading = true
                    coroutineScope.launch {
                        try {
                            val request = ForgotPasswordRequest(email = email.trim())
                            val response = NetworkClient.authService.forgotPassword(request)

                            isLoading = false
                            if (response.isSuccessful && response.body()?.success == true) {
                                Toast.makeText(context, "OTP code dispatched!", Toast.LENGTH_SHORT).show()
                                currentStep = 2
                            } else {
                                val errorMsg = response.body()?.message ?: "No account matches this email"
                                Toast.makeText(context, errorMsg, Toast.LENGTH_LONG).show()
                            }
                        } catch (e: Exception) {
                            isLoading = false
                            Toast.makeText(context, "Network Error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                enabled = !isLoading
            ) {
                if (isLoading) CircularProgressIndicator(color = MaterialTheme.colorScheme.onPrimary, modifier = Modifier.size(24.dp))
                else Text("Send OTP")
            }
        }
        if (currentStep == 2) {
            Text("Verify Code", style = MaterialTheme.typography.headlineLarge)
            Spacer(modifier = Modifier.height(8.dp))
            Text("Type the 6-digit verification code sent to:\n$email", textAlign = TextAlign.Center)

            Spacer(modifier = Modifier.height(32.dp))

            Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxWidth()) {
                BasicTextField(
                    value = otpCode,
                    onValueChange = {
                        if (it.length <= maxOtpLength && it.all { c -> c.isDigit() }) otpCode = it
                    },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth().alpha(0.01f),
                    enabled = !isLoading
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally)) {
                    repeat(maxOtpLength) { index ->
                        val char = if (index < otpCode.length) otpCode[index].toString() else ""
                        val isFocused = index == otpCode.length
                        Box(
                            modifier = Modifier
                                .size(45.dp)
                                .background(Color.White, RoundedCornerShape(8.dp))
                                .border(
                                    width = if (isFocused) 2.dp else 1.dp,
                                    color = if (isFocused) MaterialTheme.colorScheme.primary else Color.LightGray,
                                    shape = RoundedCornerShape(8.dp)
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = char, style = MaterialTheme.typography.titleLarge)
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
                            if (response.isSuccessful) {
                                Toast.makeText(context, "A fresh verification code was sent!", Toast.LENGTH_SHORT).show()
                            } else {
                                Toast.makeText(context, "Failed to resend. Try again shortly.", Toast.LENGTH_SHORT).show()
                            }
                        } catch (e: Exception) {
                            isLoading = false
                            Toast.makeText(context, "Network Error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                        }
                    }
                },
                enabled = !isLoading
            ) {
                Text("Didn't receive the code? Resend OTP", style = MaterialTheme.typography.bodyMedium)
            }

            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = {
                    if (otpCode.length < maxOtpLength) {
                        Toast.makeText(context, "Please enter the complete 6-digit code", Toast.LENGTH_SHORT).show()
                        return@Button
                    }

                    isLoading = true
                    coroutineScope.launch {
                        try {
                            val request = VerifyForgotPasswordOtpRequest(email = email, otp = otpCode)
                            val response = NetworkClient.authService.verifyForgotPasswordOtp(request)

                            isLoading = false
                            if (response.isSuccessful && response.body()?.success == true) {
                                Toast.makeText(context, "Code verified successfully!", Toast.LENGTH_SHORT).show()
                                currentStep = 3
                            } else {
                                val errorMsg = response.body()?.message ?: "Invalid or expired OTP code"
                                Toast.makeText(context, errorMsg, Toast.LENGTH_LONG).show()
                            }
                        } catch (e: Exception) {
                            isLoading = false
                            Toast.makeText(context, "Network Error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                enabled = !isLoading
            ) {
                if (isLoading) CircularProgressIndicator(color = MaterialTheme.colorScheme.onPrimary, modifier = Modifier.size(24.dp))
                else Text("Verify Code")
            }
        }
        if (currentStep == 3) {
            Text("New Credentials", style = MaterialTheme.typography.headlineLarge)
            Spacer(modifier = Modifier.height(8.dp))
            Text("Establish a strong security password configuration layout.", textAlign = TextAlign.Center)

            Spacer(modifier = Modifier.height(32.dp))
            OutlinedTextField(
                value = newPassword,
                onValueChange = { newPassword = it },
                label = { Text("New Password") },
                visualTransformation = PasswordVisualTransformation(),
                modifier = Modifier.fillMaxWidth(),
                enabled = !isLoading
            )
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = confirmPassword,
                onValueChange = { confirmPassword = it },
                label = { Text("Confirm Password") },
                visualTransformation = PasswordVisualTransformation(),
                modifier = Modifier.fillMaxWidth(),
                enabled = !isLoading
            )

            Spacer(modifier = Modifier.height(32.dp))
            Button(
                onClick = {
                    if (newPassword.isBlank() || confirmPassword.isBlank()) {
                        Toast.makeText(context, "Fields cannot be empty", Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    if (newPassword != confirmPassword) {
                        Toast.makeText(context, "Passwords do not match!", Toast.LENGTH_SHORT).show()
                        return@Button
                    }

                    isLoading = true
                    coroutineScope.launch {
                        try {
                            val request = ResetPasswordRequest(
                                email = email,
                                newPassword = newPassword,
                                confirmPassword = confirmPassword
                            )
                            val response = NetworkClient.authService.resetPassword(request)

                            isLoading = false
                            if (response.isSuccessful && response.body()?.success == true) {
                                Toast.makeText(context, "Password updated successfully!", Toast.LENGTH_LONG).show()
                                onNavigateBackToLogin()
                            } else {
                                val errorMsg = response.body()?.message ?: "Failed to update password"
                                Toast.makeText(context, errorMsg, Toast.LENGTH_LONG).show()
                            }
                        } catch (e: Exception) {
                            isLoading = false
                            Toast.makeText(context, "Network Error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                enabled = !isLoading
            ) {
                if (isLoading) CircularProgressIndicator(color = MaterialTheme.colorScheme.onPrimary, modifier = Modifier.size(24.dp))
                else Text("Update Password")
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
        TextButton(onClick = onNavigateBackToLogin, enabled = !isLoading) {
            Text("Back to Login")
        }
    }
}