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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.bookmyvenue.data.AdminDashboardViewModel
import com.example.bookmyvenue.data.AdminUiState
import com.example.bookmyvenue.data.BookingViewModel
import com.example.bookmyvenue.data.DashboardUiState
import com.example.bookmyvenue.data.DashboardViewModel
import com.example.bookmyvenue.data.LoginViewModel
import com.example.bookmyvenue.data.OwnerDashboardViewModel
import com.example.bookmyvenue.data.OwnerUiState
import com.example.bookmyvenue.data.RazorpayOrderDto
import com.example.bookmyvenue.data.UserBookingsUiState

@Composable
fun AppNavigation(
    bookingViewModel: BookingViewModel,
    onLaunchPayment: (RazorpayOrderDto) -> Unit,
    modifier: Modifier = Modifier
) {
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
                                popUpTo(0) { inclusive = true }
                                launchSingleTop = true
                            }
                        }
                        state.isLoggedIn && state.role == "OWNER" -> {
                            bookingViewModel.fetchOwnerOverview()
                            navController.navigate("owner_dashboard") {
                                popUpTo(0) { inclusive = true }
                                launchSingleTop = true
                            }
                        }
                        else -> {
                            if (state.isLoggedIn) {
                                bookingViewModel.fetchUserBookings()
                            }
                            navController.navigate("user_dashboard") {
                                popUpTo(0) { inclusive = true }
                                launchSingleTop = true
                            }
                        }
                    }
                } else if (dashboardViewModel.dashboardState is DashboardUiState.Error) {
                    navController.navigate("user_dashboard") {
                        popUpTo(0) { inclusive = true }
                        launchSingleTop = true
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
                            popUpTo(0) { inclusive = true }
                            launchSingleTop = true
                        }
                    } else if (state.role == "OWNER") {
                        navController.navigate("owner_dashboard") {
                            popUpTo(0) { inclusive = true }
                            launchSingleTop = true
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
                        onMyBookingsClick = {
                            navController.navigate("my_bookings")
                        },
                        onProfileClick = {
                            navController.navigate("user_profile")
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

        composable(route = "user_profile") {
            val state = dashboardViewModel.dashboardState
            val currentUserName = (state as? DashboardUiState.Success)?.userName ?: "Customer"
            val currentLoginState = (state as? DashboardUiState.Success)?.isLoggedIn ?: false
            val currentUserEmail = (state as? DashboardUiState.Success)?.userEmail ?: ""
            val currentUserRole = (state as? DashboardUiState.Success)?.role ?: "USER"

            LaunchedEffect(Unit) {
                if (currentLoginState && currentUserRole == "USER") {
                    bookingViewModel.fetchUserBookings()
                }
            }

            val bookingsState = bookingViewModel.userBookingsState.collectAsStateWithLifecycle().value

            when (bookingsState) {
                is UserBookingsUiState.Loading -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = Color(0xFFE51E26))
                    }
                }
                is UserBookingsUiState.Success -> {
                    val confirmedBookings = bookingsState.bookings.filter {
                        it.status.equals("CONFIRMED", ignoreCase = true)
                    }
                    val dynamicBookingsCount = confirmedBookings.size
                    val dynamicTotalSpent = confirmedBookings.sumOf { it.totalPrice ?: 0.0 }

                    ExpandedProfileLayout(
                        isLoggedIn = currentLoginState,
                        userName = currentUserName,
                        userEmail = currentUserEmail,
                        role = currentUserRole,
                        statCountOne = dynamicBookingsCount,
                        statAmountTwo = dynamicTotalSpent,
                        onBackClick = {
                            navController.popBackStack()
                        },
                        onLogoutClick = {
                            dashboardViewModel.resetToGuestState()
                            dashboardViewModel.clearSession()
                            loginViewModel.resetState()
                            navController.navigate("user_dashboard") {
                                popUpTo(0) { inclusive = true }
                                launchSingleTop = true
                            }
                        },
                        onNavigateToLogin = {
                            navController.navigate("login")
                        },
                        onMyBookingsClick = {
                            navController.navigate("my_bookings")
                        },
                        onPaymentHistoryClick = {
                            navController.navigate("payment_history")
                        }
                    )
                }
                is UserBookingsUiState.Error -> {
                    ExpandedProfileLayout(
                        isLoggedIn = currentLoginState,
                        userName = currentUserName,
                        userEmail = currentUserEmail,
                        role = currentUserRole,
                        statCountOne = 0,
                        statAmountTwo = 0.0,
                        onBackClick = {
                            navController.popBackStack()
                        },
                        onLogoutClick = {
                            dashboardViewModel.resetToGuestState()
                            dashboardViewModel.clearSession()
                            loginViewModel.resetState()
                            navController.navigate("user_dashboard") {
                                popUpTo(0) { inclusive = true }
                                launchSingleTop = true
                            }
                        },
                        onNavigateToLogin = {
                            navController.navigate("login")
                        },
                        onMyBookingsClick = {
                            navController.navigate("my_bookings")
                        },
                        onPaymentHistoryClick = {
                            navController.navigate("payment_history")
                        }
                    )
                }
            }
        }

        composable(route = "my_bookings") {
            MyBookingsScreen(
                bookingViewModel = bookingViewModel,
                onBackClick = { navController.popBackStack() }
            )
        }

        composable(route = "payment_history") {
            PaymentHistoryScreen(
                bookingViewModel = bookingViewModel,
                onBackClick = { navController.popBackStack() }
            )
        }

        composable(route = "venue_detail/{venueId}") { backStackEntry ->
            val venueId = backStackEntry.arguments?.getString("venueId") ?: ""
            val state = dashboardViewModel.dashboardState

            if (state is DashboardUiState.Success) {
                val matchedVenue = state.venues.find { it.id == venueId }
                if (matchedVenue != null) {
                    VenueDetailScreen(
                        venueId = matchedVenue.id,
                        venueName = matchedVenue.name,
                        categoryName = matchedVenue.category.name,
                        pricePerHour = matchedVenue.pricePerHour,
                        location = matchedVenue.location,
                        description = matchedVenue.description ?: "",
                        imageUrls = matchedVenue.imageUrls,
                        amenities = matchedVenue.amenities ?: emptyList(),
                        bookingViewModel = bookingViewModel,
                        onBackClick = { navController.popBackStack() },
                        onNavigateToCheckout = onLaunchPayment
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
                onNavigateToRegister = {
                    navController.navigate("register") {
                        popUpTo("login") { inclusive = true }
                    }
                },
                onNavigateToForgotPassword = { navController.navigate("forgot_password") },
                onLoginSuccess = { role ->
                    dashboardViewModel.fetchDashboardData()
                    if (role == "OWNER") {
                        bookingViewModel.fetchOwnerOverview()
                    } else if (role == "USER") {
                        bookingViewModel.fetchUserBookings()
                    }
                    when (role) {
                        "ADMIN" -> {
                            navController.navigate("admin_dashboard") {
                                popUpTo(0) { inclusive = true }
                                launchSingleTop = true
                            }
                        }
                        "OWNER" -> {
                            navController.navigate("owner_dashboard") {
                                popUpTo(0) { inclusive = true }
                                launchSingleTop = true
                            }
                        }
                        else -> {
                            navController.navigate("user_dashboard") {
                                popUpTo(0) { inclusive = true }
                                launchSingleTop = true
                            }
                        }
                    }
                }
            )
        }

        composable(route = "register") {
            RegisterScreen(
                onNavigateToLogin = {
                    navController.navigate("login") {
                        popUpTo("register") { inclusive = true }
                    }
                },
                onNavigateToOtp = { email ->
                    navController.navigate("otp/$email") {
                        popUpTo("register") { inclusive = true }
                    }
                }
            )
        }

        composable(route = "otp/{email}") { backStackEntry ->
            val email = backStackEntry.arguments?.getString("email") ?: ""
            OtpScreen(
                email = email,
                onVerificationSuccess = {
                    navController.navigate("login") {
                        popUpTo(0) { inclusive = true }
                        launchSingleTop = true
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
                bookingViewModel = bookingViewModel,
                onToggleListing = { venueId, currentStatus ->
                    ownerViewModel.toggleVenueListing(venueId, currentStatus)
                },
                onVenueClick = { venueId ->
                    navController.navigate("owner_venue_detail/$venueId")
                },
                onLogoutClick = {
                    dashboardViewModel.resetToGuestState()
                    dashboardViewModel.clearSession()
                    loginViewModel.resetState()
                    navController.navigate("user_dashboard") {
                        popUpTo(0) { inclusive = true }
                        launchSingleTop = true
                    }
                }
            )
        }

        composable(route = "owner_venue_detail/{venueId}") { backStackEntry ->
            val venueId = backStackEntry.arguments?.getString("venueId") ?: ""
            val ownerViewModel: OwnerDashboardViewModel = viewModel(
                factory = ViewModelProvider.AndroidViewModelFactory.getInstance(context.applicationContext as Application)
            )

            var showSlotDialog by remember { mutableStateOf(false) }

            LaunchedEffect(venueId) {
                if (ownerViewModel.ownerUiState !is OwnerUiState.Success) {
                    ownerViewModel.fetchOwnerDashboardData()
                }
            }

            val state = ownerViewModel.ownerUiState
            if (state is OwnerUiState.Success) {
                val matchedVenue = state.rawVenues.find { it.id == venueId }
                if (matchedVenue != null) {
                    OwnerVenueDetailScreen(
                        venue = matchedVenue,
                        viewModel = ownerViewModel,
                        onBackClick = { navController.popBackStack() },
                        onManageSlotsClick = { id ->
                            showSlotDialog = true
                        },
                        onUpdateVenueClick = { id, price, capacity, description, amenities, images ->
                            ownerViewModel.updateOwnerVenueDetails(
                                venueId = id,
                                pricePerHour = price,
                                capacity = capacity,
                                description = description,
                                amenities = amenities,
                                imageUrls = images
                            )
                        }
                    )

                    if (showSlotDialog) {
                        OwnerSlotsManagementDialog(
                            venue = OwnerVenueItem(
                                id = matchedVenue.id,
                                name = matchedVenue.name,
                                location = matchedVenue.location,
                                pricePerHour = matchedVenue.pricePerHour,
                                category = matchedVenue.category.name,
                                status = matchedVenue.moderationStatus,
                                rejectReason = matchedVenue.rejectReason,
                                isListed = matchedVenue.isListed
                            ),
                            viewModel = ownerViewModel,
                            brandRed = Color(0xFFE51E26),
                            brandDarkText = Color(0xFF1A1A1A),
                            onDismiss = { showSlotDialog = false }
                        )
                    }
                } else {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("Venue details could not be found.")
                    }
                }
            } else {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Color(0xFFE51E26))
                }
            }
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
                        adminName = state.userName,
                        adminEmail = state.userEmail,
                        pendingVenuesList = state.pendingVenues,
                        allVenuesList = state.allVenues,
                        categoriesList = state.categories,
                        allBookingsList = state.allBookings,
                        totalRevenue = state.totalRevenue,
                        totalBookingsCount = state.totalBookingsCount,
                        onApproveVenue = { venueId -> adminViewModel.approveVenue(venueId) },
                        onRejectVenue = { venueId, reason -> adminViewModel.rejectVenue(venueId, reason) },
                        onCreateCategory = { name, description -> adminViewModel.createCategory(name, description) },
                        onVenueClick = { venueId ->
                            navController.navigate("admin_venue_verify/$venueId")
                        },
                        onLogoutClick = {
                            dashboardViewModel.resetToGuestState()
                            dashboardViewModel.clearSession()
                            loginViewModel.resetState()
                            navController.navigate("user_dashboard") {
                                popUpTo(0) { inclusive = true }
                                launchSingleTop = true
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

        composable(route = "admin_venue_verify/{venueId}") { backStackEntry ->
            val venueId = backStackEntry.arguments?.getString("venueId") ?: ""
            val adminViewModel: AdminDashboardViewModel = viewModel(
                factory = ViewModelProvider.AndroidViewModelFactory.getInstance(context.applicationContext as Application)
            )

            LaunchedEffect(Unit) {
                adminViewModel.fetchAdminDashboardData()
            }

            val state = adminViewModel.adminUiState

            if (state is AdminUiState.Success) {
                val matchedVenue = state.pendingVenues.find { it.id == venueId }
                    ?: state.allVenues.find { it.id == venueId }

                if (matchedVenue != null) {
                    AdminVenueDetailScreen(
                        venue = matchedVenue,
                        onApprove = { id -> adminViewModel.approveVenue(id) },
                        onReject = { id, reason -> adminViewModel.rejectVenue(id, reason) },
                        onBackClick = {
                            adminViewModel.fetchAdminDashboardData()
                            navController.popBackStack()
                        }
                    )
                } else {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("Property data verification sequence corrupted.")
                    }
                }
            } else {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Color(0xFFE51E26))
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