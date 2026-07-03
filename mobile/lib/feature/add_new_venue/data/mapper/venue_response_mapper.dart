import '../../domain/entity/venue_response_entity.dart';
import '../model/response_model/venue_response_model/venue_response_model.dart';

extension VenueResponseMapper on VenueResponseModel {
  VenueEntity toEntity() {
    return VenueEntity(
      id: id,
      ownerId: ownerId,
      venueName: venueName,
      slug: slug,
      category: category,
      description: description,
      location: location.toEntity(),
      venueSize: venueSize,
      maxCapacity: maxCapacity,
      amenities: amenities.map((VenueAmenity e) => e.toEntity()).toList(),
      coverImageUrl: coverImageUrl,
      galleryImages: galleryImages
          .map((VenueGalleryImage e) => e.toEntity())
          .toList(),
      virtualTourUrl: virtualTourUrl,
      slots: slots.map((VenueSlot e) => e.toEntity()).toList(),
      services: services.map((VenueService e) => e.toEntity()).toList(),
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

extension VenueLocationMapper on VenueLocation {
  VenueLocationEntity toEntity() {
    return VenueLocationEntity(
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

extension VenueAmenityMapper on VenueAmenity {
  VenueAmenityEntity toEntity() {
    return VenueAmenityEntity(id: id, name: name);
  }
}

extension VenueGalleryImageMapper on VenueGalleryImage {
  VenueGalleryImageEntity toEntity() {
    return VenueGalleryImageEntity(
      id: id,
      imageUrl: imageUrl,
      sortOrder: sortOrder,
      createdAt: createdAt,
    );
  }
}

extension VenueSlotMapper on VenueSlot {
  VenueSlotEntity toEntity() {
    return VenueSlotEntity(
      id: id,
      slotName: slotName,
      startTime: startTime,
      endTime: endTime,
      capacity: capacity,
      price: price,
    );
  }
}

extension VenueServiceMapper on VenueService {
  VenueServiceEntity toEntity() {
    return VenueServiceEntity(id: id, serviceName: serviceName, price: price);
  }
}
