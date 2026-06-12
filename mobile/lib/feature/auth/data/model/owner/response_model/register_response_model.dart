import 'package:freezed_annotation/freezed_annotation.dart';

part 'register_response_model.freezed.dart';
part 'register_response_model.g.dart';

@freezed
sealed class RegisterDataModel with _$RegisterDataModel {
  const factory RegisterDataModel({
    @JsonKey(name: 'full_name') required String fullName,
    required String email,
    @JsonKey(name: 'mobile_number') required String mobileNumber,
    required String otp,
    @JsonKey(name: 'expires_in_seconds') required int expiresInSeconds,
    required String message,
  }) = _RegisterDataModel;

  factory RegisterDataModel.fromJson(Map<String, dynamic> json) =>
      _$RegisterDataModelFromJson(json);
}
