package com.example.bookmyvenue.ui_layout

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.example.bookmyvenue.R
import com.example.bookmyvenue.data.LoginRequest
import com.example.bookmyvenue.data.NetworkClient
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(
    onNavigateToRegister: () -> Unit,
    onNavigateToForgotPassword: () -> Unit,
    onLoginSuccess: (String) -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Image(
            painter = painterResource(id = R.drawable.bookmyvenue),
            contentDescription = "App Logo",
            modifier = Modifier
                .size(120.dp)
                .padding(bottom = 16.dp)
        )
        Text("Welcome Back", style = MaterialTheme.typography.headlineLarge)

        Spacer(modifier = Modifier.height(32.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Enter Email") },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Enter Password") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading
        )

        Spacer(modifier = Modifier.height(8.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End
        ) {
            TextButton(
                onClick = {
                    onNavigateToForgotPassword()
                },
                contentPadding = PaddingValues(0.dp),
                enabled = !isLoading
            ) {
                Text(
                    text = "Forgot Password?",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                if (email.isBlank() || password.isBlank()) {
                    Toast.makeText(context, "Please fill out all fields", Toast.LENGTH_SHORT).show()
                    return@Button
                }

                isLoading = true
                coroutineScope.launch {
                    try {
                        val request = LoginRequest(email = email, password = password)
                        val response = NetworkClient.authService.loginUser(request)

                        isLoading = false
                        if (response.isSuccessful && response.body()?.success == true) {
                            Toast.makeText(context, "Login Success!", Toast.LENGTH_SHORT).show()
                            val userRole = response.body()?.data?.user?.role ?: "USER"
                            onLoginSuccess(userRole)
                        } else {
                            val errorMsg = response.body()?.message ?: "Invalid Credentials"
                            Toast.makeText(context, errorMsg, Toast.LENGTH_LONG).show()
                        }
                    } catch (e: Exception) {
                        isLoading = false
                        Toast.makeText(context, "Network Error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                    }
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp),
            enabled = !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    color = MaterialTheme.colorScheme.onPrimary,
                    modifier = Modifier.size(24.dp)
                )
            } else {
                Text("Login")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
        TextButton(onClick = onNavigateToRegister, enabled = !isLoading) {
            Text("Don't have an account? Register")
        }
    }
}