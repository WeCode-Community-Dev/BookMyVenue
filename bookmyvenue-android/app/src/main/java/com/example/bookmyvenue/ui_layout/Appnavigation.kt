package com.example.bookmyvenue.ui_layout

import android.app.Application
import android.widget.Toast
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.runtime.LaunchedEffect
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.bookmyvenue.data.DashboardUiState
import com.example.bookmyvenue.data.DashboardViewModel
import com.example.bookmyvenue.data.LoginViewModel
import com.example.bookmyvenue.data.OwnerDashboardViewModel
import com.example.bookmyvenue.data.OwnerUiState
import com.example.bookmyvenue.data.AdminDashboardViewModel
import com.example.bookmyvenue.data.AdminUiState

@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val navController = rememberNavController()
    val loginViewModel: LoginViewModel = viewModel()
    val dashboardViewModel: DashboardViewModel = viewModel()
    val context = LocalContext.current

    LaunchedEffect(Unit) {
        dashboardViewModel.fetchDashboardData()
    }

    NavHost(
        navController = navController,
        startDestination = "splash_routing",
        modifier = modifier
    ) {
        composable(route = "splash_routing") {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Color(0xFFE51E26))
            }

            LaunchedEffect(dashboardViewModel.dashboardState) {
                val state = dashboardViewModel.dashboardState
                if (state is DashboardUiState.Success) {
                    when {
                        state.isLoggedIn && state.role == "ADMIN" -> {
                            navController.navigate("admin_dashboard") {
                                popUpTo("splash_routing") { inclusive = true }
                            }
                        }
                        state.isLoggedIn && state.role == "OWNER" -> {
                            navController.navigate("owner_dashboard") {
                                popUpTo("splash_routing") { inclusive = true }
                            }
                        }
                        else -> {
                            navController.navigate("user_dashboard") {
                                popUpTo("splash_routing") { inclusive = true }
                            }
                        }
                    }
                } else if (dashboardViewModel.dashboardState is DashboardUiState.Error) {
                    navController.navigate("user_dashboard") {
                        popUpTo("splash_routing") { inclusive = true }
                    }
                }
            }
        }

        composable(route = "user_dashboard") {
            val state = dashboardViewModel.dashboardState

            LaunchedEffect(state) {
                if (state is DashboardUiState.Success && state.isLoggedIn) {
                    if (state.role == "ADMIN") {
                        navController.navigate("admin_dashboard") {
                            popUpTo("user_dashboard") { inclusive = true }
                        }
                    } else if (state.role == "OWNER") {
                        navController.navigate("owner_dashboard") {
                            popUpTo("user_dashboard") { inclusive = true }
                        }
                    }
                }
            }

            when (state) {
                is DashboardUiState.Loading -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = Color(0xFFE51E26))
                    }
                }
                is DashboardUiState.Success -> {
                    UserDashboardScreen(
                        venuesList = state.venues,
                        categoriesList = state.categories,
                        isLoggedIn = state.isLoggedIn,
                        userName = state.userName,
                        onVenueClick = { venue ->
                            if (!state.isLoggedIn) {
                                Toast.makeText(context, "Please login first to book ${venue.name}!", Toast.LENGTH_SHORT).show()
                                navController.navigate("login")
                            } else {
                                navController.navigate("venue_detail/${venue.id}")
                            }
                        },
                        onLogoutClick = {
                            dashboardViewModel.resetToGuestState()
                            dashboardViewModel.clearSession()
                            loginViewModel.resetState()
                            Toast.makeText(context, "Logged out successfully", Toast.LENGTH_SHORT).show()
                        },
                        onNavigateToLogin = {
                            navController.navigate(route = "login")
                        }
                    )
                }
                is DashboardUiState.Error -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text(text = state.message)
                    }
                }
            }
        }

        composable(route = "venue_detail/{venueId}") { backStackEntry ->
            val venueId = backStackEntry.arguments?.getString("venueId") ?: ""
            val state = dashboardViewModel.dashboardState

            if (state is DashboardUiState.Success) {
                val matchedVenue = state.venues.find { it.id == venueId }
                if (matchedVenue != null) {
                    VenueDetailScreen(
                        venueName = matchedVenue.name,
                        categoryName = matchedVenue.category.name,
                        pricePerHour = matchedVenue.pricePerHour,
                        location = matchedVenue.location,
                        description = matchedVenue.description ?: "",
                        imageUrls = matchedVenue.imageUrls,
                        amenities = matchedVenue.amenities ?: emptyList(),
                        onBackClick = { navController.popBackStack() },
                        onBookNowClick = {
                            Toast.makeText(context, "Slots feature coming next!", Toast.LENGTH_SHORT).show()
                        }
                    )
                } else {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("Venue data could not be recovered.")
                    }
                }
            } else {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Color(0xFFE51E26))
                }
            }
        }

        composable(route = "login") {
            LoginScreen(
                uiState = loginViewModel.uiState,
                onLoginClick = { email, password ->
                    loginViewModel.login(email, password)
                },
                onNavigateToRegister = { navController.navigate("register") },
                onNavigateToForgotPassword = { navController.navigate("forgot_password") },
                onLoginSuccess = { role ->
                    dashboardViewModel.fetchDashboardData()
                    when (role) {
                        "ADMIN" -> {
                            navController.navigate("admin_dashboard") {
                                popUpTo("user_dashboard") { inclusive = true }
                            }
                        }
                        "OWNER" -> {
                            navController.navigate("owner_dashboard") {
                                popUpTo("user_dashboard") { inclusive = true }
                            }
                        }
                        else -> {
                            navController.navigate("user_dashboard") {
                                popUpTo("login") { inclusive = true }
                            }
                        }
                    }
                }
            )
        }

        composable(route = "register") {
            RegisterScreen(
                onNavigateToLogin = { navController.navigate("login") },
                onNavigateToOtp = { email -> navController.navigate("otp/$email") }
            )
        }

        composable(route = "otp/{email}") { backStackEntry ->
            val email = backStackEntry.arguments?.getString("email") ?: ""
            OtpScreen(
                email = email,
                onVerificationSuccess = {
                    navController.navigate("login") {
                        popUpTo("register") { inclusive = true }
                    }
                }
            )
        }

        composable(route = "owner_dashboard") {
            val ownerViewModel: OwnerDashboardViewModel = viewModel(
                factory = ViewModelProvider.AndroidViewModelFactory.getInstance(context.applicationContext as Application)
            )

            LaunchedEffect(Unit) {
                ownerViewModel.fetchOwnerDashboardData()
            }

            OwnerDashboardScreen(
                viewModel = ownerViewModel,
                onToggleListing = { venueId, currentStatus ->
                    ownerViewModel.toggleVenueListing(venueId, currentStatus)
                },
                onLogoutClick = {
                    dashboardViewModel.resetToGuestState()
                    dashboardViewModel.clearSession()
                    loginViewModel.resetState()
                    navController.navigate("user_dashboard") {
                        popUpTo("owner_dashboard") { inclusive = true }
                    }
                }
            )
        }

        composable(route = "admin_dashboard") {
            val adminViewModel: AdminDashboardViewModel = viewModel(
                factory = ViewModelProvider.AndroidViewModelFactory.getInstance(context.applicationContext as Application)
            )

            LaunchedEffect(Unit) {
                adminViewModel.fetchAdminDashboardData()
            }

            when (val state = adminViewModel.adminUiState) {
                is AdminUiState.Loading -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = Color(0xFFE51E26))
                    }
                }
                is AdminUiState.Success -> {
                    AdminDashboardScreen(
                        adminName = "Admin System",
                        pendingVenuesList = state.pendingVenues,
                        allVenuesList = state.allVenues,
                        categoriesList = state.categories,
                        onApproveVenue = { venueId -> adminViewModel.approveVenue(venueId) },
                        onRejectVenue = { venueId, reason -> adminViewModel.rejectVenue(venueId, reason) },
                        onCreateCategory = { name, description -> adminViewModel.createCategory(name, description) },
                        onLogoutClick = {
                            dashboardViewModel.resetToGuestState()
                            dashboardViewModel.clearSession()
                            loginViewModel.resetState()
                            navController.navigate("user_dashboard") {
                                popUpTo("admin_dashboard") { inclusive = true }
                            }
                        }
                    )
                }
                is AdminUiState.Error -> {
                    Box(
                        modifier = Modifier.fillMaxSize().padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("⚠️", fontSize = 40.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(state.message, textAlign = TextAlign.Center, color = Color.Gray)
                            Spacer(modifier = Modifier.height(16.dp))
                            Button(
                                onClick = { adminViewModel.fetchAdminDashboardData() },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE51E26))
                            ) {
                                Text("Retry", color = Color.White)
                            }
                        }
                    }
                }
            }
        }

        composable(route = "forgot_password") {
            ForgotPasswordScreen(
                onNavigateBackToLogin = {
                    navController.navigate("login") {
                        popUpTo("forgot_password") { inclusive = true }
                    }
                }
            )
        }
    }
}