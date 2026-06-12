import '../../domain/entity/owner_entity.dart';
import '../model/owner/response_model/register_response_model.dart';

extension RegisterDataMapper on RegisterDataModel {
  RegisterDataEntity toEntity() {
    return RegisterDataEntity(
      fullName: fullName,
      email: email,
      mobileNumber: mobileNumber,
      otp: otp,
      expiresInSeconds: expiresInSeconds,
      message: message,
    );
  }
}
