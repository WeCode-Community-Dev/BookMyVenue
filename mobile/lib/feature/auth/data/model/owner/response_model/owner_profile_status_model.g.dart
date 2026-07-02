// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'owner_profile_status_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OwnerProfileStatusModel _$OwnerProfileStatusModelFromJson(
  Map<String, dynamic> json,
) => _OwnerProfileStatusModel(
  ownerId: json['owner_id'] as String,
  statusMessage: json['status_message'] as String,
  statusCode: (json['status_code'] as num).toInt(),
  rejectReason: json['reject_reason'] as String?,
  approvalStatus: $enumDecode(_$ApprovalStatusEnumMap, json['approval_status']),
);

Map<String, dynamic> _$OwnerProfileStatusModelToJson(
  _OwnerProfileStatusModel instance,
) => <String, dynamic>{
  'owner_id': instance.ownerId,
  'status_message': instance.statusMessage,
  'status_code': instance.statusCode,
  'reject_reason': instance.rejectReason,
  'approval_status': _$ApprovalStatusEnumMap[instance.approvalStatus]!,
};

const _$ApprovalStatusEnumMap = {
  ApprovalStatus.pending: 'pending',
  ApprovalStatus.approved: 'approved',
  ApprovalStatus.rejected: 'rejected',
  ApprovalStatus.suspended: 'suspended',
};
