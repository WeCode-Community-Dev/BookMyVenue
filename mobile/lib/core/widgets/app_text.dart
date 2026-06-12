import 'package:flutter/material.dart';

import '../utils/typography.dart';

enum TextVariant {
  headerText,
  headingLarge,
  headingMedium,
  bodyMedium,
  labelMedium,
  labelSmall,
  captionRegular,
  captionMedium,
}

class AppText extends StatelessWidget {
  const AppText(
    this.text, {
    super.key,
    this.variant = TextVariant.bodyMedium,
    this.color,
    this.textAlign,
    this.fontWeight,
    this.overflow,
    this.maxLines,
    this.decoration,
  });
  final String text;
  final TextVariant variant;
  final Color? color;
  final TextAlign? textAlign;
  final FontWeight? fontWeight;
  final TextOverflow? overflow;
  final int? maxLines;
  final TextDecoration? decoration;

  @override
  Widget build(BuildContext context) {
    TextStyle? style;

    switch (variant) {
      case TextVariant.headerText:
        style = AppTypography.headerText;
        break;
      case TextVariant.headingLarge:
        style = AppTypography.headingLarge;
        break;
      case TextVariant.headingMedium:
        style = AppTypography.headingMedium;
        break;

      case TextVariant.bodyMedium:
        style = AppTypography.bodyMedium;
        break;

      case TextVariant.labelMedium:
        style = AppTypography.labelMedium;
        break;
      case TextVariant.labelSmall:
        style = AppTypography.labelSmall;
        break;

      case TextVariant.captionRegular:
        style = AppTypography.captionRegular;
        break;

      case TextVariant.captionMedium:
        style = AppTypography.captionMedium;
        break;
    }

    return Text(
      text,
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
      style: style.copyWith(
        color: color,
        fontWeight: fontWeight,
        decoration: decoration,
      ),
    );
  }
}
