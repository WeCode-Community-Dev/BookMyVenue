import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:nested/nested.dart';

import '../../feature/add_new_venue/presentation/bloc/cubit/venue_details_cubit.dart';
import '../../feature/add_new_venue/presentation/bloc/venue_bloc.dart';
import '../../feature/add_new_venue/presentation/pages/add_new_venue_page.dart';
import '../../feature/add_new_venue/presentation/pages/all_venues.dart';
import '../../feature/auth/domain/enums/approval_status.dart';
import '../../feature/auth/domain/enums/role_base.dart';
import '../../feature/auth/presentation/bloc/owner/owner_auth_bloc.dart';
import '../../feature/auth/presentation/bloc/user/auth_bloc.dart';
import '../../feature/auth/presentation/pages/user_login/signin_page.dart';
import '../../feature/auth/presentation/pages/venue_owner_account_creation/owner_verification_page.dart';
import '../../feature/auth/presentation/pages/venue_owner_account_creation/venue_owner_signup_page.dart';
import '../../feature/auth/presentation/pages/venue_owner_account_creation/verify_otp_page.dart';
import '../../feature/booking/domain/entity/booking_entities.dart';
import '../../feature/booking/presentation/bloc/booking_bloc.dart';
import '../../feature/booking/presentation/pages/booking_failure_screen.dart';
import '../../feature/booking/presentation/pages/booking_history_page.dart';
import '../../feature/booking/presentation/pages/booking_success_screen.dart';
import '../../feature/booking/presentation/pages/owner_booking_history_page.dart';
import '../../feature/bottom_nav_bar/user_bottom_nav/user_bottom_navigation_bar.dart';
import '../../feature/bottom_nav_bar/venue_owner_bottom_nav/venue_owner_bottom_navigation_bar.dart';
import '../../feature/owner_dashboard_page/presentation/pages/owner_dashboard_page.dart';
import '../../feature/owner_payout_history/presentation/pages/owner_payout_details.dart';
import '../../feature/owner_payout_history/presentation/pages/owner_payout_history_page.dart';
import '../../feature/owner_payout_history/presentation/pages/owner_payout_page.dart';
import '../../feature/owner_profile/presentation/bloc/owner_profile_bloc.dart';
import '../../feature/owner_profile/presentation/pages/owner_profile.dart';
import '../../feature/user_dashbaord/presentation/pages/user_dashboard.dart';
import '../../feature/user_profile/presentation/bloc/user_profile_bloc.dart';
import '../../feature/user_profile/presentation/pages/user_profile_page.dart';
import '../../feature/user_venue_listing/domain/entity/user_venue_entity.dart';
import '../../feature/user_venue_listing/presentation/bloc/user_venue_bloc.dart';
import '../../feature/user_venue_listing/presentation/pages/venue_details_page.dart';
import '../../feature/user_venue_listing/presentation/pages/venue_list_page.dart';
import '../auth/auth_session.dart';
import '../di/injection.dart';
import 'route_name.dart';

class AppRouter {
  static Route<PageRouteBuilder<dynamic>> createHeroPageRoute(Widget page) {
    return PageRouteBuilder<PageRouteBuilder<dynamic>>(
      pageBuilder:
          (
            BuildContext context,
            Animation<double> animation,
            Animation<double> secondaryAnimation,
          ) => page,
      transitionDuration: const Duration(milliseconds: 550),
      reverseTransitionDuration: const Duration(milliseconds: 550),
      transitionsBuilder:
          (
            BuildContext context,
            Animation<double> animation,
            Animation<double> secondaryAnimation,
            Widget child,
          ) {
            final Animation<double> fadeAnimation = animation.drive(
              Tween<double>(
                begin: 0.0,
                end: 1.0,
              ).chain(CurveTween(curve: Curves.easeInOutCubic)),
            );
            return FadeTransition(opacity: fadeAnimation, child: child);
          },
    );
  }

