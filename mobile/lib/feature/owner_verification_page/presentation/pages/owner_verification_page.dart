import 'dart:ui';

import 'package:flutter/material.dart';

import '../../../../core/gen/assets.gen.dart';
import '../../../../core/widgets/app_text.dart';

class OwnerVerificationPage extends StatelessWidget {
  const OwnerVerificationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Color(0xFFF7F8FA),
      appBar: VenueHubAppBar(),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              _HeaderSection(),
              SizedBox(height: 24),
              VerificationStatusCard(),
              SizedBox(height: 20),

              LockedFeatureCard(
                icon: Icons.add_circle_outline,
                title: 'Add Your Venue',
              ),
              SizedBox(height: 16),
              LockedFeatureCard(
                icon: Icons.grid_view_outlined,
                title: 'Venue Listings',
              ),
              SizedBox(height: 16),
              LockedFeatureCard(icon: Icons.history, title: 'Booking History'),
              SizedBox(height: 20),
              MarketplaceBanner(),
              SizedBox(height: 20),
              SupportCard(),
              SizedBox(height: 40),
            ],
          ),
        ),
      ),
      // bottomNavigationBar: const _BottomNav(),
    );
  }
}

class _HeaderSection extends StatelessWidget {
  const _HeaderSection();

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          spacing: 4,
          children: <Widget>[
            Icon(Icons.pending_actions, color: Colors.red),
            Expanded(
              child: AppText('VERIFICATION IN PROGRESS', color: Colors.red),
            ),
          ],
        ),
        SizedBox(height: 16),
        AppText('Profile Under Verification', variant: TextVariant.headerText),
        SizedBox(height: 16),
        // TODO(Jiyad): update the Alex with venue owner name
        AppText(
          "Welcome to the VenueHub family, Alex! We're excited to have you on board. To maintain the highest quality for our guests, all new host profiles undergo a manual security screening.",
        ),
      ],
    );
  }
}

class VerificationStatusCard extends StatelessWidget {
  const VerificationStatusCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.red.shade200),
        color: Colors.white,
      ),
      child: Stack(
        children: <Widget>[
          Positioned.fill(
            right: null,
            child: Container(width: 6, color: Colors.red),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 12,
              children: <Widget>[
                Row(
                  children: <Widget>[
                    CircleAvatar(
                      backgroundColor: Colors.red.shade100,
                      child: const Icon(
                        Icons.timer_outlined,
                        color: Colors.red,
                      ),
                    ),

                    const Expanded(
                      child: AppText(
                        'Status: Pending Review',
                        variant: TextVariant.headingLarge,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),

                const AppText(
                  'Your documents are currently under review by our team.'
                  ' The verification process usually takes 24–48 hours.'
                  ' Once completed, we will notify you via email on your registered email address.',
                  variant: TextVariant.labelMedium,
                ),

                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.refresh),
                    label: const AppText('Refresh Status'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class LockedFeatureCard extends StatelessWidget {
  const LockedFeatureCard({super.key, required this.icon, required this.title});

  final IconData icon;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 140,
      width: double.infinity,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.red.shade100),
      ),
      child: Stack(
        children: <Widget>[
          /// Blurred background content
          Positioned.fill(
            child: IgnorePointer(
              child: Stack(
                children: <Widget>[
                  Positioned(
                    top: 16,
                    left: 16,
                    child: Icon(icon, size: 18, color: Colors.grey.shade500),
                  ),

                  Positioned(
                    left: 16,
                    bottom: 16,
                    child: AppText(
                      '+ $title',
                      variant: TextVariant.headingMedium,
                      color: Colors.grey.shade600,
                    ),
                  ),

                  Positioned.fill(
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 1.5, sigmaY: 1.5),
                      child: Container(
                        color: Colors.white.withValues(alpha: .2),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          /// Foreground content
          const Positioned.fill(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Icon(
                  Icons.lock_outline_rounded,
                  size: 34,
                  color: Color(0xFF94A3B8),
                ),

                SizedBox(height: 8),

                AppText(
                  'Awaiting Verification',
                  variant: TextVariant.labelMedium,
                  color: Color(0xFF233A72),
                  fontWeight: FontWeight.w600,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class MarketplaceBanner extends StatelessWidget {
  const MarketplaceBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: Stack(
        children: <Widget>[
          Image.asset(
            Assets.images.marketplace.path,
            height: 200,
            width: double.infinity,
            fit: BoxFit.cover,
          ),
          // Container(height: 150, color: Colors.black26),
          const Positioned(
            left: 20,
            right: 20,
            bottom: 10,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                AppText(
                  'Building a safer marketplace.',
                  variant: TextVariant.headingLarge,
                ),
                AppText(
                  'Every host is verified to ensure quality and trust for our global community.',
                  color: Colors.black,
                  variant: TextVariant.labelMedium,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class SupportCard extends StatelessWidget {
  const SupportCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFEAF1FF),
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Column(
        spacing: 12,
        children: <Widget>[
          Row(
            spacing: 6,
            children: <Widget>[
              Icon(Icons.help_outline),
              AppText('Need Assistance?', variant: TextVariant.headingLarge),
            ],
          ),

          AppText(
            'Our support team is available 24/7 if you have questions about your application or need help preparing your listings.',
            variant: TextVariant.labelMedium,
          ),

          Row(
            spacing: 6,
            children: <Widget>[
              Icon(Icons.chat_bubble_outline),
              Text('Live Chat with Support'),
            ],
          ),
          Row(
            spacing: 6,
            children: <Widget>[
              Icon(Icons.email_outlined),
              Text('verification@venuehub.com'),
            ],
          ),
        ],
      ),
    );
  }
}

class VenueHubAppBar extends StatelessWidget implements PreferredSizeWidget {
  const VenueHubAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      elevation: 0,
      title: const Text(
        'VenueHub',
        style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
      ),
      actions: <Widget>[
        Padding(
          padding: const EdgeInsets.only(right: 16),
          child: FilledButton(
            onPressed: () {},
            child: const Text('Become a Host'),
          ),
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(60);
}
