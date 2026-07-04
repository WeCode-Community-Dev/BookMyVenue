import '../../../../core/model/api_response.dart';
import '../../../../core/network/base_repository.dart';
import '../../../../core/utils/type_def.dart';
import '../../domain/entity/add_new_venue_entity.dart';
import '../../domain/entity/image_upload_entity.dart';
import '../../domain/entity/venue_response_entity.dart';
import '../../domain/params/add_venue_params.dart';
import '../../domain/params/get_venue_params.dart';
import '../../domain/repository/i_venue_repository.dart';
import '../datasource/i_add_new_venue_remote_datasource.dart';
import '../mapper/add_new_venue_request_params_mapper.dart';
import '../mapper/add_new_venue_response_mapper.dart';
import '../mapper/image_upload_response_mapper.dart';
import '../mapper/venue_response_mapper.dart';
import '../model/request_model/add_new_venue_request/add_new_venue_request.dart';
import '../model/response_model/add_new_venue_response_model/add_new_venue_response_model.dart';
import '../model/response_model/image_upload_response/image_upload_response_model.dart';
import '../model/response_model/venue_response_model/venue_response_model.dart';

class VenueRepositoryImpl extends BaseRepository implements IVenueRepository {
  VenueRepositoryImpl({required this.remoteDatasource});
  final IAddNewVenueRemoteDatasource remoteDatasource;
  @override
  ResultFuture<AddNewVenueResult> addNewVenue({
    required AddNewVenueRequestParams requestModel,
  }) {
    return handleRequest(() async {
      final AddNewVenueRequest request = requestModel.toRequest();
      final ApiResponse<AddNewVenueResponseModel> response =
          await remoteDatasource.addNewVenue(requestModel: request);

      return AddNewVenueResult(
        venue: response.data!.toEntity(),
        message: response.message ?? '',
      );
    });
  }

  @override
  ResultFuture<VenueResponseResult> getAllVenues({
    required GetVenuesParams requestParams,
  }) {
    return handleRequest(() async {
      final ApiResponse<List<VenueResponseModel>> response =
          await remoteDatasource.getAllVenues(
            skip: requestParams.skip,
            limit: requestParams.limit,
            ownerId: requestParams.ownerId,
          );

      return VenueResponseResult(
        venue: response.data!
            .map((VenueResponseModel e) => e.toEntity())
            .toList(),
        message: response.message ?? '',
      );
    });
  }

  // @override
  // ResultFuture<VenueResponseByIdResult> getVenuesById({
  //   required String venueId,
  // }) {
  //   return handleRequest(() async {
  //     final ApiResponse<VenueResponseModel> response = await remoteDatasource
  //         .getVenuesById(venueId: venueId);

  //     return VenueResponseByIdResult(
  //       venue: response.data!.toEntity(),
  //       message: response.message ?? '',
  //     );
  //   });
  // }

  @override
  ResultFuture<VenueAmenityResult> getAmenities() {
    return handleRequest(() async {
      final ApiResponse<List<VenueAmenity>> response = await remoteDatasource
          .getAmenities();

      return VenueAmenityResult(
        message: response.message ?? '',
        amenities: response.data!
            .map((VenueAmenity e) => e.toEntity())
            .toList(),
      );
    });
  }

  @override
  ResultFuture<List<UploadedImageEntity>> uploadImages({
    required List<String> imagePaths,
  }) {
    return handleRequest(() async {
      final ApiResponse<List<ImageUploadResponseModel>> response =
          await remoteDatasource.uploadImages(imagePaths: imagePaths);

      return response.data!
          .map((ImageUploadResponseModel e) => e.toEntity())
          .toList();
    });
  }
}
