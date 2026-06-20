import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../feature/add_new_venue/presentation/pages/add_new_venue_page.dart';
import '../../feature/auth/domain/enums/approval_status.dart';
import '../../feature/auth/domain/enums/role_base.dart';
import '../../feature/auth/presentation/bloc/owner/owner_auth_bloc.dart';
import '../../feature/auth/presentation/bloc/user/auth_bloc.dart';
import '../../feature/auth/presentation/pages/user_login/signin_page.dart';
import '../../feature/auth/presentation/pages/venue_owner_account_creation/venue_owner_signup_page.dart';
import '../../feature/auth/presentation/pages/venue_owner_account_creation/verify_otp_page.dart';
import '../../feature/bottom_nav_bar/venue_owner_bottom_nav/venue_owner_bottom_navigation_bar.dart';
import '../../feature/owner_dashboard_page/presentation/pages/owner_dashboard_page.dart';
import '../../feature/owner_payout_history/presentation/pages/owner_payout_details.dart';
import '../../feature/owner_payout_history/presentation/pages/owner_payout_history_page.dart';
import '../../feature/owner_payout_history/presentation/pages/owner_payout_page.dart';
import '../../feature/owner_profile/presentation/pages/owner_profile.dart';
import '../../feature/owner_verification_page/presentation/pages/owner_verification_page.dart';
import '../auth/auth_session.dart';
import '../di/injection.dart';
import 'route_name.dart';

class AppRouter {
  // Global key for navigation without context
  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  static final GoRouter router = GoRouter(
    initialLocation: '/${AppRouteNames.signin}',
    // initialLocation: AppRouteNames.ownerVerification,
    navigatorKey: navigatorKey,
    debugLogDiagnostics: true, // Useful for development
    // --- Deep Linking Configuration ---
    // In the future, you'll set your host here (e.g., app.example.com)
    // For now, it allows path-based URL navigation
    routes: <RouteBase>[
      GoRoute(
        path: '/${AppRouteNames.signin}',
        name: AppRouteNames.signin,
        builder: (BuildContext context, GoRouterState state) =>
            BlocProvider<AuthBloc>(
              create: (BuildContext context) => sl<AuthBloc>(),
              child: const SigninPage(),
            ),
      ),
      GoRoute(
        path: '/${AppRouteNames.venueOwnerSignup}',
        name: AppRouteNames.venueOwnerSignup,
        builder: (BuildContext context, GoRouterState state) =>
            BlocProvider<OwnerAuthBloc>(
              create: (BuildContext context) => sl<OwnerAuthBloc>(),
              child: const VenueOwnerSignupPage(),
            ),
      ),
      GoRoute(
        path: '/${AppRouteNames.venueOwnerVerify}',
        name: AppRouteNames.venueOwnerVerify,
        builder: (BuildContext context, GoRouterState state) {
          final String mobileNumber = state.extra! as String;
          return BlocProvider<OwnerAuthBloc>(
            create: (BuildContext context) => sl<OwnerAuthBloc>(),
            child: OwnerVerifyOtpPage(mobileNumber: mobileNumber),
          );
        },
      ),

      GoRoute(
        path: '/${AppRouteNames.ownerVerification}',
        name: AppRouteNames.ownerVerification,
        builder: (BuildContext context, GoRouterState state) {
          return const OwnerVerificationPage();
        },
      ),

      StatefulShellRoute.indexedStack(
        builder:
            (
              BuildContext context,
              GoRouterState state,
              StatefulNavigationShell navigationShell,
            ) {
              // This is the wrapper that contains the BottomNavBar
              return ResponsiveAppShell(navigationShell: navigationShell);
            },
        branches: <StatefulShellBranch>[
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/${AppRouteNames.ownerDashboard}',
                name: AppRouteNames.ownerDashboard,
                builder: (BuildContext context, GoRouterState state) =>
                    const OwnerDashboardPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/${AppRouteNames.addNewVenue}',
                name: AppRouteNames.addNewVenue,
                builder: (BuildContext context, GoRouterState state) =>
                    const OwnerVenuesListPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/${AppRouteNames.payout}',
                name: AppRouteNames.payout,
                builder: (BuildContext context, GoRouterState state) =>
                    const OwnerPayoutPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/${AppRouteNames.ownerProfile}',
                name: AppRouteNames.ownerProfile,
                builder: (BuildContext context, GoRouterState state) =>
                    const OwnerProfileSettingsScreen(),
              ),
            ],
          ),
        ],
      ),
      GoRoute(
        path: '/${AppRouteNames.payoutHistory}',
        name: AppRouteNames.payoutHistory,
        builder: (BuildContext context, GoRouterState state) {
          return const OwnerPayoutHistoryPage();
        },
      ),
      GoRoute(
        path: '/${AppRouteNames.payoutOutDetails}',
        name: AppRouteNames.payoutOutDetails,
        builder: (BuildContext context, GoRouterState state) {
          return const OwnerPayoutDetails();
        },
      ),
    ],

    // Error page for unknown routes (Production standard)
    errorBuilder: (BuildContext context, GoRouterState state) => Scaffold(
      body: Center(child: Text('No route defined for ${state.uri}')),
    ),

    // --- Auth Guard (Redirection) ---
    // This is where you will check if the user is logged in
    redirect: (BuildContext context, GoRouterState state) {
      final bool loggedIn = AuthSession.isLoggedIn;
      final UserRole? role = AuthSession.role;
      final ApprovalStatus status = AuthSession.ownerVerified;

      final String location = state.matchedLocation;

      final bool authRoutes = <String>[
        '/${AppRouteNames.signin}',
        '/${AppRouteNames.venueOwnerSignup}',
        '/${AppRouteNames.venueOwnerVerify}',
      ].contains(location);

      // Not logged in
      if (!loggedIn) {
        return authRoutes ? null : '/${AppRouteNames.signin}';
      }

      // Owner flow
      if (role == UserRole.venueOwner) {
        final bool approved = status == ApprovalStatus.approved;

        // Pending verification
        if (!approved && location != '/${AppRouteNames.ownerVerification}') {
          return '/${AppRouteNames.ownerVerification}';
        }

        // Approved owner
        if (approved && location == '/${AppRouteNames.ownerVerification}') {
          return '/${AppRouteNames.ownerDashboard}';
        }
      }

      // Logged-in users should never visit auth pages
      if (authRoutes) {
        if (role == UserRole.venueOwner) {
          return status == ApprovalStatus.approved
              ? '/${AppRouteNames.ownerDashboard}'
              : '/${AppRouteNames.ownerVerification}';
        }

        return '/${AppRouteNames.ownerDashboard}';
      }

      return null;
    },
  );
}
