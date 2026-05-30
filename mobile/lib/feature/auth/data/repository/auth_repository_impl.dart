import 'package:fpdart/fpdart.dart';

import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/model/api_response.dart';
import '../../../../core/utils/type_def.dart';
import '../../domain/entity/user_entity.dart';
import '../../domain/params/otp_param.dart';
import '../../domain/repository/i_auth_repository.dart';
import '../datasource/i_auth_remote_datasource.dart';
import '../mapper/auth_user_mapper.dart';
import '../model/request_model/otp_request.dart';
import '../model/response_model/otp_response.dart';

class AuthRepositoryImpl implements IAuthRepository {
  AuthRepositoryImpl(this.remoteDataSource);
  final IAuthRemoteDatasource remoteDataSource;
  @override
  ResultFuture<AuthResult> requestOtp({required OtpParams params}) async {
    try {
      final OtpRequest request = OtpRequest(mobileNumber: params.mobileNumber);
      final ApiResponse<OtpResponse> response = await remoteDataSource
          .requestOtp(request);

      final AuthResult result = AuthResult(
        user: response.data!.toEntity(),
        message: response.message ?? '',
      );

      return right(result);
    } on ServerException catch (error) {
      return left(ServerFailure(error.message));
    } on NetworkException catch (error) {
      return left(NetworkFailure(error.message));
    } catch (error) {
      return left(UnknownFailure(error.toString()));
    }
  }
}
