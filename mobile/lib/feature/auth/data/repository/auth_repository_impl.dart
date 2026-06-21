import '../../../../core/auth/auth_session.dart';
import '../../../../core/auth/auth_session_model.dart';
import '../../../../core/di/injection.dart';
import '../../../../core/logger/app_logger.dart';
import '../../../../core/model/api_response.dart';
import '../../../../core/network/base_repository.dart';
import '../../../../core/storage/secure_storage_service.dart';
import '../../../../core/utils/type_def.dart';
import '../../domain/entity/owner_entity.dart';
import '../../domain/entity/user_entity.dart';
import '../../domain/enums/approval_status.dart';
import '../../domain/params/auth_param.dart';
import '../../domain/repository/i_auth_repository.dart';
import '../datasource/auth_local_datasource.dart';
import '../datasource/i_auth_remote_datasource.dart';
import '../mapper/auth_owner_mapper.dart';
import '../mapper/auth_user_mapper.dart';
import '../model/owner/reqeust_model/register_request_model.dart';
import '../model/owner/response_model/register_response_model.dart';
import '../model/user/request_model/otp_request/otp_request.dart';
import '../model/user/request_model/verify_otp_request/verify_otp_request.dart';
import '../model/user/response_model/otp_response/otp_response.dart';
import '../model/user/response_model/verify_otp_response/verify_otp_response.dart';

class AuthRepositoryImpl extends BaseRepository implements IAuthRepository {
  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDatasource,
  });
  final IAuthRemoteDatasource remoteDataSource;
  final IAuthLocalDatasource localDatasource;
  @override
  ResultFuture<OtpResponseResult> requestOtp({
    required OtpRequestParams params,
  }) {
    return handleRequest(() async {
      final OtpRequest request = OtpRequest(mobileNumber: params.mobileNumber);
      final ApiResponse<OtpResponse> response = await remoteDataSource
          .requestOtp(request);

      return OtpResponseResult(
        user: response.data!.toEntity(),
        message: response.message ?? '',
      );
    });
  }

  @override
  ResultFuture<VerifyOtpResponseResult> verifyOtp({
    required VerifyOtpRequestParams params,
  }) {
    return handleRequest(() async {
      final VerifyOtpRequest request = VerifyOtpRequest(
        mobileNumber: params.mobileNumber,
        otp: params.otp,
      );
      final ApiResponse<VerifyOtpResponse> response = await remoteDataSource
          .verifyOtp(request);

      if (response.data != null) {
        final AuthSessionModel sessionModel = AuthSessionModel(
          accessToken: response.data!.accessToken,
          refreshToken: response.data!.refreshToken,
          role: response.data!.user.role,
        );
        await localDatasource.saveToken(sessionModel);
      }
      final VerifyOtpResponseResult result = VerifyOtpResponseResult(
        result: response.data!.toEntity(),
        message: response.message ?? '',
      );

      return result;
    });
  }
}

class OwnerAuthRepositoryImpl extends BaseRepository
    implements IOwnerAuthRepository {
  OwnerAuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDatasource,
  });

  final IAuthOwnerDataSource remoteDataSource;
  final IAuthLocalDatasource localDatasource;

  @override
  ResultFuture<RegisterResponseResult> registerAccount({
    required OwnerRegisterParams params,
  }) {
    return handleRequest(() async {
      final OwnerRegisterRequest request = OwnerRegisterRequest(
        fullName: params.fullName,
        businessName: params.businessName,
        email: params.email,
        mobileNumber: params.mobileNumber,
        password: params.password,
      );
      final ApiResponse<RegisterResponseModel> response = await remoteDataSource
          .registerAccount(request);

      return RegisterResponseResult(
        user: response.data!.toEntity(),
        message: response.message ?? '',
      );
    });
  }

  @override
  ResultFuture<VerifyOwnerOtpResponseResult> verifyOtp({
    required VerifyOwnerOtpParams params,
  }) {
    return handleRequest(() async {
      final VerifyOwnerOtpRequest request = VerifyOwnerOtpRequest(
        mobileNumber: params.mobileNumber,
        otp: params.otp,
      );
      final ApiResponse<VerifyOwnerOtpResponseModel> response =
          await remoteDataSource.verifyOwnerOtp(request);

      if (response.data != null) {
        final AuthSessionModel sessionModel = AuthSessionModel(
          accessToken: response.data!.accessToken,
          refreshToken: response.data!.refreshToken,
          role: response.data!.user.role,
          status:
              response.data!.user.ownerProfile?.approvalStatus ??
              ApprovalStatus.pending,
        );
        await localDatasource.saveToken(sessionModel);
        await AuthSession.init();
      }

      return VerifyOwnerOtpResponseResult(
        user: response.data!.toEntity(),
        message: response.message ?? '',
      );
    });
  }

  @override
  ResultFuture<OwnerProfileResponseResult> getOwnerProfile() {
    return handleRequest(() async {
      final ApiResponse<UserModel> response = await remoteDataSource
          .getOwnerProfile();

      if (response.data != null) {
        AuthSessionModel? authSession = await sl<SecureStorageService>()
            .getSession();
        if (authSession != null) {
          authSession = authSession.copyWith(
            status: response.data?.ownerProfile?.approvalStatus,
          );
          await localDatasource.saveToken(authSession);
          await AuthSession.init();
        }
      }

      return OwnerProfileResponseResult(
        user: response.data!.toEntity(),
        message: response.message ?? '',
      );
    });
  }
}
