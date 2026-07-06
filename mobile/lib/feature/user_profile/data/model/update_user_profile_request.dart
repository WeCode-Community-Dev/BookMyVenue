import 'package:freezed_annotation/freezed_annotation.dart';

part 'update_user_profile_request.freezed.dart';
part 'update_user_profile_request.g.dart';

@freezed
sealed class UpdateUserProfileRequest with _$UpdateUserProfileRequest {
  const factory UpdateUserProfileRequest({
    @JsonKey(name: 'full_name') required String fullName,
    required String email,
  }) = _UpdateUserProfileRequest;

  factory UpdateUserProfileRequest.fromJson(Map<String, dynamic> json) =>
      _$UpdateUserProfileRequestFromJson(json);
}
