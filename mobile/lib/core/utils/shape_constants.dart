import 'package:flutter/material.dart';

class AppShapes {
  AppShapes._();

  static const double radiusSm = 4.0;
  static const double radiusDefault = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 24.0;
  static const double paddingDefault = 16.0;

  static BorderRadius get sm => BorderRadius.circular(radiusSm);
  static BorderRadius get defaultBorder => BorderRadius.circular(radiusDefault);
  static BorderRadius get md => BorderRadius.circular(radiusMd);
  static BorderRadius get lg => BorderRadius.circular(radiusLg);
  static BorderRadius get xl => BorderRadius.circular(radiusXl);
  static BorderRadius get full => BorderRadius.circular(9999);
  static EdgeInsets get scaffoldPadding => const EdgeInsets.all(paddingDefault);
}
