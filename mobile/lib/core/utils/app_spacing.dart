import 'package:flutter/widgets.dart';

class AppSpacing {
  AppSpacing._();

  // Spacing
  static const double spaceXs = 4;
  static const double spaceSm = 8;
  static const double spaceMd = 12;
  static const double spaceLg = 16;
  static const double spaceXl = 24;
  static const double space2xl = 32;

  static const Widget w4 = SizedBox(width: 4);
  static const Widget w8 = SizedBox(width: 8);
  static const Widget w12 = SizedBox(width: 12);
  static const Widget w16 = SizedBox(width: 16);
  static const Widget w24 = SizedBox(width: 24);

  static const Widget h4 = SizedBox(height: 4);
  static const Widget h8 = SizedBox(height: 8);
  static const Widget h12 = SizedBox(height: 12);
  static const Widget h16 = SizedBox(height: 16);
  static const Widget h24 = SizedBox(height: 24);
  static const Widget h32 = SizedBox(height: 32);

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
}
