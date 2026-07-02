// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'owner_profile_status_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OwnerProfileStatusModel _$OwnerProfileStatusModelFromJson(
  Map<String, dynamic> json,
) => _OwnerProfileStatusModel(
  ownerId: json['owner_id'] as String,
  approvalStatus: $enumDecode(_$ApprovalStatusEnumMap, json['approval_status']),
);

Map<String, dynamic> _$OwnerProfileStatusModelToJson(
  _OwnerProfileStatusModel instance,
) => <String, dynamic>{
  'owner_id': instance.ownerId,
  'approval_status': _$ApprovalStatusEnumMap[instance.approvalStatus]!,
};

const _$ApprovalStatusEnumMap = {
  ApprovalStatus.pending: 'pending',
  ApprovalStatus.approved: 'approved',
  ApprovalStatus.rejected: 'rejected',
  ApprovalStatus.suspended: 'suspended',
};
