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
    final VenueDetailsState venueCubit = context.watch<VenueDetailsCubit>().state;
    final bool isPublishing = context.watch<VenueBloc>().state.addVenueStatus == VenueStatus.loading;

    return Row(
      spacing: AppSpacing.spaceSm,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[
        Expanded(
          child: AppButton(
            label: 'Back',
            type: ButtonType.secondary,
            onPressed: isPublishing
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
            label: venueCubit.step == 4 ? 'Publish Venue' : 'Next',
            isLoading: venueCubit.step == 4 && isPublishing,
            onPressed: () {
              onTap(venueCubit.step + 1);
            },
          ),
        ),
      ],
    );
  }
}
