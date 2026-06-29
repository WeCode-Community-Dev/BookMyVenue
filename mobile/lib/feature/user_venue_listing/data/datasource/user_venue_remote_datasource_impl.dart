import 'package:dio/dio.dart';

import '../../../../core/model/api_response.dart';
import '../../../../core/network/api_response_wrapper.dart';
import '../../../../core/network/base_remote_data_source.dart';
import '../../../../core/network/endpoints/venue_endpoint.dart';
import '../../../add_new_venue/domain/params/get_venue_params.dart';
import '../model/user_venue_model.dart';
import 'i_user_venue_remote_datasource.dart';

class UserVenueRemoteDatasourceImpl extends BaseRemoteDataSourceImpl
    implements IUserVenueRemoteDatasource {
  UserVenueRemoteDatasourceImpl(this.dio);

  final Dio dio;

  @override
  Future<ApiResponse<List<UserVenueModel>>> getUserVenues({
    required GetVenuesParams params,
  }) {
    return safeApiCall(() async {
      final Response<dynamic> res = await dio.get(
        VenueEndpoint.getVenues,
        queryParameters: <String, dynamic>{
          'skip': params.skip,
          'limit': params.limit,
        },
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) => mapList(data, UserVenueModel.fromJson),
      );
    });
  }
}
