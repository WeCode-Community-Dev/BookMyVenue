import 'notification_model.dart';

abstract class NotificationService {
  Future<void> initialize();

  Future<void> showNotification(LocalNotification notification);

  Future<void> cancelNotification(int id);

  Future<void> cancelAllNotifications();
}
