import 'package:flutter/material.dart';

class AppShapes {
  AppShapes._();

  // Border Radius
  static const double radiusXs = 4;
  static const double radiusSm = 8;
  static const double radiusDefault = 8;
  static const double radiusMd = 12;
  static const double radiusLg = 16;
  static const double radiusXl = 24;
  static const double radiusFull = 9999;

  static BorderRadius get xs => BorderRadius.circular(radiusXs);
  static BorderRadius get sm => BorderRadius.circular(radiusSm);
  static BorderRadius get md => BorderRadius.circular(radiusMd);
  static BorderRadius get lg => BorderRadius.circular(radiusLg);
  static BorderRadius get xl => BorderRadius.circular(radiusXl);
  static BorderRadius get full => BorderRadius.circular(radiusFull);
  static BorderRadius get defaultBorder => BorderRadius.circular(radiusDefault);

  // Elevations
  static const double elevationNone = 0;
  static const double elevationSm = 2;
  static const double elevationMd = 4;
  static const double elevationLg = 8;
}
