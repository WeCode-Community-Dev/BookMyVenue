class RegexPatterns {
  RegexPatterns._();
  static final RegExp email = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
}
