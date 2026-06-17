package com.example.bookmyvenue.ui_layout

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument

@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val navController = rememberNavController()

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
            LoginScreen(
                onNavigateToRegister = { navController.navigate("register") },
                onNavigateToForgotPassword = { navController.navigate("forgot_password") },
                onLoginSuccess = { role ->
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
    }
}