import '../../domain/params/add_venue_params.dart';
import '../model/request_model/add_new_venue_request/add_new_venue_request.dart';

extension AddNewVenueRequestParamsMapper on AddNewVenueRequestParams {
  AddNewVenueRequest toRequest() {
    return AddNewVenueRequest(
      venueName: venueName,
      category: category,
      description: description,
      location: location.toRequest(),
      venueSize: venueSize,
      maxCapacity: maxCapacity,
      amenityIds: amenityIds,
      coverImageUrl: coverImageUrl,
      galleryImages: galleryImages,
      virtualTourUrl: virtualTourUrl,
      slots: slots.map((VenueSlotRequestParams e) => e.toRequest()).toList(),
      services: services
          .map((VenueServiceRequestParams e) => e.toRequest())
          .toList(),
      instantBooking: instantBooking,
    );
  }
}

extension VenueLocationRequestParamsMapper on VenueLocationRequestParams {
  VenueLocationRequest toRequest() {
    return VenueLocationRequest(
      address: address,
      city: city,
      state: state,
      country: country,
      pincode: pincode,
      latitude: latitude,
      longitude: longitude,
    );
  }
}

extension VenueSlotRequestParamsMapper on VenueSlotRequestParams {
  VenueSlotRequest toRequest() {
    return VenueSlotRequest(
      slotName: slotName,
      startTime: startTime,
      endTime: endTime,
      capacity: capacity,
      price: price,
    );
  }
}

extension VenueServiceRequestParamsMapper on VenueServiceRequestParams {
  VenueServiceRequest toRequest() {
    return VenueServiceRequest(serviceName: serviceName, price: price);
  }
}
