import 'package:equatable/equatable.dart';

class VenueResponseResult extends Equatable {
  const VenueResponseResult({required this.message, required this.venue});

  final String message;
  final List<VenueEntity> venue;

  @override
  List<Object?> get props => <Object?>[message, venue];
}

class VenueResponseByIdResult extends Equatable {
  const VenueResponseByIdResult({required this.message, required this.venue});

  final String message;
  final VenueEntity venue;

  @override
  List<Object?> get props => <Object?>[message, venue];
}

class VenueEntity extends Equatable {
  const VenueEntity({
    required this.id,
    required this.ownerId,
    required this.venueName,
    required this.slug,
    required this.category,
    required this.description,
    required this.location,
    required this.minCapacity,
    required this.maxCapacity,
    required this.amenities,
    required this.coverImageUrl,
    required this.galleryImages,
    required this.virtualTourUrl,
    required this.slots,
    required this.services,
    required this.instantBooking,
    required this.status,
    required this.averageRating,
    required this.totalReviews,
    required this.viewCount,
    required this.bookingCount,
    required this.isFeatured,
    required this.verificationStatus,
    required this.approvedBy,
    required this.approvedAt,
    required this.rejectionReason,
    required this.publishedAt,
    required this.createdAt,
    required this.updatedAt,
  });

  final String id;
  final String ownerId;
  final String venueName;
  final String slug;
  final String category;
  final String description;
  final VenueLocationEntity location;
  final int minCapacity;
  final int maxCapacity;
  final List<VenueAmenityEntity> amenities;
  final String coverImageUrl;
  final List<VenueGalleryImageEntity> galleryImages;
  final String? virtualTourUrl;
  final List<VenueSlotEntity> slots;
  final List<VenueServiceEntity> services;
  final bool instantBooking;
  final String status;
  final double averageRating;
  final int totalReviews;
  final int viewCount;
  final int bookingCount;
  final bool isFeatured;
  final String verificationStatus;
  final String? approvedBy;
  final DateTime? approvedAt;
  final String? rejectionReason;
  final DateTime? publishedAt;
  final DateTime createdAt;
  final DateTime updatedAt;

  @override
  List<Object?> get props => <Object?>[
    id,
    ownerId,
    venueName,
    slug,
    category,
    description,
    location,
    minCapacity,
    maxCapacity,
    amenities,
    coverImageUrl,
    galleryImages,
    virtualTourUrl,
    slots,
    services,
    instantBooking,
    status,
    averageRating,
    totalReviews,
    viewCount,
    bookingCount,
    isFeatured,
    verificationStatus,
    approvedBy,
    approvedAt,
    rejectionReason,
    publishedAt,
    createdAt,
    updatedAt,
  ];
}

class VenueLocationEntity extends Equatable {
  const VenueLocationEntity({
    required this.address,
    required this.city,
    required this.state,
    required this.country,
    required this.pincode,
    required this.latitude,
    required this.longitude,
  });

  final String address;
  final String city;
  final String state;
  final String country;
  final String pincode;
  final double latitude;
  final double longitude;

  @override
  List<Object?> get props => <Object?>[
    address,
    city,
    state,
    country,
    pincode,
    latitude,
    longitude,
  ];
}

class VenueAmenityEntity extends Equatable {
  const VenueAmenityEntity({required this.id, required this.name});

  final String id;
  final String name;

  @override
  List<Object?> get props => <Object?>[id, name];
}

class VenueGalleryImageEntity extends Equatable {
  const VenueGalleryImageEntity({
    required this.id,
    required this.imageUrl,
    required this.sortOrder,
    required this.createdAt,
  });

  final String id;
  final String imageUrl;
  final int sortOrder;
  final DateTime createdAt;

  @override
  List<Object?> get props => <Object?>[id, imageUrl, sortOrder, createdAt];
}

class VenueSlotEntity extends Equatable {
  const VenueSlotEntity({
    required this.id,
    required this.slotName,
    required this.startTime,
    required this.endTime,
    required this.capacity,
    required this.price,
  });

  final String id;
  final String slotName;
  final String startTime;
  final String endTime;
  final int capacity;
  final double price;

  @override
  List<Object?> get props => <Object?>[
    id,
    slotName,
    startTime,
    endTime,
    capacity,
    price,
  ];
}

class VenueServiceEntity extends Equatable {
  const VenueServiceEntity({
    required this.id,
    required this.serviceName,
    required this.price,
  });

  final String id;
  final String serviceName;
  final double price;

  @override
  List<Object?> get props => <Object?>[id, serviceName, price];
}
