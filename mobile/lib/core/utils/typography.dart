import 'package:flutter/material.dart';

class AppTypography {
  AppTypography._();

  static const TextStyle headerText = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.w600,
    height: 1.4,
  );

  /// 18px - SemiBold
  /// Used for:
  /// - Screen titles
  /// - Primary card headings
  static const TextStyle headingLarge = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    height: 1.4,
  );

  /// 16px - SemiBold
  /// Used for:
  /// - Screen titles medium
  /// - card titles
  static const TextStyle headingMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    height: 1.4,
  );

  /// 14px - Medium
  /// Used for:
  /// - Campaign titles
  /// - Important labels
  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    height: 1.4,
  );

  /// 12px - Medium
  /// Used for:
  /// - Category tags
  /// - Secondary emphasis text
  static const TextStyle labelMedium = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w500,
    height: 1.3,
  );

  /// 12px - Medium
  /// Used for:
  /// - Category tags
  /// - Secondary emphasis text
  static const TextStyle labelSmall = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 1.3,
  );

  /// 10px - Medium
  /// Used for:
  /// - Small highlighted labels
  /// - Status text
  static const TextStyle captionMedium = TextStyle(
    fontSize: 10,
    fontWeight: FontWeight.w500,
    height: 1.3,
  );

  /// 10px - Regular
  /// Used for:
  /// - Supporting information
  /// - Metadata
  static const TextStyle captionRegular = TextStyle(
    fontSize: 10,
    fontWeight: FontWeight.w400,

    height: 1.3,
  );
}
