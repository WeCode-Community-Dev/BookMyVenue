import 'dart:io';

import '../environment/app_env.dart';

class AppConfig {
  static String devBaseUrl = Platform.isIOS
      ? 'http://0.0.0.0:8000'
      : 'http://10.0.2.2:8000';
  // TODO(Jiyad) : Update Production url here
  static const String prodBaseUrl = 'Update Production url here';

  static String get baseUrl {
    if (Environment.current == AppEnvironment.dev) {
      return devBaseUrl;
    } else {
      return prodBaseUrl;
    }
  }
}
