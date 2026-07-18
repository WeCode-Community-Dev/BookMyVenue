import 'package:freezed_annotation/freezed_annotation.dart';

part 'owner_profile_model.freezed.dart';
part 'owner_profile_model.g.dart';

@freezed
sealed class OwnerProfileModel with _$OwnerProfileModel {
  const factory OwnerProfileModel({
    required String id,
    @JsonKey(name: 'mobile_number') required String mobileNumber,
    @JsonKey(name: 'full_name') required String fullName,
    required String email,
    @JsonKey(name: 'mobile_verified') required bool mobileVerified,
    @JsonKey(name: 'email_verified') required bool emailVerified,
    required String role,
    required String status,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
    @JsonKey(name: 'owner_profile') OwnerDetailModel? ownerProfile,
  }) = _OwnerProfileModel;

  factory OwnerProfileModel.fromJson(Map<String, dynamic> json) =>
      _$OwnerProfileModelFromJson(json);
}

@freezed
sealed class OwnerDetailModel with _$OwnerDetailModel {
  const factory OwnerDetailModel({
    required String id,
    @JsonKey(name: 'user_id') required String userId,
    @JsonKey(name: 'business_name') required String businessName,
    @JsonKey(name: 'approval_status') required String approvalStatus,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _OwnerDetailModel;

  factory OwnerDetailModel.fromJson(Map<String, dynamic> json) =>
      _$OwnerDetailModelFromJson(json);
}
