import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/auth/auth_session.dart';
import '../../../../core/router/route_name.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import '../../domain/params/get_venue_params.dart';
import '../bloc/cubit/venue_details_cubit.dart';
import '../bloc/venue_bloc.dart';
import '../widgets/build_step_1_basics.dart';
import '../widgets/build_step_2_media.dart';
import '../widgets/build_step_3_location.dart';
import '../widgets/build_step_4_pricing.dart';
import '../widgets/build_stepper.dart';

class AddNewVenuePage extends StatefulWidget {
  const AddNewVenuePage({super.key});

  @override
  State<AddNewVenuePage> createState() => _AddNewVenuePageState();
}

class _AddNewVenuePageState extends State<AddNewVenuePage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final String userId = AuthSession.userId ?? '';
      context.read<VenueBloc>()
        ..add(const VenueEvent.getAmenities())
        ..add(
          VenueEvent.getAllVenues(
            params: GetVenuesParams(skip: 0, limit: 20, ownerId: userId),
          ),
        );
    });
  }

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
        appBar: CustomAppBar(
          title: 'Add a Venue',
          actions: <Widget>[
            AppButton(
              label: 'View All Venues',
              onPressed: () {
                context.pushNamed(AppRouteNames.allVenues);
              },
              size: ButtonSize.small,
              borderRadius: AppShapes.defaultBorder,
              minWidth: 150,
            ),
            AppSpacing.w12,
          ],
        ),
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
