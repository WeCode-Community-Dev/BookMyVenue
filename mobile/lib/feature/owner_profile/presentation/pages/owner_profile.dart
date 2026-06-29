import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import '../../domain/entity/owner_profile_entity.dart';
import '../bloc/owner_profile_bloc.dart';
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
    // Trigger owner profile fetch
    WidgetsBinding.instance.addPostFrameCallback((Duration timeStamp) {
      context.read<OwnerProfileBloc>().add(
        const OwnerProfileEvent.getOwnerProfile(),
      );
    });

    _nameController = TextEditingController();
    _businessController = TextEditingController();
    _emailController = TextEditingController();
    _phoneController = TextEditingController();
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
      appBar: const CustomAppBar(title: 'Profile & Settings'),
      body: BlocConsumer<OwnerProfileBloc, OwnerProfileState>(
        listener: (BuildContext context, OwnerProfileState state) {
          if (state.status == OwnerProfileStatus.success &&
              state.profile != null) {
            final OwnerProfileResponseEntity profile = state.profile!;
            _nameController.text = profile.fullName;
            _businessController.text = profile.ownerProfile?.businessName ?? '';
            _emailController.text = profile.email;
            _phoneController.text = profile.mobileNumber;
          }
        },
        builder: (BuildContext context, OwnerProfileState state) {
          if (state.status == OwnerProfileStatus.loading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state.status == OwnerProfileStatus.failure) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  AppText(
                    state.errorMessage ?? 'Failed to load profile',
                    color: Colors.red,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      context.read<OwnerProfileBloc>().add(
                        const OwnerProfileEvent.getOwnerProfile(),
                      );
                    },
                    child: const AppText('Retry'),
                  ),
                ],
              ),
            );
          }

          final OwnerProfileResponseEntity? profile = state.profile;
          if (profile == null) {
            return const Center(child: AppText('No profile data available.'));
          }

          final bool isVerified =
              profile.ownerProfile?.approvalStatus.toLowerCase() == 'approved';

          return SingleChildScrollView(
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
                Center(
                  child: AppText(
                    profile.fullName,
                    variant: TextVariant.headingLarge,
                  ),
                ),
                Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: isVerified
                          ? Colors.green.shade50
                          : Colors.orange.shade50,
                      borderRadius: AppShapes.full,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        Icon(
                          isVerified ? Icons.verified : Icons.hourglass_empty,
                          size: 14,
                          color: isVerified ? Colors.green : Colors.orange,
                        ),
                        const SizedBox(width: 4),
                        AppText(
                          isVerified
                              ? 'Verified Partner'
                              : 'Verification: ${profile.ownerProfile?.approvalStatus ?? 'Pending'}',
                          variant: TextVariant.captionMedium,
                          color: isVerified
                              ? Colors.green.shade700
                              : Colors.orange.shade700,
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

                SettingsGroupCard(
                  children: <Widget>[
                    SettingsTile(
                      icon: Icons.person_outline,
                      title: 'Personal Information',
                      subtitle: profile.fullName,
                    ),
                    SettingsTile(
                      icon: Icons.work_outline,
                      title: 'Business Details',
                      subtitle:
                          profile.ownerProfile?.businessName ?? 'Not Available',
                    ),
                    SettingsTile(
                      icon: Icons.email_outlined,
                      title: 'Email Address',
                      subtitle: profile.email,
                    ),
                    SettingsTile(
                      icon: Icons.phone_outlined,
                      title: 'Phone Number',
                      subtitle: profile.mobileNumber,
                      showDivider: false,
                    ),
                  ],
                ),

                const _SettingsSectionHeader('Support & Legal'),

                const SettingsGroupCard(
                  children: <Widget>[
                    SettingsTile(
                      icon: Icons.help_outline,
                      title: 'Help Center',
                    ),
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
          );
        },
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
