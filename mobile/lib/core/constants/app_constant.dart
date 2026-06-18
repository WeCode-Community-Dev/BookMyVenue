class AppConst {
  AppConst._();
  static const List<String> businessTypes = <String>[
    'Marriage Hall',
    'Party Hall',
    'Conference Room',
    'Auditorium',
    'Sports Ground',
    'Photography Studio',
  ];

  /*
  1. Marriage Hall or Auditorium ->
    Morning Session
    09:00 AM - 03:00 PM
    Evening Session
    05:00 PM - 11:00 PM
    Full Day
    09:00 AM - 11:00 PM 
  2. Party Hall ->
    2.1. slot (2 hours) 
    2.2. slot (4 hours) 
    2.2. slot (6 hours) 
    2.3. slot (8 hours) 
  3. Conference Room ->
    3.1.slot (2 hours)
    3.2 slot (4 hours)
    3.3 slot (6 hours)
    3.4 slot (8 hours)
    3.5 Full Day
  4. Sports Ground
    4.1. slot (1 hours)
    4.2. slot (2 hours)
    4.3. slot (3 Hours)
  5. Photography Studio
    5.1. slot (1 hours)
    5.2. slot (2 hours)
    5.3. slot (4 hours)
    5.4. slot (8 hours)
  */

  static const List<String> cancellationPolicy = <String>[
    'Flexible: Full refund 24 hours prior',
    'Moderate: Full refund 5 days prior',
    'Strict: No refunds within 7 days',
  ];

  /// Performance Dashboard Chart Values
  static const List<double> heights = <double>[
    0.4,
    0.55,
    0.75,
    0.6,
    0.85,
    1.0,
    0.7,
    0.65,
    0.9,
    0.8,
    0.75,
    0.85,
  ];
  static const List<String> months = <String>[
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
}
