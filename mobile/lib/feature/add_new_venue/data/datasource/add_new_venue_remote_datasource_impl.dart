import 'package:dio/dio.dart';

import '../../../../core/model/api_response.dart';
import '../../../../core/network/api_response_wrapper.dart';
import '../../../../core/network/base_remote_data_source.dart';
import '../../../../core/network/endpoints/venue_management_endpoint.dart';
import '../model/request_model/add_new_venue_request/add_new_venue_request.dart';
import '../model/response_model/add_new_venue_response_model/add_new_venue_response_model.dart';
import '../model/response_model/venue_response_model/venue_response_model.dart';
import 'i_add_new_venue_remote_datasource.dart';

class AddNewVenueRemoteDatasourceImpl extends BaseRemoteDataSourceImpl
    implements IAddNewVenueRemoteDatasource {
  AddNewVenueRemoteDatasourceImpl(this.dio);
  final Dio dio;
  @override
  Future<ApiResponse<AddNewVenueResponseModel>> addNewVenue({
    required AddNewVenueRequest requestModel,
  }) {
    return safeApiCall(() async {
      final Response<dynamic> res = await dio.post(
        VenueManagementEndpoint.createVenue,
        data: requestModel.toJson(),
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) =>
            AddNewVenueResponseModel.fromJson(data! as Map<String, dynamic>),
      );
    });
  }

  @override
  Future<ApiResponse<List<VenueResponseModel>>> getAllVenues({
    required int skip,
    required int limit,
  }) {
    return safeApiCall(() async {
      final Response<dynamic> res = await dio.get(
        VenueManagementEndpoint.getVenue,
        queryParameters: <String, dynamic>{
          'skip': skip,
          'limit': limit,
          'is_verified': true,
        },
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) => mapList(data, VenueResponseModel.fromJson),
      );
    });
  }

  @override
  Future<ApiResponse<VenueResponseModel>> getVenuesById({
    required String venueId,
  }) {
    return safeApiCall(() async {
      final Response<dynamic> res = await dio.get(
        '${VenueManagementEndpoint.getVenue}/$venueId',
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) =>
            VenueResponseModel.fromJson(data! as Map<String, dynamic>),
      );
    });
  }
}
