// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'image_upload_response_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ImageUploadResponseModel _$ImageUploadResponseModelFromJson(
  Map<String, dynamic> json,
) => _ImageUploadResponseModel(
  publicId: json['public_id'] as String,
  url: json['url'] as String,
  originalFilename: json['original_filename'] as String,
  width: (json['width'] as num).toInt(),
  height: (json['height'] as num).toInt(),
  format: json['format'] as String,
  bytes: (json['bytes'] as num).toInt(),
);

Map<String, dynamic> _$ImageUploadResponseModelToJson(
  _ImageUploadResponseModel instance,
) => <String, dynamic>{
  'public_id': instance.publicId,
  'url': instance.url,
  'original_filename': instance.originalFilename,
  'width': instance.width,
  'height': instance.height,
  'format': instance.format,
  'bytes': instance.bytes,
};
