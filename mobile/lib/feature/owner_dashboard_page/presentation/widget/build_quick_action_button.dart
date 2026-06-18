import 'package:flutter/material.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_text.dart';

class BuildQuickActionButton extends StatelessWidget {
  const BuildQuickActionButton({
    super.key,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.icon,
    required this.onTap,
  });

  final String title;
  final String subtitle;
  final Color color;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: AppShapes.md,
      child: Container(
        padding: AppSpacing.pLg,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: AppShapes.md,
          boxShadow: <BoxShadow>[
            BoxShadow(
              color: color.withAlpha(25),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          spacing: AppSpacing.spaceSm,
          children: <Widget>[
            Container(
              padding: AppSpacing.pSm,
              decoration: const BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: Colors.white, size: AppSpacing.iconLg),
            ),

            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  AppText(title, variant: TextVariant.headingLarge),

                  AppText(
                    subtitle,
                    variant: TextVariant.labelSmall,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
