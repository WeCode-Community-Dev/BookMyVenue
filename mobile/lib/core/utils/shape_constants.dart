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

  // Spacing
  static const double spaceXs = 4;
  static const double spaceSm = 8;
  static const double spaceMd = 12;
  static const double spaceLg = 16;
  static const double spaceXl = 24;
  static const double space2xl = 32;

  // Padding
  static EdgeInsets get pXs => const EdgeInsets.all(spaceXs);
  static EdgeInsets get pSm => const EdgeInsets.all(spaceSm);
  static EdgeInsets get pMd => const EdgeInsets.all(spaceMd);
  static EdgeInsets get pLg => const EdgeInsets.all(spaceLg);
  static EdgeInsets get pXl => const EdgeInsets.all(spaceXl);

  // Horizontal Padding
  static EdgeInsets get pxSm => const EdgeInsets.symmetric(horizontal: spaceSm);

  static EdgeInsets get pxMd => const EdgeInsets.symmetric(horizontal: spaceMd);

  static EdgeInsets get pxLg => const EdgeInsets.symmetric(horizontal: spaceLg);

  static EdgeInsets get pxXl => const EdgeInsets.symmetric(horizontal: spaceXl);

  // Vertical Padding
  static EdgeInsets get pySm => const EdgeInsets.symmetric(vertical: spaceSm);

  static EdgeInsets get pyMd => const EdgeInsets.symmetric(vertical: spaceMd);

  static EdgeInsets get pyLg => const EdgeInsets.symmetric(vertical: spaceLg);

  static EdgeInsets get pyXl => const EdgeInsets.symmetric(vertical: spaceXl);

  // Screen Padding
  static EdgeInsets get screenPadding => const EdgeInsets.all(spaceLg);

  static EdgeInsets get screenHorizontalPadding =>
      const EdgeInsets.symmetric(horizontal: spaceLg);

  // Card Padding
  static EdgeInsets get cardPadding => const EdgeInsets.all(spaceLg);

  // Bottom Sheet Padding
  static EdgeInsets get bottomSheetPadding =>
      const EdgeInsets.fromLTRB(spaceLg, spaceLg, spaceLg, spaceXl);

  // Icon Sizes
  static const double iconSm = 16;
  static const double iconMd = 20;
  static const double iconLg = 24;
  static const double iconXl = 32;

  // Elevations
  static const double elevationNone = 0;
  static const double elevationSm = 2;
  static const double elevationMd = 4;
  static const double elevationLg = 8;
}
