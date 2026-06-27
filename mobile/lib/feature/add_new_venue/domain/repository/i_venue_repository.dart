import '../../../../core/utils/type_def.dart';
import '../entity/add_new_venue_entity.dart';
import '../entity/venue_response_entity.dart';
import '../params/add_venue_params.dart';
import '../params/get_venue_params.dart';

abstract interface class IVenueRepository {
  ResultFuture<AddNewVenueResult> addNewVenue({
    required AddNewVenueRequestParams requestModel,
  });
  ResultFuture<VenueResponseResult> getAllVenues({
    required GetVenuesParams requestParams,
  });
  ResultFuture<VenueResponseByIdResult> getVenuesById({
    required String venueId,
  });
}
