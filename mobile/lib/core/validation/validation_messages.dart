class ValidationMessages {
  ValidationMessages._();
  // Email
  static const String emailRequired = 'Email is required';
  static const String emailTooLong = 'Email is too long';
  static const String invalidEmail = 'Please enter a valid email address';

  // Mobile
  static const String mobileRequired = 'Mobile number is required';
  static const String mobileLength = 'Mobile number must be 10 digits';

  // Password
  static const String passwordRequired = 'Password is required';
  static const String passwordTooShort =
      'Password must be at least 6 characters';
  static const String passwordTooLong = 'Password cannot exceed 25 characters';

  // Fullname
  static const String fullnameRequired = 'Fullname is required';
  static const String fullnameTooShort =
      'Fullname must be at least 3 characters';
  static const String fullnameTooLong = 'Fullname cannot exceed 25 characters';

  // Business name
  static const String businessNameRequired = 'Business name is required';
  static const String businessNameTooShort =
      'Business name must be at least 3 characters';
  static const String businessNameTooLong =
      'Business name cannot exceed 50 characters';
}
