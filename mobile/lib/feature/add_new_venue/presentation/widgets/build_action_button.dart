import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/widgets/app_button.dart';
import '../bloc/cubit/venue_details_cubit.dart';
import '../bloc/venue_bloc.dart';

class BuildActionButton extends StatelessWidget {
  const BuildActionButton({super.key, required this.onTap});

  final Function(int) onTap;

  @override
  Widget build(BuildContext context) {
    final VenueDetailsState venueCubit = context
        .watch<VenueDetailsCubit>()
        .state;
    final VenueState venueState = context.watch<VenueBloc>().state;
    final bool isPublishing = venueState.addVenueStatus == VenueStatus.loading;
    final bool isUploading = venueState.addVenueStatus == VenueStatus.uploading;
    final bool isLoading = isPublishing || isUploading;

    return Row(
      spacing: AppSpacing.spaceSm,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[
        Expanded(
          child: AppButton(
            label: 'Back',
            type: ButtonType.secondary,
            onPressed: isLoading
                ? null
                : () {
                    if (venueCubit.step == 1) {
                      // widget.onClose();
                    } else {
                      onTap(venueCubit.step - 1);
                    }
                  },
          ),
        ),
        Expanded(
          child: AppButton(
            label: isUploading
                ? 'Uploading Images...'
                : (venueCubit.step == 4 ? 'Publish Venue' : 'Next'),
            isLoading: isLoading,
            onPressed: isLoading
                ? null
                : () {
                    onTap(venueCubit.step + 1);
                  },
          ),
        ),
      ],
    );
  }
}
