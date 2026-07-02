import 'package:freezed_annotation/freezed_annotation.dart';
import '../../../../domain/enums/approval_status.dart';

part 'owner_profile_status_model.freezed.dart';
part 'owner_profile_status_model.g.dart';

@freezed
sealed class OwnerProfileStatusModel with _$OwnerProfileStatusModel {
  const factory OwnerProfileStatusModel({
    @JsonKey(name: 'owner_id') required String ownerId,
    @JsonKey(name: 'approval_status') required ApprovalStatus approvalStatus,
  }) = _OwnerProfileStatusModel;

  factory OwnerProfileStatusModel.fromJson(Map<String, dynamic> json) =>
      _$OwnerProfileStatusModelFromJson(json);
}
