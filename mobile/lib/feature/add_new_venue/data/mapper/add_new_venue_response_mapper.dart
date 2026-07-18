import '../../domain/entity/add_new_venue_entity.dart';
import '../model/response_model/add_new_venue_response_model/add_new_venue_response_model.dart';

extension AddNewVenueResponseMapper on AddNewVenueResponseModel {
  AddNewVenueEntity toEntity() {
    return AddNewVenueEntity(
      id: id,
      venueName: venueName,
      slug: slug,
      status: status,
      verificationStatus: verificationStatus,
    );
  }
}
