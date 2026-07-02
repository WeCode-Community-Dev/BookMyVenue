import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../../core/auth/auth_session.dart';
import '../../../../../core/gen/assets.gen.dart';
import '../../../../../core/logger/app_logger.dart';
import '../../../../../core/router/route_name.dart';
import '../../../../../core/utils/ui/snackbar_command.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/app_text.dart';
import '../../../domain/enums/approval_status.dart';
import '../../bloc/owner/owner_auth_bloc.dart';

class OwnerVerificationPage extends StatelessWidget {
  const OwnerVerificationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocConsumer<OwnerAuthBloc, OwnerAuthState>(
        listener: (BuildContext context, OwnerAuthState state) {
          if (state.isVerificationError) {
            SnackbarCommand.show(
              type: ToastType.error,
              title: state.verificationErrorMessage!,
            );
          } else if (state.verificationSuccessMessage != null) {
            AppLogger.info('user statget aproved ${state.approvalStatus}');
            SnackbarCommand.show(
              type: ToastType.success,
              title: state.verificationSuccessMessage!,
            );
            if (state.approvalStatus == ApprovalStatus.approved) {
              AppLogger.info('user statget aproved ${state.approvalStatus}');
              Future.delayed(const Duration(seconds: 2), () {
                if (!context.mounted) {
                  return;
                }
                context.goNamed(AppRouteNames.ownerDashboard);
              });
            }
          }
        },
        builder: (BuildContext context, OwnerAuthState state) {
          return SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  const _HeaderSection(),
                  const SizedBox(height: 24),
                  VerificationStatusCard(ownerState: state),
                  const SizedBox(height: 20),

                  const LockedFeatureCard(
                    icon: Icons.add_circle_outline,
                    title: 'Add Your Venue',
                  ),
                  const SizedBox(height: 16),
                  const LockedFeatureCard(
                    icon: Icons.grid_view_outlined,
                    title: 'Venue Listings',
                  ),
                  const SizedBox(height: 16),
                  const LockedFeatureCard(
                    icon: Icons.history,
                    title: 'Booking History',
                  ),
                  const SizedBox(height: 20),
                  const MarketplaceBanner(),
                  const SizedBox(height: 20),
                  const SupportCard(),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          );
        },
      ),

      // bottomNavigationBar: const _BottomNav(),
    );
  }
}

class _HeaderSection extends StatelessWidget {
  const _HeaderSection();

  @override
  Widget build(BuildContext context) {
    final String firstName = AuthSession.ownerName?.split(' ').first ?? 'jiyad';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        const Row(
          spacing: 4,
          children: <Widget>[
            Icon(Icons.pending_actions, color: Colors.red),
            Expanded(
              child: AppText('VERIFICATION IN PROGRESS', color: Colors.red),
            ),
          ],
        ),
        const SizedBox(height: 16),
        const AppText(
          'Profile Under Verification',
          variant: TextVariant.headerText,
        ),
        const SizedBox(height: 16),
        AppText(
          "Welcome to the VenueHub family, $firstName! We're excited to have you on board. To maintain the highest quality for our guests, all new host profiles undergo a manual security screening.",
        ),
      ],
    );
  }
}

class VerificationStatusCard extends StatelessWidget {
  const VerificationStatusCard({super.key, required this.ownerState});

  final OwnerAuthState ownerState;

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
                        'Status: Pending',
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

                AppOutlinedButton(
                  isLoading: ownerState.isVerificationRequestLoading,
                  title: 'Refresh Status',
                  icon: Icons.refresh,
                  onPressed:
                      ownerState.approvalStatus == ApprovalStatus.approved
                      ? null
                      : () {
                          context.read<OwnerAuthBloc>().add(
                            const OwnerAuthEvent.getOwnerProfileStatus(),
                          );
                        },
                ),

                // SizedBox(
                //   width: double.infinity,
                //   child: OutlinedButton.icon(
                //     onPressed: () {
                //       context.read<OwnerAuthBloc>().add(
                //         const OwnerAuthEvent.getOwnerProfile(),
                //       );
                //     },
                //     icon: const Icon(Icons.refresh),
                //     label: const AppText('Refresh Status'),
                //   ),
                // ),
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
