import 'package:freezed_annotation/freezed_annotation.dart';

@JsonEnum()
enum UserRole {
  @JsonValue('customer')
  customer,

  @JsonValue('venue_owner')
  venueOwner,

  @JsonValue('admin')
  admin,
}
