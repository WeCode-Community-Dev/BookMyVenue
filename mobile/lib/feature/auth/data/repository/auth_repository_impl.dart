import '../../../../core/model/api_response.dart';
import '../../../../core/network/base_repository.dart';
import '../../../../core/utils/type_def.dart';
import '../../domain/entity/user_entity.dart';
import '../../domain/params/otp_param.dart';
import '../../domain/repository/i_auth_repository.dart';
import '../datasource/auth_local_datasource.dart';
import '../datasource/i_auth_remote_datasource.dart';
import '../mapper/auth_user_mapper.dart';
import '../model/request_model/otp_request/otp_request.dart';
import '../model/request_model/verify_otp_request/verify_otp_request.dart';
import '../model/response_model/otp_response/otp_response.dart';
import '../model/response_model/verify_otp_response/verify_otp_response.dart';

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
  ResultFuture<VerifyOtpRequestResult> verifyOtp({
    required VerifyOtpRequestParams params,
  }) async {
    return handleRequest(() async {
      final VerifyOtpRequest request = VerifyOtpRequest(
        mobileNumber: params.mobileNumber,
        otp: params.otp,
      );
      final ApiResponse<VerifyOtpResponse> response = await remoteDataSource
          .verifyOtp(request);

      if (response.data != null) {
        await localDatasource.saveToken(response.data!);
      }
      final VerifyOtpRequestResult result = VerifyOtpRequestResult(
        result: response.data!.toEntity(),
        message: response.message ?? '',
      );

      return result;
    });
  }
}
