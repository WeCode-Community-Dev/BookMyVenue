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
import com.example.bookmyvenue.data.NetworkClient
import com.example.bookmyvenue.data.RegisterRequest
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(modifier: Modifier = Modifier, onNavigateToLogin: () -> Unit,
                   onNavigateToOtp: (String) -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var selectedRole by remember { mutableStateOf("Select Role") }
    var isDropdownExpanded by remember { mutableStateOf(false) }
    val rolesList = listOf("Select Role","USER","OWNER")

    Column(
        modifier = modifier
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

        Text(
            text = "Create Account",
            style = MaterialTheme.typography.headlineLarge,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Full Name") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email Address") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        Spacer(modifier = Modifier.height(16.dp))
        ExposedDropdownMenuBox(
            expanded = isDropdownExpanded,
            onExpandedChange = { isDropdownExpanded = !isDropdownExpanded },
            modifier = Modifier.fillMaxWidth()
        ) {
            OutlinedTextField(
                value = selectedRole.replace("_", " "),
                onValueChange = {},
                readOnly = true,
                label = { Text("Select Account Type") },
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = isDropdownExpanded) },
                modifier = Modifier.menuAnchor(),
                colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors()
            )

            ExposedDropdownMenu(
                expanded = isDropdownExpanded,
                onDismissRequest = { isDropdownExpanded = false }
            ) {
                rolesList.forEach { role ->
                    DropdownMenuItem(
                        text = { Text(text = role.replace("_", " ")) },
                        onClick = {
                            selectedRole = role
                            isDropdownExpanded = false
                        }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                if (name.isBlank() || email.isBlank() || password.isBlank()) {
                    Toast.makeText(context, "Please fill all fields", Toast.LENGTH_SHORT).show()
                    return@Button
                }

                isLoading = true
                coroutineScope.launch {
                    try {
                        val request = RegisterRequest(
                            name = name,
                            email = email,
                            password = password,
                            role = selectedRole
                        )
                        val response = NetworkClient.authService.registerUser(request)

                        isLoading = false
                        if (response.isSuccessful && response.body()?.success == true) {
                            Toast.makeText(context, "Success! Check email for OTP", Toast.LENGTH_LONG).show()
                            onNavigateToOtp(email)
                        } else {
                            val errorMsg = response.body()?.message ?: "Registration failed"
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
            if (isLoading) {
                CircularProgressIndicator(color = MaterialTheme.colorScheme.onPrimary, modifier = Modifier.size(24.dp))
            } else {
                Text("Register")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
        TextButton(onClick = onNavigateToLogin) {
            Text("Already have an account? Login")
        }
    }
}