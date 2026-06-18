import 'package:flutter/material.dart';

import '../../../../core/constants/app_constant.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_text.dart';

class BuildRevenuePerformanceCard extends StatelessWidget {
  const BuildRevenuePerformanceCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: AppSpacing.pLg,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppShapes.md,
        border: Border.all(color: AppColors.outline),
      ),
      child: Column(
        crossAxisAlignment: .start,
        children: <Widget>[
          Column(
            crossAxisAlignment: .start,
            spacing: AppSpacing.spaceXs,
            children: <Widget>[
              Row(
                children: <Widget>[
                  const Expanded(
                    child: AppText(
                      'Revenue Performance',
                      variant: TextVariant.headingLarge,
                    ),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.surfaceLow,
                      borderRadius: AppShapes.full,
                    ),
                    padding: const EdgeInsets.all(AppSpacing.spaceXs),
                    child: Row(
                      children: <Widget>[
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppSpacing.spaceMd,
                            vertical: AppSpacing.spaceSm,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: AppShapes.full,
                          ),
                          child: const AppText('Monthly'),
                        ),

                        Padding(
                          padding: AppSpacing.pxMd,
                          child: const AppText('Quarterly'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const AppText('Monthly earning analytics for current year'),
            ],
          ),

          // Simulated Bar Chart
          SizedBox(
            height: 220,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List<Widget>.generate(12, (int index) {
                final double heightFactor = AppConst.heights[index];
                final bool isHighlight = index == 5;
                final bool isAltHighlight = index == 2;
                final Color barColor = isHighlight
                    ? AppColors.primary
                    : isAltHighlight
                    ? AppColors.primary.withAlpha(40)
                    : AppColors.primaryDark;

                return Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: <Widget>[
                      Expanded(
                        child: Align(
                          alignment: Alignment.bottomCenter,
                          child: FractionallySizedBox(
                            heightFactor: heightFactor,
                            child: Container(
                              margin: AppSpacing.pxSm,
                              decoration: BoxDecoration(
                                color: barColor,
                                borderRadius: const BorderRadius.vertical(
                                  top: Radius.circular(6),
                                ),
                                boxShadow: isHighlight
                                    ? <BoxShadow>[
                                        BoxShadow(
                                          color: AppColors.primary.withAlpha(
                                            30,
                                          ),
                                          blurRadius: 10,
                                          offset: const Offset(0, 4),
                                        ),
                                      ]
                                    : null,
                              ),
                            ),
                          ),
                        ),
                      ),

                      AppText(
                        AppConst.months[index],
                        variant: TextVariant.captionRegular,
                      ),
                    ],
                  ),
                );
              }),
            ),
          ),
        ],
      ),
    );
  }
}
