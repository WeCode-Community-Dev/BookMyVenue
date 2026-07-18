import 'package:dio/dio.dart';

import '../../../../core/model/api_response.dart';
import '../../../../core/network/api_response_wrapper.dart';
import '../../../../core/network/base_remote_data_source.dart';
import '../../../../core/network/endpoints/profile_endpoint.dart';
import '../model/owner_profile_model.dart';
import 'i_owner_profile_remote_datasource.dart';

class OwnerProfileRemoteDatasourceImpl extends BaseRemoteDataSourceImpl
    implements IOwnerProfileRemoteDatasource {
  OwnerProfileRemoteDatasourceImpl(this.dio);

  final Dio dio;

  @override
  Future<ApiResponse<OwnerProfileModel>> getOwnerProfile() {
    return safeApiCall(() async {
      final Response<dynamic> res = await dio.get(
        ProfileEndpoint.getOwnerProfile,
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) =>
            OwnerProfileModel.fromJson(data! as Map<String, dynamic>),
      );
    });
  }
}
