import 'package:flutter/material.dart';

import '../../../../core/auth/auth_session.dart';
import '../../../../core/logger/app_logger.dart';
import '../../../../core/services/permission_service.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import '../widget/build_metric_card.dart';
import '../widget/build_quick_action_button.dart';
import '../widget/build_recent_booking_card.dart';
import '../widget/build_revenue_performance_card.dart';

class OwnerDashboardPage extends StatefulWidget {
  const OwnerDashboardPage({super.key});

  @override
  State<OwnerDashboardPage> createState() => _OwnerDashboardPageState();
}

class _OwnerDashboardPageState extends State<OwnerDashboardPage> {
  @override
  void initState() {
    super.initState();
    getLocationPermission();
  }

  Future<void> getLocationPermission() async {
    final granted = await PermissionService.requestLocation();
    AppLogger.info('$granted permission granted');
  }

  @override
  Widget build(BuildContext context) {
    final String firstName = AuthSession.ownerName?.split(' ').first ?? 'jiyad';
    return Scaffold(
      appBar: const CustomAppBar(title: 'Venue hub'),
      body: SingleChildScrollView(
        padding: AppSpacing.screenPadding,
        child: Column(
          spacing: AppSpacing.spaceMd,
          crossAxisAlignment: .start,
          children: <Widget>[
            // Welcome Header
            AppText(
              'Welcome back, $firstName.',
              variant: TextVariant.headerText,
            ),

            const AppText(
              "Here's what's happening with your properties today.",
            ),

            // Metrics Grid
            GridView.count(
              crossAxisCount: 2,
              padding: EdgeInsets.zero,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: AppSpacing.spaceSm,
              mainAxisSpacing: AppSpacing.spaceSm,
              childAspectRatio: 1.2,
              children: <Widget>[
                BuildMetricCard(
                  icon: Icons.payments,
                  label: 'TOTAL REVENUE',
                  value: r'$42,850.00',
                  color: AppColors.primary,
                  badge: '+12.5%',
                  badgeColor: AppColors.success,
                  badgeIcon: Icons.trending_up,
                ),
                const BuildMetricCard(
                  icon: Icons.location_city,
                  label: 'TOTAL VENUES',
                  value: '5',
                  color: AppColors.primary,
                ),
                BuildMetricCard(
                  icon: Icons.check_circle,
                  label: 'COMPLETED BOOKINGS',
                  value: '156',
                  color: AppColors.success,
                ),
                const BuildMetricCard(
                  icon: Icons.event,
                  label: 'UPCOMING BOOKINGS',
                  value: '24',
                  color: AppColors.primary,
                ),
              ],
            ),

            // Bento Section: Revenue Performance & Recent Bookings
            const BuildRevenuePerformanceCard(),

            const BuildRecentBookingsCard(),

            // Quick Actions Section
            const AppText('Quick Actions', variant: TextVariant.headingLarge),
            BuildQuickActionButton(
              title: 'Generate Report',
              subtitle: 'Export detailed earnings and occupancy data.',
              color: AppColors.secondary,
              icon: Icons.description_outlined,
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const AppText(
                      'Financial report has been generated and sent to email!',
                    ),
                    backgroundColor: AppColors.success,
                  ),
                );
              },
            ),
            BuildQuickActionButton(
              title: 'Generate Report',
              subtitle: 'Export detailed earnings and occupancy data.',
              color: AppColors.secondary,
              icon: Icons.description_outlined,
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const AppText(
                      'Financial report has been generated and sent to email!',
                    ),
                    backgroundColor: AppColors.success,
                  ),
                );
              },
            ),
            AppSpacing.h24,
          ],
        ),
      ),
    );
  }
}
