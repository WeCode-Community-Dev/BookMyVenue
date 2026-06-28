import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import '../bloc/cubit/venue_details_cubit.dart';
import '../bloc/venue_bloc.dart';
import '../widgets/build_step_1_basics.dart';
import '../widgets/build_step_3_location.dart';
import '../widgets/build_step_2_media.dart';
import '../widgets/build_step_4_pricing.dart';
import '../widgets/build_stepper.dart';

class OwnerVenuesListPage extends StatefulWidget {
  const OwnerVenuesListPage({super.key});

  @override
  State<OwnerVenuesListPage> createState() => _OwnerVenuesListPageState();
}

class _OwnerVenuesListPageState extends State<OwnerVenuesListPage> {
  bool _isWizardOpen = true;

  @override
  Widget build(BuildContext context) {
    if (_isWizardOpen) {
      return AddVenueWizardFlow(
        onClose: () {
          setState(() {
            _isWizardOpen = false;
          });
        },
      );
    }

    return Scaffold(
      appBar: const CustomAppBar(title: 'Add new venue'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            // Header Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      AppText('My Venues'),
                      SizedBox(height: 4),
                      AppText(
                        'Manage your listed properties, upload media, and adjust pricing.',
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),

                Expanded(
                  child: AppButton(label: 'Add Venue', onPressed: () {}),
                ),
              ],
            ),

            // Venues Grid
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 20,
                mainAxisSpacing: 20,
                childAspectRatio: 0.85,
              ),
              itemCount: 5,
              itemBuilder: (BuildContext context, int index) {
                return _buildVenueCard(context);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVenueCard(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppShapes.md,
        border: Border.all(color: AppColors.outline),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          // Image slot with overlay price tag
          Expanded(
            child: Stack(
              children: <Widget>[
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(12),
                  ),
                  child: Container(
                    width: double.infinity,
                    color: AppColors.surfaceHighest,
                    child: Image.network(
                      'venue.imagePath',
                      fit: BoxFit.cover,
                      errorBuilder:
                          (
                            BuildContext context,
                            Object error,
                            StackTrace? stackTrace,
                          ) => Center(
                            child: Icon(
                              Icons.broken_image,
                              size: 48,
                              color: AppColors.onSurfaceVariant,
                            ),
                          ),
                    ),
                  ),
                ),
                Positioned(
                  top: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withAlpha(90),
                      borderRadius: AppShapes.sm,
                    ),
                    child: AppText('\$${1000.toStringAsFixed(0)}/hr'),
                  ),
                ),
              ],
            ),
          ),
          // Content
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                const AppText('venue.type'),
                const SizedBox(height: 4),
                const AppText(
                  'venue.name',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Row(
                  children: <Widget>[
                    Icon(
                      Icons.people_outline,
                      size: 16,
                      color: AppColors.onSurfaceVariant,
                    ),
                    const SizedBox(width: 6),
                    const AppText('Up to ${100} guests'),
                    const Spacer(),
                    Icon(
                      Icons.square_foot,
                      size: 16,
                      color: AppColors.onSurfaceVariant,
                    ),
                    const SizedBox(width: 4),
                    AppText('${1500.toStringAsFixed(0)} sq ft'),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: <Widget>[
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.successBg,
                        borderRadius: const BorderRadius.all(
                          Radius.circular(4),
                        ),
                      ),
                      child: Row(
                        children: <Widget>[
                          Icon(
                            Icons.verified,
                            color: AppColors.success,
                            size: 12,
                          ),
                          const SizedBox(width: 4),
                          const AppText('Verified Venue'),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class AddVenueWizardFlow extends StatefulWidget {
  const AddVenueWizardFlow({super.key, required this.onClose});
  final VoidCallback onClose;

  @override
  State<AddVenueWizardFlow> createState() => _AddVenueWizardFlowState();
}

class _AddVenueWizardFlowState extends State<AddVenueWizardFlow> {
  @override
  Widget build(BuildContext context) {
    return BlocListener<VenueBloc, VenueState>(
      listener: (BuildContext context, VenueState state) {
        if (state.addVenueStatus == VenueStatus.success) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                state.successMessage ?? 'Venue added successfully!',
              ),
              backgroundColor: Colors.green,
            ),
          );
          widget.onClose();
        } else if (state.addVenueStatus == VenueStatus.failure) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.errorMessage ?? 'Failed to add venue'),
              backgroundColor: Colors.red,
            ),
          );
        }
      },
      child: Scaffold(
        backgroundColor: AppColors.background,
        appBar: const CustomAppBar(title: 'Add a Venue'),
        body: BlocBuilder<VenueDetailsCubit, VenueDetailsState>(
          builder: (BuildContext context, VenueDetailsState state) {
            return Column(
              children: <Widget>[
                // Step timeline indicators
                BuildStepper(step: state.step),

                Expanded(
                  child: SingleChildScrollView(
                    padding: AppSpacing.screenPadding,
                    child: Center(
                      child: Container(
                        constraints: const BoxConstraints(maxWidth: 800),
                        child: _buildStepContent(state.step),
                      ),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildStepContent(int step) {
    switch (step) {
      case 1:
        return const BuildStep1Basics();
      case 2:
        return const BuildStep2Media();
      case 3:
        return const BuildStep3Location();
      case 4:
        return const BuildStep4Pricing();
      default:
        return const SizedBox.shrink();
    }
  }
}
