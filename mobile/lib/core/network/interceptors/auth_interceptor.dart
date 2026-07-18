import 'package:dio/dio.dart';

import '../../../feature/auth/data/datasource/auth_local_datasource.dart';
import '../../../feature/auth/data/model/common/refresh_token_model.dart';
import '../../auth/auth_session.dart';
import '../../auth/auth_session_model.dart';
import '../../errors/exceptions.dart';
import '../endpoints/auth_endpoints.dart';

class AuthInterceptor extends Interceptor {
  AuthInterceptor({required this.tokenStorage, required this.dio});
  final IAuthLocalDatasource tokenStorage;
  final Dio dio;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    if (options.path.contains(AuthEndpoints.verifyOtp) ||
        options.path.contains(AuthEndpoints.requestOtp) ||
        options.path.contains(AuthOwnerEndpoints.requestOtp) ||
        options.path.contains(AuthOwnerEndpoints.verifyOtp)) {
      return handler.next(options);
    }
    final AuthSessionModel? logionDetails = await tokenStorage.getToken();

    final String? accessToken = logionDetails?.accessToken;

    if (logionDetails != null &&
        accessToken != null &&
        accessToken.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $accessToken';
    }

    super.onRequest(options, handler);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      try {
        /// Prevent infinite loop
        if (err.requestOptions.extra['isRetry'] == true) {
          return handler.next(err);
        }

        AuthSessionModel? loginDetails = await tokenStorage.getToken();

        if (loginDetails == null) {
          return handler.next(err);
        }

        final String refreshToken = loginDetails.refreshToken;

        final RefreshTokenResponseModel newResult = await _refreshToken(
          RefreshTokenRequestModel(refreshToken: refreshToken),
        );

        loginDetails = loginDetails.copyWith(
          refreshToken: newResult.refreshToken,
          accessToken: newResult.accessToken,
        );

        await tokenStorage.saveToken(loginDetails);

        final RequestOptions options = err.requestOptions;

        options.headers['Authorization'] = 'Bearer ${loginDetails.accessToken}';
        options.extra['isRetry'] = true;

        final Response<dynamic> response = await Dio().fetch(options);

        return handler.resolve(response);
      } catch (e) {
        await tokenStorage.deleteToken();
        AuthSession.init();
        // TODO:(Jiyad) Logout user method call here
        return handler.next(err);
      }
    }

    return handler.next(err);
  }

  Future<RefreshTokenResponseModel> _refreshToken(
    RefreshTokenRequestModel refreshToken,
  ) async {
    try {
      final Response<dynamic> refreshResponse = await dio.post(
        AuthOwnerEndpoints.refreshToken,
        data: refreshToken.toJson(),
      );

      if (refreshResponse.statusCode == 200 &&
          refreshResponse.data['status'] == true) {
        final RefreshTokenResponseModel result =
            RefreshTokenResponseModel.fromJson(
              refreshResponse.data['data'] as Map<String, dynamic>,
            );

        return result;
      }
      throw ServerException('Error getting refresh token');
    } catch (e) {
      rethrow;
    }
  }
}
