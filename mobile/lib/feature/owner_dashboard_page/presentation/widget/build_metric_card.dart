import 'package:flutter/material.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_text.dart';

class BuildMetricCard extends StatelessWidget {
  const BuildMetricCard({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
    this.badge,
    this.badgeColor,
    this.badgeIcon,
  });

  final IconData icon;
  final String label;
  final String value;
  final Color color;
  final String? badge;
  final Color? badgeColor;
  final IconData? badgeIcon;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: AppSpacing.cardPadding,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppShapes.md,
        border: Border.all(color: AppColors.outline),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withAlpha(8),
                  borderRadius: AppShapes.defaultBorder,
                ),
                child: Icon(icon, color: color, size: AppSpacing.iconMd),
              ),
              if (badge != null)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: (badgeColor ?? Colors.green).withAlpha(15),
                    borderRadius: AppShapes.sm,
                  ),
                  child: Row(
                    children: <Widget>[
                      if (badgeIcon != null && badge != null) ...<Widget>[
                        Icon(
                          badgeIcon,
                          color: badgeColor ?? Colors.green,
                          size: 12,
                        ),
                        const SizedBox(width: 4),
                      ],
                      AppText(badge!),
                    ],
                  ),
                ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              AppText(label, variant: TextVariant.headingLarge),
              const SizedBox(height: 4),
              FittedBox(
                child: AppText(value, variant: TextVariant.headingMedium),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
