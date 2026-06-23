package com.example.bookmyvenue.ui_layout
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.bookmyvenue.data.LoginUiState
import com.example.bookmyvenue.data.LoginViewModel

@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val navController = rememberNavController()
    val loginViewModel: LoginViewModel = viewModel()
    val uiState = loginViewModel.uiState

    NavHost(
        navController = navController,
        startDestination = "register",
        modifier = modifier
    ) {
        composable("register") {
            RegisterScreen(
                onNavigateToLogin = { navController.navigate("login") },
                onNavigateToOtp = { userEmail ->
                    navController.navigate("otp/$userEmail")
                }
            )
        }

        composable(
            route = "otp/{email}",
            arguments = listOf(navArgument("email") { type = NavType.StringType })
        ) { backStackEntry ->
            val emailArg = backStackEntry.arguments?.getString("email") ?: ""
            OtpScreen(
                email = emailArg,
                onVerificationSuccess = {
                    navController.navigate("login") {
                        popUpTo("register") { inclusive = true }
                    }
                }
            )
        }

        composable("login") {
            LaunchedEffect(uiState) {
                if (uiState is LoginUiState.Success) {
                    val targetDestination = if (uiState.role == "OWNER") "owner_dashboard" else "user_dashboard"
                    navController.navigate(targetDestination) {
                        popUpTo("login") { inclusive = true }
                    }
                    loginViewModel.resetState()
                }
            }
            LoginScreen(
                uiState = uiState,
                onNavigateToRegister = { navController.navigate("register") },
                onNavigateToForgotPassword = { navController.navigate("forgot_password") },
                onLoginClick = { email, password ->
                    loginViewModel.login(email, password)
                }
            )
        }
        composable("forgot_password") {
            ForgotPasswordScreen(
                onNavigateBackToLogin = {
                    navController.navigate("login") {
                        popUpTo("forgot_password") { inclusive = true }
                    }
                }
            )
        }

        composable("user_dashboard") {
            UserDashboardScreen()
        }

        composable("owner_dashboard") {
            OwnerDashboardScreen()
        }
    }
}