  // Global key for navigation without context
  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  static final GoRouter router = GoRouter(
    initialLocation: '/${AppRouteNames.signin}',
    // initialLocation: AppRouteNames.userDashboard,
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
          return BlocProvider<OwnerAuthBloc>(
            create: (BuildContext context) => sl<OwnerAuthBloc>(),
            child: const OwnerVerificationPage(),
          );
        },
      ),

      /// Venue owner shell route
      StatefulShellRoute.indexedStack(
        builder:
            (
              BuildContext context,
              GoRouterState state,
              StatefulNavigationShell navigationShell,
            ) {
              // This is the wrapper that contains the BottomNavBar
              return VenueOwnerBottomNavigationBar(
                navigationShell: navigationShell,
              );
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
              ShellRoute(
                builder:
                    (BuildContext context, GoRouterState state, Widget child) {
                      return MultiBlocProvider(
                        providers: <SingleChildWidget>[
                          BlocProvider<VenueDetailsCubit>(
                            create: (BuildContext context) =>
                                VenueDetailsCubit(),
                          ),
                          BlocProvider<VenueBloc>(
                            create: (BuildContext context) => sl<VenueBloc>(),
                          ),
                        ],
                        child: child,
                      );
                    },
                routes: <RouteBase>[
                  GoRoute(
                    path: '/${AppRouteNames.addNewVenue}',
                    name: AppRouteNames.addNewVenue,
                    builder: (BuildContext context, GoRouterState state) {
                      return const AddNewVenuePage();
                    },
                  ),
                  GoRoute(
                    path: '/${AppRouteNames.allVenues}',
                    name: AppRouteNames.allVenues,
                    builder: (BuildContext context, GoRouterState state) {
                      return const OwnerAllVenues();
                    },
                  ),
                ],
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
                path: '/${AppRouteNames.ownerBookingHistory}',
                name: AppRouteNames.ownerBookingHistory,
                builder: (BuildContext context, GoRouterState state) =>
                    BlocProvider<BookingBloc>(
                      create: (BuildContext context) =>
                          sl<BookingBloc>()..add(const BookingEvent.fetchOwnerBookings()),
                      child: const OwnerBookingHistoryScreen(),
                    ),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/${AppRouteNames.ownerProfile}',
                name: AppRouteNames.ownerProfile,
                builder: (BuildContext context, GoRouterState state) =>
                    BlocProvider<OwnerProfileBloc>(
                      create: (BuildContext context) => sl<OwnerProfileBloc>(),
                      child: const OwnerProfileSettingsScreen(),
                    ),
              ),
            ],
          ),
        ],
      ),

      /// User shell route
      StatefulShellRoute.indexedStack(
        builder:
            (
              BuildContext context,
              GoRouterState state,
              StatefulNavigationShell navigationShell,
            ) {
              // This is the wrapper that contains the BottomNavBar
              return UserBottomNavigationBar(navigationShell: navigationShell);
            },
        branches: <StatefulShellBranch>[
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/${AppRouteNames.userDashboard}',
                name: AppRouteNames.userDashboard,
                builder: (BuildContext context, GoRouterState state) =>
                    const UserDashboard(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/${AppRouteNames.listVenue}',
                name: AppRouteNames.listVenue,
                builder: (BuildContext context, GoRouterState state) =>
                    BlocProvider<UserVenueBloc>(
                      create: (BuildContext context) => sl<UserVenueBloc>(),
                      child: const UserVenueListPage(),
                    ),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/${AppRouteNames.bookingHistory}',
                name: AppRouteNames.bookingHistory,
                builder: (BuildContext context, GoRouterState state) =>
                    BlocProvider<BookingBloc>(
                      create: (BuildContext context) =>
                          sl<BookingBloc>()..add(const BookingEvent.fetchMyBookings()),
                      child: const BookingHistoryScreen(),
                    ),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/${AppRouteNames.userProfile}',
                name: AppRouteNames.userProfile,
                builder: (BuildContext context, GoRouterState state) =>
                    BlocProvider<UserProfileBloc>(
                      create: (BuildContext context) => sl<UserProfileBloc>(),
                      child: const UserProfileScreen(),
                    ),
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
        path: '/${AppRouteNames.payoutDetails}',
        name: AppRouteNames.payoutDetails,
        builder: (BuildContext context, GoRouterState state) {
          return const OwnerPayoutDetails();
        },
      ),
      GoRoute(
        path: '/venue_details',
        name: 'venue_details',
        pageBuilder: (BuildContext context, GoRouterState state) {
          final UserVenueEntity venue = state.extra! as UserVenueEntity;
          return CustomTransitionPage<void>(
            key: state.pageKey,
            child: UserVenueDetailsScreen(venue: venue),
            transitionDuration: const Duration(milliseconds: 550),
            reverseTransitionDuration: const Duration(milliseconds: 550),
            transitionsBuilder: (
              BuildContext context,
              Animation<double> animation,
              Animation<double> secondaryAnimation,
              Widget child,
            ) {
              final Animation<double> fadeAnimation = animation.drive(
                Tween<double>(begin: 0.0, end: 1.0)
                    .chain(CurveTween(curve: Curves.easeInOutCubic)),
              );
              return FadeTransition(opacity: fadeAnimation, child: child);
            },
          );
        },
      ),
      GoRoute(
        path: '/${AppRouteNames.checkoutPolicy}',
        name: AppRouteNames.checkoutPolicy,
        builder: (BuildContext context, GoRouterState state) {
          final Map<String, dynamic> extra =
              state.extra! as Map<String, dynamic>;
          final UserVenueEntity venue = extra['venue'] as UserVenueEntity;
          final DateTime selectedDate = extra['selectedDate'] as DateTime;
          final String selectedTimeSlot = extra['selectedTimeSlot'] as String;
          return BlocProvider<BookingBloc>(
            create: (BuildContext context) => sl<BookingBloc>(),
            child: UserBookingDetailsPolicyScreen(
              venue: venue,
              selectedDate: selectedDate,
              selectedTimeSlot: selectedTimeSlot,
            ),
          );
        },
      ),
      GoRoute(
        path: '/booking_success',
        name: 'booking_success',
        builder: (BuildContext context, GoRouterState state) {
          final BookingDetailsEntity details =
              state.extra! as BookingDetailsEntity;
          return BookingSuccessScreen(bookingDetails: details);
        },
      ),
      GoRoute(
        path: '/booking_failure',
        name: 'booking_failure',
        builder: (BuildContext context, GoRouterState state) {
          final String errorMessage = state.extra! as String;
          return BookingFailureScreen(errorMessage: errorMessage);
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

        return '/${AppRouteNames.userDashboard}';
      }

      return null;
    },
  );
}
