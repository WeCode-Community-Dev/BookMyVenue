import 'package:flutter/material.dart';

enum ButtonType { primary, success, warning, destructive, secondary, disabled }

enum ButtonSize { small, medium, large }

class AppButton extends StatelessWidget {
  const AppButton({
    required this.label,
    this.onPressed,
    this.type = ButtonType.primary,
    this.size = ButtonSize.medium,
    super.key,
    this.isLoading = false,
  });
  final String label;
  final VoidCallback? onPressed;
  final ButtonType type;
  final ButtonSize size;
  final bool isLoading;

  // Helper to get colors from the current theme
  Color _getBackgroundColor(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme colorScheme = theme.colorScheme;

    // For custom colors (success/warning) we access our ThemeExtension
    // If you haven't set up the extension yet, you can fallback to colorScheme
    switch (type) {
      case ButtonType.primary:
        return colorScheme.primary;
      case ButtonType.success:
        return const Color(0xFF4CAF50); // Or use custom theme extension
      case ButtonType.warning:
        return const Color(0xFFFFA000);
      case ButtonType.destructive:
        return colorScheme.error;
      case ButtonType.secondary:
        return Colors.transparent;
      case ButtonType.disabled:
        return theme.disabledColor;
    }
  }

  Color _getTextColor(BuildContext context) {
    if (type == ButtonType.secondary) {
      return Theme.of(context).colorScheme.primary;
    }
    if (type == ButtonType.disabled) {
      return Theme.of(context).hintColor;
    }
    return Colors.white; // Standard for filled buttons
  }

  double get _height {
    switch (size) {
      case ButtonSize.small:
        return 36;
      case ButtonSize.medium:
        return 48;
      case ButtonSize.large:
        return 60;
    }
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final TextStyle? textStyle = theme.textTheme.labelLarge?.copyWith(
      fontWeight: FontWeight.bold,
      fontSize: size == ButtonSize.large ? 18 : 16,
    );

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double width = isLoading ? 50 : constraints.maxWidth;
        return Center(
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
            height: _height,
            width: width,

            child: ElevatedButton(
              onPressed: isLoading ? null : onPressed,
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.zero,
                backgroundColor: _getBackgroundColor(context),
                foregroundColor: _getTextColor(context),
                elevation: type == ButtonType.secondary ? 0 : 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: type == ButtonType.secondary
                      ? BorderSide(color: Theme.of(context).colorScheme.primary)
                      : BorderSide.none,
                ),
              ),
              child: AnimatedSwitcher(
                duration: const Duration(seconds: 1),
                transitionBuilder: (Widget child, Animation<double> animation) {
                  return FadeTransition(
                    opacity: animation,
                    child: SizeTransition(
                      sizeFactor: animation,
                      axis: Axis.horizontal,
                      child: child,
                    ),
                  );
                },
                child: isLoading
                    ? Center(
                        child: SizedBox(
                          key: const ValueKey<String>('loader'),
                          height: 24,
                          width: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              theme.colorScheme.primary,
                            ),
                          ),
                        ),
                      )
                    : Center(
                        child: Text(
                          label,
                          style: textStyle?.copyWith(
                            color: _getTextColor(context),
                          ),
                        ),
                      ),
              ),
            ),
          ),
        );
      },
    );
  }
}
