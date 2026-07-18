import 'package:flutter/material.dart';

import '../../../../../core/widgets/app_text.dart';

class AuthHeader extends StatelessWidget {
  const AuthHeader({super.key, required this.title, required this.subtitle});
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        AppText(title, variant: TextVariant.headingLarge),
        const SizedBox(height: 8),
        AppText(subtitle),
      ],
    );
  }
}
