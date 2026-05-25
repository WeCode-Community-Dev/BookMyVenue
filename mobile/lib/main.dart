import 'package:flutter/material.dart';

import 'core/theme/app_theme.dart';

void main() {
  runApp(const MyApp());
}

final ValueNotifier<ThemeMode> themeNotifier = ValueNotifier<ThemeMode>(
  ThemeMode.system,
);

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: themeNotifier,
      builder: (_, ThemeMode mode, _) {
        return MaterialApp(
          title: 'Book my venue',
          themeMode: mode,
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          home: const MyHomePage(title: 'Flutter Demo Home Page'),
        );
      },
    );
  }
}
