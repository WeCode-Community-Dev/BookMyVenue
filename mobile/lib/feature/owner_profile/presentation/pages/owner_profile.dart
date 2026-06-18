import 'package:flutter/material.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import '../widgets/profile_stat_card.dart';
import '../widgets/setting_group_card.dart';
import '../widgets/settings_tile.dart';

class OwnerProfileSettingsScreen extends StatefulWidget {
  const OwnerProfileSettingsScreen({super.key});

  @override
  State<OwnerProfileSettingsScreen> createState() =>
      _OwnerProfileSettingsScreenState();
}

class _OwnerProfileSettingsScreenState
    extends State<OwnerProfileSettingsScreen> {
  late TextEditingController _nameController;
  late TextEditingController _businessController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;

  @override
  void initState() {
    super.initState();

    _nameController = TextEditingController(text: 'Alex Rivera');
    _businessController = TextEditingController(text: 'Skyline Events Ltd.');
    _emailController = TextEditingController(
      text: 'alex.rivera@skylineevents.com',
    );
    _phoneController = TextEditingController(text: '+1 (555) 019-2834');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _businessController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const Drawer(),
      appBar: const CustomAppBar(title: 'Profile & Settings'),
      body: SingleChildScrollView(
        padding: AppSpacing.screenPadding,
        child: Column(
          spacing: AppSpacing.spaceMd,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            const Center(
              child: CircleAvatar(
                radius: 48,
                backgroundImage: NetworkImage('https://i.pravatar.cc/300'),
              ),
            ),
            const Center(
              child: AppText('Alex Rivers', variant: TextVariant.headingLarge),
            ),
            Center(
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: AppShapes.full,
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    Icon(Icons.verified, size: 14, color: Colors.green),
                    SizedBox(width: 4),
                    AppText(
                      'Verified Partner',
                      variant: TextVariant.captionMedium,
                    ),
                  ],
                ),
              ),
            ),

            const Row(
              spacing: AppSpacing.spaceSm,
              children: <Widget>[
                ProfileStatCard(
                  icon: Icons.storefront,
                  value: '12',
                  label: 'Active Listings',
                  iconColor: AppColors.primary,
                ),

                AppSpacing.h12,

                ProfileStatCard(
                  icon: Icons.star,
                  value: '4.9',
                  label: 'Overall Rating',
                  iconColor: Colors.orange,
                ),
              ],
            ),

            const _SettingsSectionHeader('Account Settings'),

            const SettingsGroupCard(
              children: <Widget>[
                SettingsTile(
                  icon: Icons.person_outline,
                  title: 'Personal Information',
                ),
                SettingsTile(
                  icon: Icons.work_outline,
                  title: 'Business Details & Documents',
                ),
                SettingsTile(
                  icon: Icons.account_balance_wallet_outlined,
                  title: 'Payout Methods',
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      AppText('Razorpay'),
                      SizedBox(width: 8),
                      Icon(Icons.chevron_right),
                    ],
                  ),
                ),
                SettingsTile(
                  icon: Icons.notifications_none,
                  title: 'Notification Settings',
                  showDivider: false,
                ),
              ],
            ),

            const _SettingsSectionHeader('Support & Legal'),

            const SettingsGroupCard(
              children: <Widget>[
                SettingsTile(icon: Icons.help_outline, title: 'Help Center'),
                SettingsTile(
                  icon: Icons.privacy_tip_outlined,
                  title: 'Privacy Policy',
                ),
                SettingsTile(
                  icon: Icons.gavel_outlined,
                  title: 'Terms of Service',
                  showDivider: false,
                ),
              ],
            ),

            OutlinedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.logout),
              label: const AppText(
                'Logout',
                variant: TextVariant.headingMedium,
              ),
              style: OutlinedButton.styleFrom(
                minimumSize: const Size.fromHeight(56),
              ),
            ),

            const Center(
              child: AppText(
                'Version 2.4.0 (Build 892)',
                variant: TextVariant.captionRegular,
              ),
            ),
            AppSpacing.h24,
          ],
        ),
      ),
    );
  }
}

class _SettingsSectionHeader extends StatelessWidget {
  const _SettingsSectionHeader(this.title);

  final String title;

  @override
  Widget build(BuildContext context) {
    return AppText(title.toUpperCase(), variant: TextVariant.headingMedium);
  }
}
