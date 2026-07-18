import 'regex_patterns.dart';
import 'validation_messages.dart';

class AppValidation {
  AppValidation._();

  static String? validateEmptyField(String? value, String text) {
    if (value == null || value.isEmpty) {
      return '$text${ValidationMessages.requiredField}';
    }

    return null;
  }

  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return ValidationMessages.emailRequired;
    }

    if (value.length > 50) {
      return ValidationMessages.emailTooLong;
    }

    if (!RegexPatterns.email.hasMatch(value)) {
      return ValidationMessages.invalidEmail;
    }

    return null;
  }

  static String? validateMobile(String? value) {
    if (value == null || value.isEmpty) {
      return ValidationMessages.mobileRequired;
    }

    if (value.length < 10) {
      return ValidationMessages.mobileLength;
    }

    return null;
  }

  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return ValidationMessages.passwordRequired;
    }

    if (value.length < 6) {
      return ValidationMessages.passwordTooShort;
    }

    if (value.length > 25) {
      return ValidationMessages.passwordTooLong;
    }

    return null;
  }

  static String? validateFullname(String? value) {
    if (value == null || value.isEmpty) {
      return ValidationMessages.fullnameRequired;
    }

    if (value.length < 3) {
      return ValidationMessages.fullnameTooShort;
    }

    if (value.length > 25) {
      return ValidationMessages.fullnameTooLong;
    }

    return null;
  }

  static String? validateBusinessName(String? value) {
    if (value == null || value.isEmpty) {
      return ValidationMessages.businessNameRequired;
    }

    if (value.length < 3) {
      return ValidationMessages.businessNameTooLong;
    }

    if (value.length > 25) {
      return ValidationMessages.businessNameTooLong;
    }

    return null;
  }

  static String? validateVenueName(String? value) {
    if (value == null || value.isEmpty) {
      return ValidationMessages.venueNameRequired;
    }

    if (value.length < 3) {
      return ValidationMessages.venueNameTooShort;
    }

    if (value.length > 50) {
      return ValidationMessages.venueNameTooLong;
    }

    return null;
  }
}
