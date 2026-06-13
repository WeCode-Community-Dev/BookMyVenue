enum UserRole { customer, venueOwner, admin }

extension UserRoleX on UserRole {
  String get value {
    switch (this) {
      case UserRole.customer:
        return 'customer';
      case UserRole.venueOwner:
        return 'venue_owner';
      case UserRole.admin:
        return 'admin';
    }
  }

  static UserRole fromString(String value) {
    switch (value) {
      case 'customer':
        return UserRole.customer;
      case 'venue_owner':
        return UserRole.venueOwner;
      case 'admin':
        return UserRole.admin;
      default:
        throw ArgumentError('Unknown role: $value');
    }
  }
}
