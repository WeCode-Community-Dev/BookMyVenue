import '../../domain/entity/image_upload_entity.dart';
import '../model/response_model/image_upload_response/image_upload_response_model.dart';

extension ImageUploadResponseMapper on ImageUploadResponseModel {
  UploadedImageEntity toEntity() {
    return UploadedImageEntity(
      publicId: publicId,
      url: url,
      originalFilename: originalFilename,
      width: width,
      height: height,
      format: format,
      bytes: bytes,
    );
  }
}
