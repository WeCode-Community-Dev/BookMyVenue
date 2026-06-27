import 'package:equatable/equatable.dart';

class AddNewVenueRequestParams extends Equatable {
  const AddNewVenueRequestParams({
    required this.venueName,
    required this.category,
    required this.description,
    required this.location,
    required this.minCapacity,
    required this.maxCapacity,
    required this.amenityIds,
    required this.coverImageUrl,
    required this.galleryImages,
    this.virtualTourUrl,
    required this.slots,
    required this.services,
    required this.instantBooking,
  });

  final String venueName;
  final String category;
  final String description;
  final int minCapacity;
  final int maxCapacity;
  final List<String> amenityIds;
  final String coverImageUrl;
  final List<String> galleryImages;
  final String? virtualTourUrl;
  final VenueLocationRequestParams location;
  final List<VenueSlotRequestParams> slots;
  final List<VenueServiceRequestParams> services;
  final bool instantBooking;

  @override
  List<Object?> get props => <Object?>[
    venueName,
    category,
    description,
    location,
    minCapacity,
    maxCapacity,
    amenityIds,
    coverImageUrl,
    galleryImages,
    virtualTourUrl,
    slots,
    services,
    instantBooking,
  ];
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
    required this.capacity,
    required this.price,
  });

  final String slotName;
  final String startTime;
  final String endTime;
  final int capacity;
  final double price;

  @override
  List<Object?> get props => <Object?>[
    slotName,
    startTime,
    endTime,
    capacity,
    price,
  ];
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
