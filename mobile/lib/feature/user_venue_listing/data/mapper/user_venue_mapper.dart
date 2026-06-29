import '../../domain/entity/user_venue_entity.dart';
import '../model/user_venue_model.dart';

extension UserVenueMapper on UserVenueModel {
  UserVenueEntity toEntity() {
    return UserVenueEntity(
      id: id,
      ownerId: ownerId,
      venueName: venueName,
      slug: slug,
      category: category,
      description: description,
      location: location.toEntity(),
      minCapacity: minCapacity,
      maxCapacity: maxCapacity,
      amenities: amenities.map((UserVenueAmenityModel e) => e.toEntity()).toList(),
      coverImageUrl: coverImageUrl,
      galleryImages:
          galleryImages.map((UserVenueGalleryImageModel e) => e.toEntity()).toList(),
      virtualTourUrl: virtualTourUrl,
      slots: slots.map((UserVenueSlotModel e) => e.toEntity()).toList(),
      services: services.map((UserVenueServiceModel e) => e.toEntity()).toList(),
      instantBooking: instantBooking,
      status: status,
      averageRating: averageRating,
      totalReviews: totalReviews,
      viewCount: viewCount,
      bookingCount: bookingCount,
      isFeatured: isFeatured,
      verificationStatus: verificationStatus,
      approvedBy: approvedBy,
      approvedAt: approvedAt,
      rejectionReason: rejectionReason,
      publishedAt: publishedAt,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}

extension UserVenueLocationMapper on UserVenueLocationModel {
  UserVenueLocationEntity toEntity() {
    return UserVenueLocationEntity(
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

extension UserVenueAmenityMapper on UserVenueAmenityModel {
  UserVenueAmenityEntity toEntity() {
    return UserVenueAmenityEntity(
      id: id,
      name: name,
    );
  }
}

extension UserVenueGalleryImageMapper on UserVenueGalleryImageModel {
  UserVenueGalleryImageEntity toEntity() {
    return UserVenueGalleryImageEntity(
      id: id,
      imageUrl: imageUrl,
      sortOrder: sortOrder,
      createdAt: createdAt,
    );
  }
}

extension UserVenueSlotMapper on UserVenueSlotModel {
  UserVenueSlotEntity toEntity() {
    return UserVenueSlotEntity(
      id: id,
      slotName: slotName,
      startTime: startTime,
      endTime: endTime,
      capacity: capacity,
      price: price,
    );
  }
}

extension UserVenueServiceMapper on UserVenueServiceModel {
  UserVenueServiceEntity toEntity() {
    return UserVenueServiceEntity(
      id: id,
      serviceName: serviceName,
      price: price,
    );
  }
}
