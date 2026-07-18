import 'dart:developer' as developer;

enum LogType { debug, success, warning, error, info }

class AppLogger {
  ///
  /// BORDER STYLES
  ///
  static const String _topBorder =
      '╔══════════════════════════════════════════════════════════════════════════════╗';

  static const String _middleBorder =
      '╠══════════════════════════════════════════════════════════════════════════════╣';

  static const String _bottomBorder =
      '╚══════════════════════════════════════════════════════════════════════════════╝';

  ///
  /// MAIN LOGGER
  ///
  static void log(
    String message, {
    LogType type = LogType.debug,
    String tag = 'APP',
    Object? error,
    StackTrace? stackTrace,
  }) {
    final int level = _getLevel(type);

    final String emoji = _getEmoji(type);

    final String timestamp = DateTime.now().toIso8601String();

    final String formattedMessage =
        '''
$_topBorder
║  $emoji
$_middleBorder
║  🏷 TAG       : $tag
║  🕒 TIME      : $timestamp
║  📄 MESSAGE   :
║
${_formatMessage(message)}
${error != null ? '║\n║  ❌ ERROR     : $error' : ''}
${stackTrace != null ? '║\n║  📚 STACKTRACE:\n${_formatMessage(stackTrace.toString())}' : ''}
$_bottomBorder
''';

    developer.log(
      formattedMessage,
      name: tag,
      level: level,
      error: error,
      stackTrace: stackTrace,
    );
  }

  ///
  /// MESSAGE FORMATTER
  ///
  static String _formatMessage(String message) {
    final List<String> lines = message.split('\n');

    return lines.map((String line) => '║    $line').join('\n');
  }

  ///
  /// LEVELS
  ///
  static int _getLevel(LogType type) {
    switch (type) {
      case LogType.debug:
        return 500;

      case LogType.info:
        return 800;

      case LogType.success:
        return 850;

      case LogType.warning:
        return 900;

      case LogType.error:
        return 1000;
    }
  }

  ///
  /// EMOJIS
  ///
  static String _getEmoji(LogType type) {
    switch (type) {
      case LogType.debug:
        return '🐞 DEBUG';

      case LogType.info:
        return 'ℹ️ INFO';

      case LogType.success:
        return '✅ SUCCESS';

      case LogType.warning:
        return '⚠️ WARNING';

      case LogType.error:
        return '❌ ERROR';
    }
  }

  ///
  /// HELPERS
  ///
  static void debug(String message, {String tag = 'DEBUG'}) {
    log(message, tag: tag);
  }

  static void info(String message, {String tag = 'INFO'}) {
    log(message, type: LogType.info, tag: tag);
  }

  static void success(String message, {String tag = 'SUCCESS'}) {
    log(message, type: LogType.success, tag: tag);
  }

  static void warning(String message, {String tag = 'WARNING'}) {
    log(message, type: LogType.warning, tag: tag);
  }

  static void error(
    String message, {
    String tag = 'ERROR',
    Object? error,
    StackTrace? stackTrace,
  }) {
    log(
      message,
      type: LogType.error,
      tag: tag,
      error: error,
      stackTrace: stackTrace,
    );
  }
}
