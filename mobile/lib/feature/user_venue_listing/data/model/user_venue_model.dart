import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_venue_model.freezed.dart';
part 'user_venue_model.g.dart';

@freezed
sealed class UserVenueModel with _$UserVenueModel {
  const factory UserVenueModel({
    required String id,
    @JsonKey(name: 'owner_id') required String ownerId,
    @JsonKey(name: 'venue_name') required String venueName,
    required String slug,
    required String category,
    required String description,
    required UserVenueLocationModel location,
    @JsonKey(name: 'min_capacity') required int minCapacity,
    @JsonKey(name: 'max_capacity') required int maxCapacity,
    required List<UserVenueAmenityModel> amenities,
    @JsonKey(name: 'cover_image_url') required String coverImageUrl,
    @JsonKey(name: 'gallery_images')
    required List<UserVenueGalleryImageModel> galleryImages,
    @JsonKey(name: 'virtual_tour_url') String? virtualTourUrl,
    required List<UserVenueSlotModel> slots,
    required List<UserVenueServiceModel> services,
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
  }) = _UserVenueModel;

  factory UserVenueModel.fromJson(Map<String, dynamic> json) =>
      _$UserVenueModelFromJson(json);
}

@freezed
sealed class UserVenueLocationModel with _$UserVenueLocationModel {
  const factory UserVenueLocationModel({
    required String address,
    required String city,
    required String state,
    required String country,
    required String pincode,
    required double latitude,
    required double longitude,
  }) = _UserVenueLocationModel;

  factory UserVenueLocationModel.fromJson(Map<String, dynamic> json) =>
      _$UserVenueLocationModelFromJson(json);
}

@freezed
sealed class UserVenueAmenityModel with _$UserVenueAmenityModel {
  const factory UserVenueAmenityModel({
    required String id,
    required String name,
  }) = _UserVenueAmenityModel;

  factory UserVenueAmenityModel.fromJson(Map<String, dynamic> json) =>
      _$UserVenueAmenityModelFromJson(json);
}

@freezed
sealed class UserVenueGalleryImageModel with _$UserVenueGalleryImageModel {
  const factory UserVenueGalleryImageModel({
    required String id,
    @JsonKey(name: 'image_url') required String imageUrl,
    @JsonKey(name: 'sort_order') required int sortOrder,
    @JsonKey(name: 'created_at') required DateTime createdAt,
  }) = _UserVenueGalleryImageModel;

  factory UserVenueGalleryImageModel.fromJson(Map<String, dynamic> json) =>
      _$UserVenueGalleryImageModelFromJson(json);
}

@freezed
sealed class UserVenueSlotModel with _$UserVenueSlotModel {
  const factory UserVenueSlotModel({
    required String id,
    @JsonKey(name: 'slot_name') required String slotName,
    @JsonKey(name: 'start_time') required String startTime,
    @JsonKey(name: 'end_time') required String endTime,
    required int capacity,
    required double price,
  }) = _UserVenueSlotModel;

  factory UserVenueSlotModel.fromJson(Map<String, dynamic> json) =>
      _$UserVenueSlotModelFromJson(json);
}

@freezed
sealed class UserVenueServiceModel with _$UserVenueServiceModel {
  const factory UserVenueServiceModel({
    required String id,
    @JsonKey(name: 'service_name') required String serviceName,
    required double price,
  }) = _UserVenueServiceModel;

  factory UserVenueServiceModel.fromJson(Map<String, dynamic> json) =>
      _$UserVenueServiceModelFromJson(json);
}
