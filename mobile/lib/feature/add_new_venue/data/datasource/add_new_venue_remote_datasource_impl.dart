import 'dart:io';

import 'package:dio/dio.dart';

import '../../../../core/model/api_response.dart';
import '../../../../core/network/api_response_wrapper.dart';
import '../../../../core/network/base_remote_data_source.dart';
import '../../../../core/network/endpoints/upload_endpoints.dart';
import '../../../../core/network/endpoints/venue_management_endpoint.dart';
import '../../../../core/logger/app_logger.dart';
import '../model/request_model/add_new_venue_request/add_new_venue_request.dart';
import '../model/response_model/add_new_venue_response_model/add_new_venue_response_model.dart';
import '../model/response_model/image_upload_response/image_upload_response_model.dart';
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
      final Map<String, dynamic> requestJson = requestModel.toJson();
      AppLogger.info('ADD VENUE JSON TO SEND: $requestJson');

      final Response<dynamic> res = await dio.post(
        VenueManagementEndpoint.createVenue,
        data: requestJson,
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
    String? ownerId,
  }) {
    return safeApiCall(() async {
      final Map<String, dynamic> queryParameters = <String, dynamic>{
        'skip': skip,
        'limit': limit,
      };
      if (ownerId != null) {
        queryParameters['owner_id'] = ownerId;
      }
      final Response<dynamic> res = await dio.get(
        VenueManagementEndpoint.getVenue,
        // TODO(Jiyad): Retrive only current owner Venue update api with owner_id
        queryParameters: queryParameters,
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) => mapList(data, VenueResponseModel.fromJson),
      );
    });
  }

  // @override
  // Future<ApiResponse<VenueResponseModel>> getVenuesById({
  //   required String venueId,
  // }) {
  //   return safeApiCall(() async {
  //     final Response<dynamic> res = await dio.get(
  //       '${VenueManagementEndpoint.getVenue}/$venueId',
  //     );

  //     return ApiResponseMapper.fromJson(
  //       res.data as Map<String, dynamic>,
  //       (Object? data) =>
  //           VenueResponseModel.fromJson(data! as Map<String, dynamic>),
  //     );
  //   });
  // }

  @override
  Future<ApiResponse<List<VenueAmenity>>> getAmenities() {
    return safeApiCall(() async {
      final Response<dynamic> res = await dio.get(
        VenueManagementEndpoint.getAmenities,
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) => mapList(data, VenueAmenity.fromJson),
      );
    });
  }

  @override
  Future<ApiResponse<List<ImageUploadResponseModel>>> uploadImages({
    required List<String> imagePaths,
  }) {
    return safeApiCall(() async {
      final List<MultipartFile> files = <MultipartFile>[];
      for (final String path in imagePaths) {
        final File file = File(path);
        if (await file.exists()) {
          final String filename = path.split('/').last;
          files.add(await MultipartFile.fromFile(path, filename: filename));
        }
      }

      final FormData formData = FormData.fromMap(<String, dynamic>{
        'folder': 'venues',
        'files': files,
      });

      final Response<dynamic> res = await dio.post(
        UploadEndpoints.uploadImages,
        data: formData,
        options: Options(
          headers: <String, dynamic>{'Content-Type': 'multipart/form-data'},
        ),
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) => mapList(data, ImageUploadResponseModel.fromJson),
      );
    });
  }
}
