import 'package:flutter/material.dart';

import 'app_commands.dart';

enum ToastType { success, error, info, warning }

class SnackbarCommand {
  static final GlobalKey<ScaffoldMessengerState> messengerKey =
      AppCommands.messengerKey;

  static void show({
    required ToastType type,
    required String title,
    String? label,
    String? description,
    String? actionText,
    VoidCallback? onAction,
    Duration duration = const Duration(seconds: 3),
  }) {
    final SnackBar snackBar = SnackBar(
      behavior: SnackBarBehavior.floating,
      backgroundColor: Colors.transparent,
      elevation: 0,
      duration: duration,
      content: AppToast(
        type: type,
        title: title,
        label: label,
        description: description,
        actionText: actionText,
        onAction: onAction,
      ),
    );

    messengerKey.currentState
      ?..hideCurrentSnackBar()
      ..showSnackBar(snackBar);
  }
}

class AppToast extends StatelessWidget {
  const AppToast({
    super.key,
    required this.type,
    required this.title,
    this.label,
    this.description,
    this.actionText,
    this.onAction,
  });
  final ToastType type;
  final String title;
  final String? label;
  final String? description;
  final String? actionText;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    final ToastStyle style = ToastStyles.of(type);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: style.background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: style.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Icon(style.icon, color: style.iconColor, size: 22),
          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),

                if (label != null) ...<Widget>[
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.surface.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(label!, style: const TextStyle(fontSize: 12)),
                  ),
                ],

                if (description != null) ...<Widget>[
                  const SizedBox(height: 6),
                  Text(
                    description!,
                    style: const TextStyle(fontSize: 13, color: Colors.black54),
                  ),
                ],
              ],
            ),
          ),

          if (actionText != null)
            TextButton(onPressed: onAction, child: Text(actionText!)),
        ],
      ),
    );
  }
}

class ToastStyle {
  const ToastStyle({
    required this.background,
    required this.border,
    required this.icon,
    required this.iconColor,
  });
  final Color background;
  final Color border;
  final IconData icon;
  final Color iconColor;
}

class ToastStyles {
  static ToastStyle of(ToastType type) {
    switch (type) {
      case ToastType.success:
        return const ToastStyle(
          background: Color(0xFFEFFAF1),
          border: Color(0xFF2ECC71),
          icon: Icons.check_circle,
          iconColor: Color(0xFF2ECC71),
        );
      case ToastType.info:
        return const ToastStyle(
          background: Color(0xFFF2F6FF),
          border: Color(0xFF4C7EFF),
          icon: Icons.info,
          iconColor: Color(0xFF4C7EFF),
        );
      case ToastType.warning:
        return const ToastStyle(
          background: Color(0xFFFFF8E5),
          border: Color(0xFFF1C40F),
          icon: Icons.warning,
          iconColor: Color(0xFFF1C40F),
        );
      case ToastType.error:
        return const ToastStyle(
          background: Color(0xFFFFF1F0),
          border: Color(0xFFE74C3C),
          icon: Icons.error,
          iconColor: Color(0xFFE74C3C),
        );
    }
  }
}
