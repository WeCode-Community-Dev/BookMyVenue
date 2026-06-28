// ignore_for_file: public_member_api_docs, sort_constructors_first
part of 'venue_details_cubit.dart';

@freezed
sealed class VenueDetailsState with _$VenueDetailsState {
  const factory VenueDetailsState({
    VenueBasicInfoState? basicInfo,
    VenueLocationState? location,
    VenueMediaState? media,
    List<VenuePricingState>? pricing,
    List<VenueServiceState>? service,
    required int step,
  }) = _VenueDetailsState;
}

class VenueBasicInfoState {
  const VenueBasicInfoState({
    required this.venueName,
    required this.category,
    required this.description,
    required this.minCapacity,
    required this.maxCapacity,
    required this.amenities,
  });
  final String venueName;
  final VenueCategory category;
  final String description;
  final int minCapacity;
  final int maxCapacity;
  final List<VenueAmenityEntity> amenities;

  VenueBasicInfoState copyWith({
    String? venueName,
    VenueCategory? category,
    String? description,
    int? minCapacity,
    int? maxCapacity,
    List<VenueAmenityEntity>? amenities,
  }) {
    return VenueBasicInfoState(
      venueName: venueName ?? this.venueName,
      category: category ?? this.category,
      description: description ?? this.description,
      minCapacity: minCapacity ?? this.minCapacity,
      maxCapacity: maxCapacity ?? this.maxCapacity,
      amenities: amenities ?? this.amenities,
    );
  }

  @override
  String toString() {
    return 'VenueBasicInfoState(venueName: $venueName, category: $category, description: $description, minCapacity: $minCapacity, maxCapacity: $maxCapacity, amenities: $amenities)';
  }
}

class VenueMediaState {
  VenueMediaState({
    required this.coverImageUrl,
    required this.galleryImages,
    required this.virtualTourUrl,
  });

  final String coverImageUrl;
  final List<String> galleryImages;
  final String? virtualTourUrl;

  VenueMediaState copyWith({
    String? coverImageUrl,
    List<String>? galleryImages,
    String? virtualTourUrl,
  }) {
    return VenueMediaState(
      coverImageUrl: coverImageUrl ?? this.coverImageUrl,
      galleryImages: galleryImages ?? this.galleryImages,
      virtualTourUrl: virtualTourUrl ?? this.virtualTourUrl,
    );
  }

  @override
  String toString() =>
      'VenueMediaState(coverImageUrl: $coverImageUrl, galleryImages: $galleryImages, virtualTourUrl: $virtualTourUrl)';
}

class VenueLocationState {
  VenueLocationState({
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

  VenueLocationState copyWith({
    String? address,
    String? city,
    String? state,
    String? country,
    String? pincode,
    double? latitude,
    double? longitude,
  }) {
    return VenueLocationState(
      address: address ?? this.address,
      city: city ?? this.city,
      state: state ?? this.state,
      country: country ?? this.country,
      pincode: pincode ?? this.pincode,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
    );
  }

  @override
  String toString() {
    return 'VenueLocationState(address: $address, city: $city, state: $state, country: $country, pincode: $pincode, latitude: $latitude, longitude: $longitude)';
  }
}

class VenuePricingState {
  VenuePricingState({
    required this.slotName,
    required this.startTime,
    required this.endTime,
    required this.capacity,
    required this.price,
    required this.instantBooking,
  });

  final String slotName;
  final String startTime;
  final String endTime;
  final int capacity;
  final double price;
  final bool instantBooking;

  VenuePricingState copyWith({
    String? slotName,
    String? startTime,
    String? endTime,
    int? capacity,
    double? price,
    bool? instantBooking,
  }) {
    return VenuePricingState(
      slotName: slotName ?? this.slotName,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      capacity: capacity ?? this.capacity,
      price: price ?? this.price,
      instantBooking: instantBooking ?? this.instantBooking,
    );
  }

  @override
  String toString() {
    return 'VenuePricingState(slotNam: $slotName, startTime: $startTime, endTime: $endTime, capacity: $capacity, price: $price, instantBooking: $instantBooking)';
  }
}

class VenueServiceState {
  VenueServiceState({required this.serviceName, required this.servicePrice});

  final String serviceName;
  final double servicePrice;

  VenueServiceState copyWith({String? serviceName, double? servicePrice}) {
    return VenueServiceState(
      serviceName: serviceName ?? this.serviceName,
      servicePrice: servicePrice ?? this.servicePrice,
    );
  }

  @override
  String toString() =>
      'VenueServiceState(serviceName: $serviceName, servicePrice: $servicePrice)';
}
