import 'package:flutter/material.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_text.dart';

class ProfileStatCard extends StatelessWidget {
  const ProfileStatCard({
    super.key,
    required this.icon,
    required this.value,
    required this.label,
    required this.iconColor,
  });

  final IconData icon;
  final String value;
  final String label;
  final Color iconColor;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: AppSpacing.cardPadding,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: AppShapes.md,
          border: Border.all(color: AppColors.outline),
        ),
        child: Column(
          children: <Widget>[
            Icon(icon, color: iconColor),
            AppText(value, variant: TextVariant.headerText),
            AppText(label, variant: TextVariant.labelSmall),
          ],
        ),
      ),
    );
  }
}
