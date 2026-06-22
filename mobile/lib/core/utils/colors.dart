// app_colors.dart

import 'package:flutter/material.dart';

import '../../main.dart';
import 'ui/app_commands.dart';

class AppColors {
  static bool get _isDark {
    final BuildContext? context = AppCommands.navigatorKey.currentContext;
    if (context == null) {
      return false;
    }
    try {
      return themeNotifier.value == ThemeMode.dark;
    } catch (_) {
      return false;
    }
  }

  // Brand colors
  static const Color primary = Color(0xFFE63946); // Coral-red for key actions
  static const Color primaryDark = Color(
    0xFFB7102A,
  ); // Rich red for hover/focus
  static Color get secondary => _isDark
      ? const Color(0xFF94A3B8)
      : const Color(0xFF1D3557); // Deep navy for headings/nav vs slate-400
  static Color get secondaryLight =>
      _isDark ? const Color(0xFF64748B) : const Color(0xFF485F84); // Muted blue
  static Color get success => _isDark
      ? const Color(0xFF34D399)
      : const Color(0xFF065F46); // Rich emerald green for verification
  static Color get successBg => _isDark
      ? const Color(0xFF064E3B)
      : const Color(0xFFD1FAE5); // Light emerald green tint
  static Color get warningBg => _isDark
      ? const Color(0xFF78350F)
      : const Color(0xFFFEF3C7); // Light amber tint
  static Color get warningText => _isDark
      ? const Color(0xFFFBBF24)
      : const Color(0xFFD97706); // Dark amber text
  static Color get error =>
      _isDark ? const Color(0xFFF87171) : const Color(0xFFBA1A1A); // Red error
  static Color get errorBg => _isDark
      ? const Color(0xFF7F1D1D)
      : const Color(0xFFFFDAD6); // Light red error tint

  // Neutral surfaces (Tonal Layers)
  static Color get background => _isDark
      ? const Color(0xFF0F172A)
      : const Color(0xFFF7F9FB); // Level 0 background
  static Color get surface => _isDark
      ? const Color(0xFF1E293B)
      : const Color(0xFFFFFFFF); // Level 1 surface card
  static Color get surfaceLow => _isDark
      ? const Color(0xFF334155)
      : const Color(0xFFF2F4F6); // Level 2 low container
  static Color get surfaceContainer => _isDark
      ? const Color(0xFF1E293B)
      : const Color(0xFFECEEF0); // Level 3 standard container
  static Color get surfaceHigh => _isDark
      ? const Color(0xFF334155)
      : const Color(0xFFE6E8EA); // Level 4 high container
  static Color get surfaceHighest => _isDark
      ? const Color(0xFF475569)
      : const Color(0xFFE0E3E5); // Level 5 highest container

  // Border colors
  static Color get outline => _isDark
      ? const Color(0xFF334155)
      : const Color(0xFFE2E8F0); // Subtle card outline
  static const Color outlineFocus = Color(0xFFE63946); // Focus outline color

  // Text colors
  static const Color textPrimary = Color(0xFF111827);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color darkTextPrimary = Color(0xFFF9FAFB);
  static const Color darkTextSecondary = Color(0xFFD1D5DB);
  static Color get onSurface => _isDark
      ? const Color(0xFFF8FAFC)
      : const Color(0xFF191C1E); // Dark charcoal for primary body/headings
  static Color get onSurfaceVariant => _isDark
      ? const Color(0xFFCBD5E1)
      : const Color(0xFF5B403F); // Warm brownish-grey for subtitles
  static const Color onPrimary = Color(0xFFFFFFFF); // White text on buttons
  static const Color onSecondary = Color(
    0xFFFFFFFF,
  ); // White text on navy buttons
}

// class UserColors {
//   static bool get _isDark {
//     final BuildContext? context = AppCommands.navigatorKey.currentContext;
//     if (context == null) {
//       return false;
//     }
//     try {
//       return themeNotifier.value == ThemeMode.dark;
//     } catch (_) {
//       return false;
//     }
//   }

//   static const Color primary = Color(0xFFE63946); // Coral-red primary
//   static Color get primaryLight => _isDark
//       ? const Color(0xFFFF6B7A)
//       : const Color(0xFFFF5E6C); // Lighter red accent
//   static Color get secondary => _isDark
//       ? const Color(0xFF94A3B8)
//       : const Color(0xFF1D3557); // Deep navy/dark blue
//   static Color get success => _isDark
//       ? const Color(0xFF34D399)
//       : const Color(0xFF065F46); // Emerald success
//   static Color get successBg =>
//       _isDark ? const Color(0xFF064E3B) : const Color(0xFFD1FAE5); // Emerald bg
//   static Color get warningBg =>
//       _isDark ? const Color(0xFF78350F) : const Color(0xFFFEF3C7); // Amber bg
//   static Color get warningText =>
//       _isDark ? const Color(0xFFFBBF24) : const Color(0xFFD97706); // Amber text
//   static Color get error =>
//       _isDark ? const Color(0xFFF87171) : const Color(0xFFBA1A1A); // Red error
//   static Color get errorBg => _isDark
//       ? const Color(0xFF7F1D1D)
//       : const Color(0xFFFFDAD6); // Red error bg

//   // Neutral surfaces
//   static Color get background => _isDark
//       ? const Color(0xFF0F172A)
//       : const Color(0xFFFDF8F8); // Subtle pinkish-white background
//   static Color get surface => _isDark
//       ? const Color(0xFF1E293B)
//       : const Color(0xFFFFFFFF); // White container
//   static Color get surfaceLow => _isDark
//       ? const Color(0xFF334155)
//       : const Color(0xFFFFF1F2); // Very light rose/pink container
//   static Color get surfaceContainer => _isDark
//       ? const Color(0xFF1E293B)
//       : const Color(0xFFECEEF0); // Standard container border
//   static Color get outline => _isDark
//       ? const Color(0xFF334155)
//       : const Color(0xFFE2E8F0); // Subtle card outline

//   // Text colors
//   static Color get onSurface => _isDark
//       ? const Color(0xFFF8FAFC)
//       : const Color(0xFF0F172A); // Slate-900 primary text
//   static Color get onSurfaceVariant => _isDark
//       ? const Color(0xFFCBD5E1)
//       : const Color(0xFF475569); // Slate-600 secondary text
//   static const Color onPrimary = Color(0xFFFFFFFF); // White text on buttons
// }
