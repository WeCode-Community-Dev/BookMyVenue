import 'package:freezed_annotation/freezed_annotation.dart';

import '../../feature/auth/domain/enums/approval_status.dart';
import '../../feature/auth/domain/enums/role_base.dart';

part 'auth_session_model.freezed.dart';
part 'auth_session_model.g.dart';

@freezed
abstract class AuthSessionModel with _$AuthSessionModel {
  const factory AuthSessionModel({
    required String accessToken,
    required String refreshToken,
    required UserRole role,
    ApprovalStatus? status,
    String? fullName,
  }) = _AuthSessionModel;

  factory AuthSessionModel.fromJson(Map<String, dynamic> json) =>
      _$AuthSessionModelFromJson(json);
}
