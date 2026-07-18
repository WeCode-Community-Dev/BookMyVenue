import 'package:flutter/material.dart';

import 'core/auth/auth_session.dart';
import 'core/di/injection.dart';
import 'core/environment/app_env.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'core/utils/ui/app_commands.dart';

Future<void> main() async {
  Environment.init(AppEnvironment.dev);
  WidgetsFlutterBinding.ensureInitialized();

  await setupInjector();
  await AuthSession.init();
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
        // return MaterialApp(
        //   scaffoldMessengerKey: AppCommands.messengerKey,
        //   title: 'Book my venue',
        //   themeMode: mode,
        //   theme: AppTheme.lightTheme,
        //   darkTheme: AppTheme.darkTheme,
        //   home: UserVenueListPage(),
        // );
        return MaterialApp.router(
          scaffoldMessengerKey: AppCommands.messengerKey,
          title: 'Book my venue',
          themeMode: mode,
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          routerConfig: AppRouter.router,
        );
      },
    );
  }
}
