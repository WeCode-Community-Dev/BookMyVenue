import 'package:equatable/equatable.dart';

class AddNewVenueRequestParams extends Equatable {
  const AddNewVenueRequestParams({
    required this.venueName,
    required this.category,
    required this.description,
    required this.location,
    required this.venueSize,
    required this.maxCapacity,
    required this.amenityIds,
    required this.coverImageUrl,
    required this.galleryImages,
    this.virtualTourUrl,
    required this.slots,
    required this.services,
    required this.instantBooking,
  });

  ///BASIC INFO
  final String venueName;
  final String category;
  final String description;
  final int venueSize;
  final int maxCapacity;
  final List<String> amenityIds;

  /// MEDIA
  final String coverImageUrl;
  final List<String> galleryImages;
  final String? virtualTourUrl;

  /// LOCATION
  final VenueLocationRequestParams location;

  /// BOOKING AND PRICING
  final List<VenueSlotRequestParams> slots;
  final List<VenueServiceRequestParams> services;
  final bool instantBooking;

  @override
  List<Object?> get props => <Object?>[
    venueName,
    category,
    description,
    location,
    venueSize,
    maxCapacity,
    amenityIds,
    coverImageUrl,
    galleryImages,
    virtualTourUrl,
    slots,
    services,
    instantBooking,
  ];

  AddNewVenueRequestParams copyWith({
    String? venueName,
    String? category,
    String? description,
    VenueLocationRequestParams? location,
    int? venueSize,
    int? maxCapacity,
    List<String>? amenityIds,
    String? coverImageUrl,
    List<String>? galleryImages,
    String? virtualTourUrl,
    List<VenueSlotRequestParams>? slots,
    List<VenueServiceRequestParams>? services,
    bool? instantBooking,
  }) {
    return AddNewVenueRequestParams(
      venueName: venueName ?? this.venueName,
      category: category ?? this.category,
      description: description ?? this.description,
      location: location ?? this.location,
      venueSize: venueSize ?? this.venueSize,
      maxCapacity: maxCapacity ?? this.maxCapacity,
      amenityIds: amenityIds ?? this.amenityIds,
      coverImageUrl: coverImageUrl ?? this.coverImageUrl,
      galleryImages: galleryImages ?? this.galleryImages,
      virtualTourUrl: virtualTourUrl ?? this.virtualTourUrl,
      slots: slots ?? this.slots,
      services: services ?? this.services,
      instantBooking: instantBooking ?? this.instantBooking,
    );
  }
}

class VenueLocationRequestParams extends Equatable {
  const VenueLocationRequestParams({
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

class VenueSlotRequestParams extends Equatable {
  const VenueSlotRequestParams({
    required this.slotName,
    required this.startTime,
    required this.endTime,
    required this.price,
  });

  final String slotName;
  final String startTime;
  final String endTime;
  final double price;

  @override
  List<Object?> get props => <Object?>[slotName, startTime, endTime, price];
}

class VenueServiceRequestParams extends Equatable {
  const VenueServiceRequestParams({
    required this.serviceName,
    required this.price,
  });

  final String serviceName;
  final double price;

  @override
  List<Object?> get props => <Object?>[serviceName, price];
}
