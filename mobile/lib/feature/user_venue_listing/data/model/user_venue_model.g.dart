// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_venue_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_UserVenueModel _$UserVenueModelFromJson(Map<String, dynamic> json) =>
    _UserVenueModel(
      id: json['id'] as String,
      ownerId: json['owner_id'] as String,
      venueName: json['venue_name'] as String,
      slug: json['slug'] as String,
      category: json['category'] as String,
      description: json['description'] as String,
      location: UserVenueLocationModel.fromJson(
        json['location'] as Map<String, dynamic>,
      ),
      minCapacity: (json['min_capacity'] as num).toInt(),
      maxCapacity: (json['max_capacity'] as num).toInt(),
      amenities: (json['amenities'] as List<dynamic>)
          .map((e) => UserVenueAmenityModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      coverImageUrl: json['cover_image_url'] as String,
      galleryImages: (json['gallery_images'] as List<dynamic>)
          .map(
            (e) =>
                UserVenueGalleryImageModel.fromJson(e as Map<String, dynamic>),
          )
          .toList(),
      virtualTourUrl: json['virtual_tour_url'] as String?,
      slots: (json['slots'] as List<dynamic>)
          .map((e) => UserVenueSlotModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      services: (json['services'] as List<dynamic>)
          .map((e) => UserVenueServiceModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      instantBooking: json['instant_booking'] as bool,
      status: json['status'] as String,
      averageRating: (json['average_rating'] as num).toDouble(),
      totalReviews: (json['total_reviews'] as num).toInt(),
      viewCount: (json['view_count'] as num).toInt(),
      bookingCount: (json['booking_count'] as num).toInt(),
      isFeatured: json['is_featured'] as bool,
      verificationStatus: json['verification_status'] as String,
      approvedBy: json['approved_by'] as String?,
      approvedAt: json['approved_at'] == null
          ? null
          : DateTime.parse(json['approved_at'] as String),
      rejectionReason: json['rejection_reason'] as String?,
      publishedAt: json['published_at'] == null
          ? null
          : DateTime.parse(json['published_at'] as String),
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );

Map<String, dynamic> _$UserVenueModelToJson(_UserVenueModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'owner_id': instance.ownerId,
      'venue_name': instance.venueName,
      'slug': instance.slug,
      'category': instance.category,
      'description': instance.description,
      'location': instance.location,
      'min_capacity': instance.minCapacity,
      'max_capacity': instance.maxCapacity,
      'amenities': instance.amenities,
      'cover_image_url': instance.coverImageUrl,
      'gallery_images': instance.galleryImages,
      'virtual_tour_url': instance.virtualTourUrl,
      'slots': instance.slots,
      'services': instance.services,
      'instant_booking': instance.instantBooking,
      'status': instance.status,
      'average_rating': instance.averageRating,
      'total_reviews': instance.totalReviews,
      'view_count': instance.viewCount,
      'booking_count': instance.bookingCount,
      'is_featured': instance.isFeatured,
      'verification_status': instance.verificationStatus,
      'approved_by': instance.approvedBy,
      'approved_at': instance.approvedAt?.toIso8601String(),
      'rejection_reason': instance.rejectionReason,
      'published_at': instance.publishedAt?.toIso8601String(),
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };

_UserVenueLocationModel _$UserVenueLocationModelFromJson(
  Map<String, dynamic> json,
) => _UserVenueLocationModel(
  address: json['address'] as String,
  city: json['city'] as String,
  state: json['state'] as String,
  country: json['country'] as String,
  pincode: json['pincode'] as String,
  latitude: (json['latitude'] as num).toDouble(),
  longitude: (json['longitude'] as num).toDouble(),
);

Map<String, dynamic> _$UserVenueLocationModelToJson(
  _UserVenueLocationModel instance,
) => <String, dynamic>{
  'address': instance.address,
  'city': instance.city,
  'state': instance.state,
  'country': instance.country,
  'pincode': instance.pincode,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
};

_UserVenueAmenityModel _$UserVenueAmenityModelFromJson(
  Map<String, dynamic> json,
) => _UserVenueAmenityModel(
  id: json['id'] as String,
  name: json['name'] as String,
);

Map<String, dynamic> _$UserVenueAmenityModelToJson(
  _UserVenueAmenityModel instance,
) => <String, dynamic>{'id': instance.id, 'name': instance.name};

_UserVenueGalleryImageModel _$UserVenueGalleryImageModelFromJson(
  Map<String, dynamic> json,
) => _UserVenueGalleryImageModel(
  id: json['id'] as String,
  imageUrl: json['image_url'] as String,
  sortOrder: (json['sort_order'] as num).toInt(),
  createdAt: DateTime.parse(json['created_at'] as String),
);

Map<String, dynamic> _$UserVenueGalleryImageModelToJson(
  _UserVenueGalleryImageModel instance,
) => <String, dynamic>{
  'id': instance.id,
  'image_url': instance.imageUrl,
  'sort_order': instance.sortOrder,
  'created_at': instance.createdAt.toIso8601String(),
};

_UserVenueSlotModel _$UserVenueSlotModelFromJson(Map<String, dynamic> json) =>
    _UserVenueSlotModel(
      id: json['id'] as String,
      slotName: json['slot_name'] as String,
      startTime: json['start_time'] as String,
      endTime: json['end_time'] as String,
      capacity: (json['capacity'] as num).toInt(),
      price: (json['price'] as num).toDouble(),
    );

Map<String, dynamic> _$UserVenueSlotModelToJson(_UserVenueSlotModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'slot_name': instance.slotName,
      'start_time': instance.startTime,
      'end_time': instance.endTime,
      'capacity': instance.capacity,
      'price': instance.price,
    };

_UserVenueServiceModel _$UserVenueServiceModelFromJson(
  Map<String, dynamic> json,
) => _UserVenueServiceModel(
  id: json['id'] as String,
  serviceName: json['service_name'] as String,
  price: (json['price'] as num).toDouble(),
);

Map<String, dynamic> _$UserVenueServiceModelToJson(
  _UserVenueServiceModel instance,
) => <String, dynamic>{
  'id': instance.id,
  'service_name': instance.serviceName,
  'price': instance.price,
};
