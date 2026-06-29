import 'package:dio/dio.dart';

import '../../../../core/model/api_response.dart';
import '../../../../core/network/api_response_wrapper.dart';
import '../../../../core/network/base_remote_data_source.dart';
import '../../../../core/network/endpoints/profile_endpoint.dart';
import '../model/user_profile_model.dart';
import 'i_user_profile_remote_datasource.dart';

class UserProfileRemoteDatasourceImpl extends BaseRemoteDataSourceImpl
    implements IUserProfileRemoteDatasource {
  UserProfileRemoteDatasourceImpl(this.dio);

  final Dio dio;

  @override
  Future<ApiResponse<UserProfileModel>> getUserProfile() {
    return safeApiCall(() async {
      final Response<dynamic> res = await dio.get(
        ProfileEndpoint.getUserProfile,
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) =>
            UserProfileModel.fromJson(data! as Map<String, dynamic>),
      );
    });
  }
}
