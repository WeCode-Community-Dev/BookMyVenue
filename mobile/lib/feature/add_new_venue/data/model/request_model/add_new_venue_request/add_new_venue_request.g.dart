// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'add_new_venue_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AddNewVenueRequest _$AddNewVenueRequestFromJson(Map<String, dynamic> json) =>
    _AddNewVenueRequest(
      venueName: json['venue_name'] as String,
      category: json['category'] as String,
      description: json['description'] as String,
      location: VenueLocationRequest.fromJson(
        json['location'] as Map<String, dynamic>,
      ),
      minCapacity: (json['min_capacity'] as num).toInt(),
      maxCapacity: (json['max_capacity'] as num).toInt(),
      amenityIds: (json['amenity_ids'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      coverImageUrl: json['cover_image_url'] as String,
      galleryImages: (json['gallery_images'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      virtualTourUrl: json['virtual_tour_url'] as String?,
      slots: (json['slots'] as List<dynamic>)
          .map((e) => VenueSlotRequest.fromJson(e as Map<String, dynamic>))
          .toList(),
      services: (json['services'] as List<dynamic>)
          .map((e) => VenueServiceRequest.fromJson(e as Map<String, dynamic>))
          .toList(),
      instantBooking: json['instant_booking'] as bool,
    );

Map<String, dynamic> _$AddNewVenueRequestToJson(_AddNewVenueRequest instance) =>
    <String, dynamic>{
      'venue_name': instance.venueName,
      'category': instance.category,
      'description': instance.description,
      'location': instance.location,
      'min_capacity': instance.minCapacity,
      'max_capacity': instance.maxCapacity,
      'amenity_ids': instance.amenityIds,
      'cover_image_url': instance.coverImageUrl,
      'gallery_images': instance.galleryImages,
      'virtual_tour_url': instance.virtualTourUrl,
      'slots': instance.slots,
      'services': instance.services,
      'instant_booking': instance.instantBooking,
    };

_VenueLocationRequest _$VenueLocationRequestFromJson(
  Map<String, dynamic> json,
) => _VenueLocationRequest(
  address: json['address'] as String,
  city: json['city'] as String,
  state: json['state'] as String,
  country: json['country'] as String,
  pincode: json['pincode'] as String,
  latitude: (json['latitude'] as num).toDouble(),
  longitude: (json['longitude'] as num).toDouble(),
);

Map<String, dynamic> _$VenueLocationRequestToJson(
  _VenueLocationRequest instance,
) => <String, dynamic>{
  'address': instance.address,
  'city': instance.city,
  'state': instance.state,
  'country': instance.country,
  'pincode': instance.pincode,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
};

_VenueSlotRequest _$VenueSlotRequestFromJson(Map<String, dynamic> json) =>
    _VenueSlotRequest(
      slotName: json['slot_name'] as String,
      startTime: json['start_time'] as String,
      endTime: json['end_time'] as String,
      capacity: (json['capacity'] as num).toInt(),
      price: (json['price'] as num).toDouble(),
    );

Map<String, dynamic> _$VenueSlotRequestToJson(_VenueSlotRequest instance) =>
    <String, dynamic>{
      'slot_name': instance.slotName,
      'start_time': instance.startTime,
      'end_time': instance.endTime,
      'capacity': instance.capacity,
      'price': instance.price,
    };

_VenueServiceRequest _$VenueServiceRequestFromJson(Map<String, dynamic> json) =>
    _VenueServiceRequest(
      serviceName: json['service_name'] as String,
      price: (json['price'] as num).toDouble(),
    );

Map<String, dynamic> _$VenueServiceRequestToJson(
  _VenueServiceRequest instance,
) => <String, dynamic>{
  'service_name': instance.serviceName,
  'price': instance.price,
};
