import 'package:flutter/material.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text.dart';

class BuildRecentBookingsCard extends StatelessWidget {
  const BuildRecentBookingsCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppShapes.md,
        border: Border.all(color: AppColors.outline),
      ),
      child: Column(
        crossAxisAlignment: .start,
        children: <Widget>[
          const AppText('Recent Bookings', variant: TextVariant.headingLarge),

          AppSpacing.w16,
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 3,
            separatorBuilder: (BuildContext context, int index) =>
                const Divider(height: AppSpacing.spaceLg),
            itemBuilder: (BuildContext context, int index) {
              // final booking = recentBookings[index];
              //
              //  Color statusBg = AppColors.success.withAlpha(50);
              Color statusBg;
              Color statusColor;

              switch ('Paid') {
                case 'Paid':
                  statusColor = AppColors.success;
                  statusBg = AppColors.successBg;
                  break;
                case 'Pending':
                  statusColor = AppColors.warningText;
                  statusBg = AppColors.warningBg;
                  break;
                default:
                  statusColor = AppColors.error;
                  statusBg = AppColors.errorBg;
              }

              return Padding(
                padding: AppSpacing.pySm,
                child: Row(
                  spacing: AppSpacing.spaceXs,
                  children: <Widget>[
                    Container(
                      padding: AppSpacing.pLg,
                      decoration: BoxDecoration(
                        color: AppColors.surfaceLow,
                        borderRadius: AppShapes.defaultBorder,
                      ),
                      alignment: Alignment.center,
                      child: const Icon(
                        Icons.event_seat_outlined,
                        color: AppColors.primary,
                        size: 20,
                      ),
                    ),

                    const Expanded(
                      child: Column(
                        crossAxisAlignment: .start,
                        children: <Widget>[
                          AppText(
                            'Venue name',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          AppText('Customer Name'),
                        ],
                      ),
                    ),

                    Column(
                      crossAxisAlignment: .end,
                      children: <Widget>[
                        AppText('\$${1000.toStringAsFixed(0)}'),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: statusBg,
                            borderRadius: AppShapes.sm,
                          ),
                          child: AppText('status', color: statusColor),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),

          AppButton(label: 'View All Bookings', onPressed: () {}),
        ],
      ),
    );
  }
}
