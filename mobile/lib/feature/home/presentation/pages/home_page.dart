import 'package:flutter/material.dart';

import '../../../../core/widgets/app_text.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key, required this.role});
  final String role;

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Center(child: AppText('Welcom to Home page $role')));
  }
}
