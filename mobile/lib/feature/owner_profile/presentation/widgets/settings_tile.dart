import 'package:flutter/material.dart';

import '../../../../core/utils/colors.dart';
import '../../../../core/widgets/app_text.dart';

class SettingsTile extends StatelessWidget {
  const SettingsTile({
    super.key,
    required this.icon,
    required this.title,
    this.subtitle,
    this.trailing,
    this.onTap,
    this.showDivider = true,
  });

  final IconData icon;
  final String title;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool showDivider;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        ListTile(
          onTap: onTap,
          leading: Icon(icon),
          title: AppText(title),
          subtitle: subtitle != null
              ? AppText(subtitle!, variant: TextVariant.captionRegular)
              : null,
          trailing: trailing ?? const Icon(Icons.chevron_right),
        ),

        if (showDivider) Divider(height: 1, color: AppColors.outline),
      ],
    );
  }
}
