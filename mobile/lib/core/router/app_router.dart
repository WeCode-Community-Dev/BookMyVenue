import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../feature/auth/presentation/bloc/auth_bloc.dart';
import '../../feature/auth/presentation/pages/user_login/signin_page.dart';
import '../../feature/auth/presentation/pages/venue_owner_account_creation/venue_owner_business_profile_setup.dart';
import '../../feature/auth/presentation/pages/venue_owner_account_creation/venue_owner_signup_page.dart';
import '../../feature/home/presentation/pages/home_page.dart';
import '../../feature/owner_verification_page/presentation/pages/owner_verification_page.dart';
import '../auth/auth_session.dart';
import '../di/injection.dart';
import 'route_name.dart';

class AppRouter {
  // Global key for navigation without context
  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  static final GoRouter router = GoRouter(
    // initialLocation: '/login',
    initialLocation: AppRouteNames.ownerVerification,
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
            BlocProvider<AuthBloc>(
              create: (BuildContext context) => sl<AuthBloc>(),
              child: const VenueOwnerSignupPage(),
            ),
      ),
      GoRoute(
        path: '/${AppRouteNames.ownerBusinessProfile}',
        name: AppRouteNames.ownerBusinessProfile,
        builder: (BuildContext context, GoRouterState state) =>
            BlocProvider<AuthBloc>(
              create: (BuildContext context) => sl<AuthBloc>(),
              child: const VenueOwnerBusinessProfileSetup(),
            ),
      ),
      GoRoute(
        path: '/${AppRouteNames.home}',
        name: AppRouteNames.home,
        builder: (BuildContext context, GoRouterState state) {
          final String role = state.extra! as String;
          return HomePage(role: role);
        },
      ),
      GoRoute(
        path: '/${AppRouteNames.ownerVerification}',
        name: AppRouteNames.ownerVerification,
        builder: (BuildContext context, GoRouterState state) {
          return OwnerVerificationPage();
        },
      ),
      // GoRoute(
      //   path: '/signup2',
      //   name: AppRouteNames.signup2,
      //   builder: (BuildContext context, GoRouterState state) =>
      //       const SignUpPage1(),
      // ),
      // GoRoute(
      //   path: '/signup3',
      //   name: AppRouteNames.signup3,
      //   builder: (BuildContext context, GoRouterState state) =>
      //       const SignUpPage1(),
      // ),

      // StatefulShellRoute.indexedStack(
      //   builder:
      //       (
      //         BuildContext context,
      //         GoRouterState state,
      //         StatefulNavigationShell navigationShell,
      //       ) {
      //         // This is the wrapper that contains the BottomNavBar
      //         return MainScreen(navigationShell: navigationShell);
      //       },
      //   branches: <StatefulShellBranch>[
      //     StatefulShellBranch(
      //       routes: <RouteBase>[
      //         GoRoute(
      //           path: '/home',
      //           name: AppRouteNames.dashboard,
      //           builder: (BuildContext context, GoRouterState state) =>
      //               const DashboardPage(),
      //         ),
      //       ],
      //     ),
      //     StatefulShellBranch(
      //       routes: <RouteBase>[
      //         GoRoute(
      //           path: '/sessions',
      //           name: AppRouteNames.session,
      //           builder: (BuildContext context, GoRouterState state) =>
      //               const SessionsPage(),
      //         ),
      //       ],
      //     ),
      //     StatefulShellBranch(
      //       routes: <RouteBase>[
      //         GoRoute(
      //           path: '/subject',
      //           name: AppRouteNames.subject,
      //           builder: (BuildContext context, GoRouterState state) =>
      //               BlocProvider<SubjectBloc>(
      //                 create: (BuildContext context) => sl<SubjectBloc>(),
      //                 child: const SubjectsPage(),
      //               ),
      //         ),
      //       ],
      //     ),
      //     StatefulShellBranch(
      //       routes: <RouteBase>[
      //         GoRoute(
      //           path: '/analytics',
      //           name: AppRouteNames.analytics,
      //           builder: (BuildContext context, GoRouterState state) =>
      //               const AnalyticsPage(),
      //         ),
      //       ],
      //     ),
      //     StatefulShellBranch(
      //       routes: <RouteBase>[
      //         GoRoute(
      //           path: '/profile',
      //           name: AppRouteNames.profile,
      //           builder: (BuildContext context, GoRouterState state) =>
      //               const ProfilePage(),
      //         ),
      //       ],
      //     ),
      //   ],
      // ),
      // GoRoute(
      //   path: '/setup-session',
      //   name: AppRouteNames.setupSession,
      //   builder: (BuildContext context, GoRouterState state) =>
      //       const SetupSessionPage(),
      // ),
      // GoRoute(
      //   path: '/live-session',
      //   name: AppRouteNames.liveSession,
      //   builder: (BuildContext context, GoRouterState state) =>
      //       const LiveSessionPage(),
      // ),
      // GoRoute(
      //   path: '/help-support',
      //   name: AppRouteNames.helpSupport,
      //   builder: (BuildContext context, GoRouterState state) =>
      //       const HelpSupport(),
      // ),
      // GoRoute(
      //   path: '/edit-profile',
      //   name: AppRouteNames.editProfile,
      //   builder: (BuildContext context, GoRouterState state) =>
      //       const EditProfilePage(),
      // ),
    ],

    // Error page for unknown routes (Production standard)
    errorBuilder: (BuildContext context, GoRouterState state) => Scaffold(
      body: Center(child: Text('No route defined for ${state.uri}')),
    ),

    // --- Auth Guard (Redirection) ---
    // This is where you will check if the user is logged in
    // redirect: (BuildContext context, GoRouterState state) {
    //   final bool loggedIn = AuthSession.isLoggedIn;

    //   final bool loggingIn =
    //       state.matchedLocation == '/${AppRouteNames.signin}' ||
    //       state.matchedLocation == '/${AppRouteNames.venueOwnerSignup}' ||
    //       state.matchedLocation == '/${AppRouteNames.ownerBusinessProfile}';

    //   if (!loggedIn && !loggingIn) {
    //     return '/login';
    //   }

    //   if (loggedIn && loggingIn) {
    //     return '/home';
    //   }

    //   return null;
    // },
  );
}
