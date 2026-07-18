// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'add_new_venue_response_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AddNewVenueResponseModel _$AddNewVenueResponseModelFromJson(
  Map<String, dynamic> json,
) => _AddNewVenueResponseModel(
  id: json['id'] as String,
  venueName: json['venue_name'] as String,
  slug: json['slug'] as String,
  status: json['status'] as String,
  verificationStatus: json['verification_status'] as String,
);

Map<String, dynamic> _$AddNewVenueResponseModelToJson(
  _AddNewVenueResponseModel instance,
) => <String, dynamic>{
  'id': instance.id,
  'venue_name': instance.venueName,
  'slug': instance.slug,
  'status': instance.status,
  'verification_status': instance.verificationStatus,
};
