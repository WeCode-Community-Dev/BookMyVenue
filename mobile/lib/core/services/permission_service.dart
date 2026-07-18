import 'package:permission_handler/permission_handler.dart';

class PermissionService {
  const PermissionService._();

  /// Requests a single permission.
  static Future<bool> request(Permission permission) async {
    final PermissionStatus status = await permission.request();
    return status.isGranted;
  }

  /// Checks if a permission is already granted.
  static Future<bool> isGranted(Permission permission) async {
    return permission.isGranted;
  }

  /// Opens app settings.
  static Future<bool> openSettings() {
    return openAppSettings();
  }

  /// Requests multiple permissions.
  static Future<bool> requestMultiple(List<Permission> permissions) async {
    final Map<Permission, PermissionStatus> result = await permissions
        .request();

    return result.values.every((PermissionStatus status) => status.isGranted);
  }

  /// Location
  static Future<bool> requestLocation() {
    return request(Permission.location);
  }

  /// Camera
  static Future<bool> requestCamera() {
    return request(Permission.camera);
  }

  /// Photos / Gallery
  static Future<bool> requestPhotos() async {
    if (await Permission.photos.isGranted) {
      return true;
    }

    final PermissionStatus status = await Permission.photos.request();

    return status.isGranted || status.isLimited;
  }

  /// Storage (Android)
  static Future<bool> requestStorage() {
    return request(Permission.storage);
  }

  /// Notification
  static Future<bool> requestNotification() {
    return request(Permission.notification);
  }

  /// Microphone
  static Future<bool> requestMicrophone() {
    return request(Permission.microphone);
  }
}
