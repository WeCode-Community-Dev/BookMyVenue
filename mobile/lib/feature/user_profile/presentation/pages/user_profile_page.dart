import 'package:flutter/material.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';

class UserProfileScreen extends StatefulWidget {
  const UserProfileScreen({super.key});

  @override
  State<UserProfileScreen> createState() => _UserProfileScreenState();
}

class _UserProfileScreenState extends State<UserProfileScreen> {
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;
  late TextEditingController _addressController;

  @override
  void initState() {
    super.initState();

    _nameController = TextEditingController();
    _emailController = TextEditingController();
    _phoneController = TextEditingController();
    _addressController = TextEditingController();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'My Profile'),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: AppSpacing.screenPadding,
          child: Center(
            child: Column(
              crossAxisAlignment: .start,
              children: <Widget>[
                // Avatar, completeness and phone card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: AppShapes.md,
                    border: Border.all(color: AppColors.outline),
                  ),
                  child: Column(
                    children: <Widget>[
                      Stack(
                        alignment: .center,
                        children: <Widget>[
                          Container(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: AppColors.outline,
                                width: 3,
                              ),
                            ),
                            child: const ClipOval(
                              child: Image(
                                image: NetworkImage(
                                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
                                ),
                                width: 90,
                                height: 90,
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              padding: const EdgeInsets.all(6),
                              decoration: const BoxDecoration(
                                color: AppColors.primary,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.camera_alt,
                                color: Colors.white,
                                size: 14,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const AppText('Incomplete Profile'),

                      const AppText('+1 (555) 000-1234'),
                    ],
                  ),
                ),

                // Quick links: My Bookings, Payment, Logout
                Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: AppShapes.md,
                    border: Border.all(color: AppColors.outline),
                  ),
                  child: Column(
                    children: <Widget>[
                      _buildQuickLinkItem(
                        icon: Icons.calendar_today_outlined,
                        iconColor: Colors.blue,
                        title: 'My Bookings',
                        onTap: () {
                          // Navigator.of(context).push(
                          //   createHeroPageRoute(
                          //     const UserBookingHistoryScreen(),
                          //   ),
                          // );
                        },
                      ),
                      Divider(height: 1, color: AppColors.outline),
                      _buildQuickLinkItem(
                        icon: Icons.credit_card_outlined,
                        iconColor: Colors.indigo,
                        title: 'Payment Methods',
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: AppText(
                                'Payment Methods functionality coming soon!',
                              ),
                            ),
                          );
                        },
                      ),
                      Divider(height: 1, color: AppColors.outline),
                      _buildQuickLinkItem(
                        icon: Icons.logout,
                        iconColor: AppColors.primary,
                        title: 'Logout',
                        titleColor: AppColors.primary,
                        onTap: () {},
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Personal Information Form
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: AppShapes.md,
                    border: Border.all(color: AppColors.outline),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      const AppText('Personal Information'),
                      const SizedBox(height: 20),

                      // Full Name
                      _buildFormLabel('Full Name'),
                      TextFormField(
                        controller: _nameController,
                        decoration: const InputDecoration(
                          hintText: 'e.g. Alex Johnson',
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Email Address
                      _buildFormLabel('Email Address'),
                      TextFormField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(
                          hintText: 'alex@example.com',
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Mobile Number
                      _buildFormLabel('Mobile Number'),
                      TextFormField(
                        controller: _phoneController,
                        keyboardType: TextInputType.phone,
                        decoration: const InputDecoration(
                          hintText: '+1 (555) 000-1234',
                        ),
                      ),
                      const SizedBox(height: 4),
                      const AppText(
                        'Mobile number cannot be changed once verified.',
                      ),
                      const SizedBox(height: 16),

                      // Billing Address
                      _buildFormLabel('Home / Billing Address'),
                      TextFormField(
                        controller: _addressController,
                        maxLines: 3,
                        decoration: const InputDecoration(
                          hintText:
                              '123 Venue Street, Apartment 4B, City, Country',
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Save Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: AppShapes.defaultBorder,
                            ),
                            elevation: 0,
                          ),
                          onPressed: () {},
                          icon: const Icon(Icons.save_outlined, size: 20),
                          label: const AppText('Save Changes'),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Information Blocks at bottom
                _buildInfoCard(
                  icon: Icons.verified_user_outlined,
                  iconColor: AppColors.primary,
                  bgColor: AppColors.primary.withAlpha(8),
                  borderColor: AppColors.primary.withAlpha(15),
                  titleColor: AppColors.primary,
                  title: 'Secure Data',
                  description:
                      'Your information is encrypted and never shared with third parties.',
                ),
                const SizedBox(height: 12),
                _buildInfoCard(
                  icon: Icons.history,
                  iconColor: Colors.blue,
                  bgColor: Colors.blue.withAlpha(8),
                  borderColor: Colors.blue.withAlpha(15),
                  titleColor: Colors.blue[800]!,
                  title: 'Booking History',
                  description:
                      'Track all your previous venue visits and upcoming reservations easily.',
                ),
                const SizedBox(height: 12),
                _buildInfoCard(
                  icon: Icons.headset_mic_outlined,
                  iconColor: Colors.green,
                  bgColor: Colors.green.withAlpha(8),
                  borderColor: Colors.green.withAlpha(15),
                  titleColor: Colors.green[800]!,
                  title: '24/7 Support',
                  description:
                      'Get instant help from our dedicated concierge for any booking issues.',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFormLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: AppText(text),
    );
  }

  Widget _buildQuickLinkItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    Color? titleColor,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: iconColor.withAlpha(10),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: iconColor, size: 18),
      ),
      title: AppText(title),
      trailing: Icon(
        Icons.chevron_right,
        color: AppColors.onSurfaceVariant.withAlpha(50),
        size: 20,
      ),
      onTap: onTap,
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required Color iconColor,
    required Color bgColor,
    required Color borderColor,
    required Color titleColor,
    required String title,
    required String description,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: AppShapes.md,
        border: Border.all(color: borderColor),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Icon(icon, color: iconColor, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                AppText(title),
                const SizedBox(height: 4),
                AppText(description),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
