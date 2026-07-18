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
        style = Theme.of(context).textTheme.headlineLarge;
        break;

      case TextVariant.headingLarge:
        style = Theme.of(context).textTheme.headlineMedium;
        break;

      case TextVariant.headingMedium:
        style = Theme.of(context).textTheme.headlineSmall;
        break;

      case TextVariant.bodyMedium:
        style = Theme.of(context).textTheme.bodyLarge;
        break;

      case TextVariant.labelMedium:
        style = Theme.of(context).textTheme.bodyMedium;
        break;

      case TextVariant.labelSmall:
        style = Theme.of(context).textTheme.labelLarge;
        break;

      case TextVariant.captionRegular:
        style = AppTypography.captionRegular.copyWith(
          color: Theme.of(context).colorScheme.onSurface,
        );
        break;

      case TextVariant.captionMedium:
        style = AppTypography.captionMedium.copyWith(
          color: Theme.of(context).colorScheme.onSurface,
        );
        break;
    }

    return Text(
      text,
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
      style: style!.copyWith(
        color: color,
        fontWeight: fontWeight,
        decoration: decoration,
      ),
    );
  }
}
