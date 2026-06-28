import '../../../../core/model/api_response.dart';
import '../model/request_model/add_new_venue_request/add_new_venue_request.dart';
import '../model/response_model/add_new_venue_response_model/add_new_venue_response_model.dart';
import '../model/response_model/venue_response_model/venue_response_model.dart';

abstract interface class IAddNewVenueRemoteDatasource {
  Future<ApiResponse<AddNewVenueResponseModel>> addNewVenue({
    required AddNewVenueRequest requestModel,
  });
  Future<ApiResponse<List<VenueResponseModel>>> getAllVenues({
    required int skip,
    required int limit,
  });
  Future<ApiResponse<VenueResponseModel>> getVenuesById({
    required String venueId,
  });
  Future<ApiResponse<List<VenueAmenity>>> getAmenities();
}
