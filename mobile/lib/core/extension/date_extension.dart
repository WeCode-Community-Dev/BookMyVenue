import 'package:intl/intl.dart';

extension DateTimeX on DateTime {
  /// Jun 19, 2026
  String get mmmDdYyyy => DateFormat('MMM d, yyyy').format(this);

  /// June 19, 2026
  String get mmmmDdYyyy => DateFormat('MMMM d, yyyy').format(this);

  /// 19 Jun 2026
  String get ddMmmYyyy => DateFormat('dd MMM yyyy').format(this);

  /// 19 June 2026
  String get ddMmmmYyyy => DateFormat('dd MMMM yyyy').format(this);

  /// 19/06/2026
  String get ddMmYyyy => DateFormat('dd/MM/yyyy').format(this);

  /// 06/19/2026
  String get mmDdYyyy => DateFormat('MM/dd/yyyy').format(this);

  /// 2026-06-19
  String get yyyyMmDd => DateFormat('yyyy-MM-dd').format(this);

  /// 11:30 AM
  String get hhMmA => DateFormat('hh:mm a').format(this);

  /// 11:30:45 AM
  String get hhMmSsA => DateFormat('hh:mm:ss a').format(this);

  /// Jun 19, 2026 • 11:30 AM
  String get mmmDdYyyyWithTime =>
      DateFormat('MMM d, yyyy • hh:mm a').format(this);

  /// June 19, 2026 • 11:30 AM
  String get mmmmDdYyyyWithTime =>
      DateFormat('MMMM d, yyyy • hh:mm a').format(this);

  /// 2 days ago
  String get timeAgo {
    final Duration difference = DateTime.now().difference(this);

    if (difference.inSeconds < 60) {
      return 'Just now';
    }

    if (difference.inMinutes < 60) {
      return '${difference.inMinutes} min ago';
    }

    if (difference.inHours < 24) {
      return '${difference.inHours} hr ago';
    }

    if (difference.inDays < 30) {
      return '${difference.inDays} day ago${difference.inDays > 1 ? 's' : ''}';
    }

    if (difference.inDays < 365) {
      return '${(difference.inDays / 30).floor()} month ago${(difference.inDays / 30).floor() > 1 ? 's' : ''}';
    }

    return '${(difference.inDays / 365).floor()} year ago${(difference.inDays / 365).floor() > 1 ? 's' : ''}';
  }
}
