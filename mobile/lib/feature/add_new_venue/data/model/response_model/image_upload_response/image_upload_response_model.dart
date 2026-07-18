import 'package:freezed_annotation/freezed_annotation.dart';

part 'image_upload_response_model.freezed.dart';
part 'image_upload_response_model.g.dart';

@freezed
sealed class ImageUploadResponseModel with _$ImageUploadResponseModel {
  const factory ImageUploadResponseModel({
    @JsonKey(name: 'public_id') required String publicId,
    required String url,
    @JsonKey(name: 'original_filename') required String originalFilename,
    required int width,
    required int height,
    required String format,
    required int bytes,
  }) = _ImageUploadResponseModel;

  factory ImageUploadResponseModel.fromJson(Map<String, dynamic> json) =>
      _$ImageUploadResponseModelFromJson(json);
}
