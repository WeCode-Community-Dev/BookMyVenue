import 'package:freezed_annotation/freezed_annotation.dart';

part 'venue_response_model.freezed.dart';
part 'venue_response_model.g.dart';

@freezed
sealed class VenueResponseModel with _$VenueResponseModel {
  const factory VenueResponseModel({
    required String id,
    @JsonKey(name: 'owner_id') required String ownerId,
    @JsonKey(name: 'venue_name') required String venueName,
    required String slug,
    required String category,
    required String description,
    required VenueLocation location,
    @JsonKey(name: 'min_capacity') required int minCapacity,
    @JsonKey(name: 'max_capacity') required int maxCapacity,
    required List<VenueAmenity> amenities,
    @JsonKey(name: 'cover_image_url') required String coverImageUrl,
    @JsonKey(name: 'gallery_images')
    required List<VenueGalleryImage> galleryImages,
    @JsonKey(name: 'virtual_tour_url') String? virtualTourUrl,
    required List<VenueSlot> slots,
    required List<VenueService> services,
    @JsonKey(name: 'instant_booking') required bool instantBooking,
    required String status,
    @JsonKey(name: 'average_rating') required double averageRating,
    @JsonKey(name: 'total_reviews') required int totalReviews,
    @JsonKey(name: 'view_count') required int viewCount,
    @JsonKey(name: 'booking_count') required int bookingCount,
    @JsonKey(name: 'is_featured') required bool isFeatured,
    @JsonKey(name: 'verification_status') required String verificationStatus,
    @JsonKey(name: 'approved_by') String? approvedBy,
    @JsonKey(name: 'approved_at') DateTime? approvedAt,
    @JsonKey(name: 'rejection_reason') String? rejectionReason,
    @JsonKey(name: 'published_at') DateTime? publishedAt,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _VenueResponseModel;

  factory VenueResponseModel.fromJson(Map<String, dynamic> json) =>
      _$VenueResponseModelFromJson(json);
}

@freezed
sealed class VenueLocation with _$VenueLocation {
  const factory VenueLocation({
    required String address,
    required String city,
    required String state,
    required String country,
    required String pincode,
    required double latitude,
    required double longitude,
  }) = _VenueLocation;

  factory VenueLocation.fromJson(Map<String, dynamic> json) =>
      _$VenueLocationFromJson(json);
}

@freezed
sealed class VenueAmenity with _$VenueAmenity {
  const factory VenueAmenity({required String id, required String name}) =
      _VenueAmenity;

  factory VenueAmenity.fromJson(Map<String, dynamic> json) =>
      _$VenueAmenityFromJson(json);
}

@freezed
sealed class VenueGalleryImage with _$VenueGalleryImage {
  const factory VenueGalleryImage({
    required String id,
    @JsonKey(name: 'image_url') required String imageUrl,
    @JsonKey(name: 'sort_order') required int sortOrder,
    @JsonKey(name: 'created_at') required DateTime createdAt,
  }) = _VenueGalleryImage;

  factory VenueGalleryImage.fromJson(Map<String, dynamic> json) =>
      _$VenueGalleryImageFromJson(json);
}

@freezed
sealed class VenueSlot with _$VenueSlot {
  const factory VenueSlot({
    required String id,
    @JsonKey(name: 'slot_name') required String slotName,
    @JsonKey(name: 'start_time') required String startTime,
    @JsonKey(name: 'end_time') required String endTime,
    required int capacity,
    required double price,
  }) = _VenueSlot;

  factory VenueSlot.fromJson(Map<String, dynamic> json) =>
      _$VenueSlotFromJson(json);
}

@freezed
sealed class VenueService with _$VenueService {
  const factory VenueService({
    required String id,
    @JsonKey(name: 'service_name') required String serviceName,
    required double price,
  }) = _VenueService;

  factory VenueService.fromJson(Map<String, dynamic> json) =>
      _$VenueServiceFromJson(json);
}
