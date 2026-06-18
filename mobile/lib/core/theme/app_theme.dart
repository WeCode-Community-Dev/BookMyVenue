import 'package:flutter/material.dart';

import '../utils/colors.dart';
import '../utils/shape_constants.dart';
import '../utils/typography.dart';

class AppTheme {
  AppTheme._();

  static ThemeData get lightTheme => _theme(false);

  static ThemeData get darkTheme => _theme(true);

  static ThemeData _theme(bool isDark) {
    final Color currentBg = isDark
        ? const Color(0xFF0F172A)
        : const Color(0xFFF7F9FB);

    final Color currentSurface = isDark
        ? const Color(0xFF1E293B)
        : Colors.white;

    final Color currentOnSurface = isDark
        ? const Color(0xFFF8FAFC)
        : const Color(0xFF191C1E);

    final Color currentOutline = isDark
        ? const Color(0xFF334155)
        : const Color(0xFFE2E8F0);

    return ThemeData(
      useMaterial3: true,
      brightness: isDark ? Brightness.dark : Brightness.light,

      /// Global Font Family
      fontFamily: 'Inter',

      colorScheme: ColorScheme(
        brightness: isDark ? Brightness.dark : Brightness.light,

        primary: AppColors.primary,
        onPrimary: AppColors.onPrimary,

        secondary: AppColors.secondary,
        onSecondary: AppColors.onSecondary,

        error: AppColors.error,
        onError: Colors.white,

        surface: currentSurface,
        onSurface: currentOnSurface,

        background: currentBg,
        onBackground: currentOnSurface,
      ),

      scaffoldBackgroundColor: currentBg,

      textTheme: TextTheme(
        headlineLarge: AppTypography.headerText.copyWith(
          color: currentOnSurface,
        ),

        headlineMedium: AppTypography.headingLarge.copyWith(
          color: currentOnSurface,
        ),

        headlineSmall: AppTypography.headingMedium.copyWith(
          color: currentOnSurface,
        ),

        bodyLarge: AppTypography.bodyMedium.copyWith(color: currentOnSurface),

        bodyMedium: AppTypography.labelMedium.copyWith(
          color: isDark ? const Color(0xFFCBD5E1) : AppColors.onSurfaceVariant,
        ),

        labelLarge: AppTypography.labelSmall.copyWith(
          color: isDark ? const Color(0xFF94A3B8) : AppColors.secondaryLight,
        ),
      ),

      appBarTheme: AppBarTheme(
        elevation: 0,
        centerTitle: false,
        backgroundColor: currentBg,
        foregroundColor: currentOnSurface,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: AppTypography.headingLarge.copyWith(
          color: currentOnSurface,
        ),
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: currentSurface,

        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),

        border: OutlineInputBorder(
          borderRadius: AppShapes.defaultBorder,
          borderSide: BorderSide(color: currentOutline),
        ),

        enabledBorder: OutlineInputBorder(
          borderRadius: AppShapes.defaultBorder,
          borderSide: BorderSide(color: currentOutline),
        ),

        focusedBorder: OutlineInputBorder(
          borderRadius: AppShapes.defaultBorder,
          borderSide: const BorderSide(color: AppColors.primary),
        ),

        errorBorder: OutlineInputBorder(
          borderRadius: AppShapes.defaultBorder,
          borderSide: BorderSide(color: AppColors.error),
        ),

        focusedErrorBorder: OutlineInputBorder(
          borderRadius: AppShapes.defaultBorder,
          borderSide: BorderSide(color: AppColors.error),
        ),

        labelStyle: AppTypography.labelMedium.copyWith(
          color: isDark ? const Color(0xFFCBD5E1) : AppColors.onSurfaceVariant,
        ),

        hintStyle: AppTypography.bodyMedium.copyWith(
          color: (isDark ? const Color(0xFFCBD5E1) : AppColors.onSurfaceVariant)
              .withValues(alpha: 0.6),
        ),
      ),

      cardTheme: CardThemeData(
        color: currentSurface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: AppShapes.defaultBorder,
          side: BorderSide(color: currentOutline),
        ),
      ),

      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          elevation: 0,
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(borderRadius: AppShapes.defaultBorder),
          textStyle: AppTypography.bodyMedium.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(borderRadius: AppShapes.defaultBorder),
          textStyle: AppTypography.bodyMedium.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      dividerTheme: DividerThemeData(
        color: currentOutline,
        thickness: 1,
        space: 1,
      ),

      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: currentSurface,
        surfaceTintColor: Colors.transparent,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
      ),
    );
  }
}
