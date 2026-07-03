import 'package:freezed_annotation/freezed_annotation.dart';

part 'add_new_venue_request.freezed.dart';
part 'add_new_venue_request.g.dart';

@freezed
sealed class AddNewVenueRequest with _$AddNewVenueRequest {
  const factory AddNewVenueRequest({
    @JsonKey(name: 'venue_name') required String venueName,
    required String category,
    required String description,
    required VenueLocationRequest location,
    @JsonKey(name: 'venue_size') required int venueSize,
    @JsonKey(name: 'max_capacity') required int maxCapacity,
    @JsonKey(name: 'amenity_ids') required List<String> amenityIds,
    @JsonKey(name: 'cover_image_url') required String coverImageUrl,
    @JsonKey(name: 'gallery_images') required List<String> galleryImages,
    @JsonKey(name: 'virtual_tour_url') String? virtualTourUrl,
    required List<VenueSlotRequest> slots,
    required List<VenueServiceRequest> services,
    @JsonKey(name: 'instant_booking') required bool instantBooking,
  }) = _AddNewVenueRequest;

  factory AddNewVenueRequest.fromJson(Map<String, dynamic> json) =>
      _$AddNewVenueRequestFromJson(json);
}

@freezed
sealed class VenueLocationRequest with _$VenueLocationRequest {
  const factory VenueLocationRequest({
    required String address,
    required String city,
    required String state,
    required String country,
    required String pincode,
    required double latitude,
    required double longitude,
  }) = _VenueLocationRequest;

  factory VenueLocationRequest.fromJson(Map<String, dynamic> json) =>
      _$VenueLocationRequestFromJson(json);
}

@freezed
sealed class VenueSlotRequest with _$VenueSlotRequest {
  const factory VenueSlotRequest({
    @JsonKey(name: 'slot_name') required String slotName,
    @JsonKey(name: 'start_time') required String startTime,
    @JsonKey(name: 'end_time') required String endTime,
    required int capacity,
    required double price,
  }) = _VenueSlotRequest;

  factory VenueSlotRequest.fromJson(Map<String, dynamic> json) =>
      _$VenueSlotRequestFromJson(json);
}

@freezed
sealed class VenueServiceRequest with _$VenueServiceRequest {
  const factory VenueServiceRequest({
    @JsonKey(name: 'service_name') required String serviceName,
    required double price,
  }) = _VenueServiceRequest;

  factory VenueServiceRequest.fromJson(Map<String, dynamic> json) =>
      _$VenueServiceRequestFromJson(json);
}
