// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'add_new_venue_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AddNewVenueRequest {

@JsonKey(name: 'venue_name') String get venueName; String get category; String get description; VenueLocationRequest get location;@JsonKey(name: 'venue_size') int get venueSize;@JsonKey(name: 'max_capacity') int get maxCapacity;@JsonKey(name: 'amenity_ids') List<String> get amenityIds;@JsonKey(name: 'cover_image_url') String get coverImageUrl;@JsonKey(name: 'gallery_images') List<String> get galleryImages;@JsonKey(name: 'virtual_tour_url') String? get virtualTourUrl; List<VenueSlotRequest> get slots; List<VenueServiceRequest> get services;@JsonKey(name: 'instant_booking') bool get instantBooking;
/// Create a copy of AddNewVenueRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AddNewVenueRequestCopyWith<AddNewVenueRequest> get copyWith => _$AddNewVenueRequestCopyWithImpl<AddNewVenueRequest>(this as AddNewVenueRequest, _$identity);

  /// Serializes this AddNewVenueRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AddNewVenueRequest&&(identical(other.venueName, venueName) || other.venueName == venueName)&&(identical(other.category, category) || other.category == category)&&(identical(other.description, description) || other.description == description)&&(identical(other.location, location) || other.location == location)&&(identical(other.venueSize, venueSize) || other.venueSize == venueSize)&&(identical(other.maxCapacity, maxCapacity) || other.maxCapacity == maxCapacity)&&const DeepCollectionEquality().equals(other.amenityIds, amenityIds)&&(identical(other.coverImageUrl, coverImageUrl) || other.coverImageUrl == coverImageUrl)&&const DeepCollectionEquality().equals(other.galleryImages, galleryImages)&&(identical(other.virtualTourUrl, virtualTourUrl) || other.virtualTourUrl == virtualTourUrl)&&const DeepCollectionEquality().equals(other.slots, slots)&&const DeepCollectionEquality().equals(other.services, services)&&(identical(other.instantBooking, instantBooking) || other.instantBooking == instantBooking));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,venueName,category,description,location,venueSize,maxCapacity,const DeepCollectionEquality().hash(amenityIds),coverImageUrl,const DeepCollectionEquality().hash(galleryImages),virtualTourUrl,const DeepCollectionEquality().hash(slots),const DeepCollectionEquality().hash(services),instantBooking);

@override
String toString() {
  return 'AddNewVenueRequest(venueName: $venueName, category: $category, description: $description, location: $location, venueSize: $venueSize, maxCapacity: $maxCapacity, amenityIds: $amenityIds, coverImageUrl: $coverImageUrl, galleryImages: $galleryImages, virtualTourUrl: $virtualTourUrl, slots: $slots, services: $services, instantBooking: $instantBooking)';
}


}

/// @nodoc
abstract mixin class $AddNewVenueRequestCopyWith<$Res>  {
  factory $AddNewVenueRequestCopyWith(AddNewVenueRequest value, $Res Function(AddNewVenueRequest) _then) = _$AddNewVenueRequestCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'venue_name') String venueName, String category, String description, VenueLocationRequest location,@JsonKey(name: 'venue_size') int venueSize,@JsonKey(name: 'max_capacity') int maxCapacity,@JsonKey(name: 'amenity_ids') List<String> amenityIds,@JsonKey(name: 'cover_image_url') String coverImageUrl,@JsonKey(name: 'gallery_images') List<String> galleryImages,@JsonKey(name: 'virtual_tour_url') String? virtualTourUrl, List<VenueSlotRequest> slots, List<VenueServiceRequest> services,@JsonKey(name: 'instant_booking') bool instantBooking
});


$VenueLocationRequestCopyWith<$Res> get location;

}
/// @nodoc
class _$AddNewVenueRequestCopyWithImpl<$Res>
    implements $AddNewVenueRequestCopyWith<$Res> {
  _$AddNewVenueRequestCopyWithImpl(this._self, this._then);

  final AddNewVenueRequest _self;
  final $Res Function(AddNewVenueRequest) _then;

/// Create a copy of AddNewVenueRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? venueName = null,Object? category = null,Object? description = null,Object? location = null,Object? venueSize = null,Object? maxCapacity = null,Object? amenityIds = null,Object? coverImageUrl = null,Object? galleryImages = null,Object? virtualTourUrl = freezed,Object? slots = null,Object? services = null,Object? instantBooking = null,}) {
  return _then(_self.copyWith(
venueName: null == venueName ? _self.venueName : venueName // ignore: cast_nullable_to_non_nullable
as String,category: null == category ? _self.category : category // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,location: null == location ? _self.location : location // ignore: cast_nullable_to_non_nullable
as VenueLocationRequest,venueSize: null == venueSize ? _self.venueSize : venueSize // ignore: cast_nullable_to_non_nullable
as int,maxCapacity: null == maxCapacity ? _self.maxCapacity : maxCapacity // ignore: cast_nullable_to_non_nullable
as int,amenityIds: null == amenityIds ? _self.amenityIds : amenityIds // ignore: cast_nullable_to_non_nullable
as List<String>,coverImageUrl: null == coverImageUrl ? _self.coverImageUrl : coverImageUrl // ignore: cast_nullable_to_non_nullable
as String,galleryImages: null == galleryImages ? _self.galleryImages : galleryImages // ignore: cast_nullable_to_non_nullable
as List<String>,virtualTourUrl: freezed == virtualTourUrl ? _self.virtualTourUrl : virtualTourUrl // ignore: cast_nullable_to_non_nullable
as String?,slots: null == slots ? _self.slots : slots // ignore: cast_nullable_to_non_nullable
as List<VenueSlotRequest>,services: null == services ? _self.services : services // ignore: cast_nullable_to_non_nullable
as List<VenueServiceRequest>,instantBooking: null == instantBooking ? _self.instantBooking : instantBooking // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}
/// Create a copy of AddNewVenueRequest
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$VenueLocationRequestCopyWith<$Res> get location {
  
  return $VenueLocationRequestCopyWith<$Res>(_self.location, (value) {
    return _then(_self.copyWith(location: value));
  });
}
}


/// Adds pattern-matching-related methods to [AddNewVenueRequest].
extension AddNewVenueRequestPatterns on AddNewVenueRequest {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AddNewVenueRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AddNewVenueRequest() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AddNewVenueRequest value)  $default,){
final _that = this;
switch (_that) {
case _AddNewVenueRequest():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AddNewVenueRequest value)?  $default,){
final _that = this;
switch (_that) {
case _AddNewVenueRequest() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'venue_name')  String venueName,  String category,  String description,  VenueLocationRequest location, @JsonKey(name: 'venue_size')  int venueSize, @JsonKey(name: 'max_capacity')  int maxCapacity, @JsonKey(name: 'amenity_ids')  List<String> amenityIds, @JsonKey(name: 'cover_image_url')  String coverImageUrl, @JsonKey(name: 'gallery_images')  List<String> galleryImages, @JsonKey(name: 'virtual_tour_url')  String? virtualTourUrl,  List<VenueSlotRequest> slots,  List<VenueServiceRequest> services, @JsonKey(name: 'instant_booking')  bool instantBooking)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AddNewVenueRequest() when $default != null:
return $default(_that.venueName,_that.category,_that.description,_that.location,_that.venueSize,_that.maxCapacity,_that.amenityIds,_that.coverImageUrl,_that.galleryImages,_that.virtualTourUrl,_that.slots,_that.services,_that.instantBooking);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'venue_name')  String venueName,  String category,  String description,  VenueLocationRequest location, @JsonKey(name: 'venue_size')  int venueSize, @JsonKey(name: 'max_capacity')  int maxCapacity, @JsonKey(name: 'amenity_ids')  List<String> amenityIds, @JsonKey(name: 'cover_image_url')  String coverImageUrl, @JsonKey(name: 'gallery_images')  List<String> galleryImages, @JsonKey(name: 'virtual_tour_url')  String? virtualTourUrl,  List<VenueSlotRequest> slots,  List<VenueServiceRequest> services, @JsonKey(name: 'instant_booking')  bool instantBooking)  $default,) {final _that = this;
switch (_that) {
case _AddNewVenueRequest():
return $default(_that.venueName,_that.category,_that.description,_that.location,_that.venueSize,_that.maxCapacity,_that.amenityIds,_that.coverImageUrl,_that.galleryImages,_that.virtualTourUrl,_that.slots,_that.services,_that.instantBooking);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'venue_name')  String venueName,  String category,  String description,  VenueLocationRequest location, @JsonKey(name: 'venue_size')  int venueSize, @JsonKey(name: 'max_capacity')  int maxCapacity, @JsonKey(name: 'amenity_ids')  List<String> amenityIds, @JsonKey(name: 'cover_image_url')  String coverImageUrl, @JsonKey(name: 'gallery_images')  List<String> galleryImages, @JsonKey(name: 'virtual_tour_url')  String? virtualTourUrl,  List<VenueSlotRequest> slots,  List<VenueServiceRequest> services, @JsonKey(name: 'instant_booking')  bool instantBooking)?  $default,) {final _that = this;
switch (_that) {
case _AddNewVenueRequest() when $default != null:
return $default(_that.venueName,_that.category,_that.description,_that.location,_that.venueSize,_that.maxCapacity,_that.amenityIds,_that.coverImageUrl,_that.galleryImages,_that.virtualTourUrl,_that.slots,_that.services,_that.instantBooking);case _:
  return null;

}
}

}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _AddNewVenueRequest implements AddNewVenueRequest {
  const _AddNewVenueRequest({@JsonKey(name: 'venue_name') required this.venueName, required this.category, required this.description, required this.location, @JsonKey(name: 'venue_size') required this.venueSize, @JsonKey(name: 'max_capacity') required this.maxCapacity, @JsonKey(name: 'amenity_ids') required final  List<String> amenityIds, @JsonKey(name: 'cover_image_url') required this.coverImageUrl, @JsonKey(name: 'gallery_images') required final  List<String> galleryImages, @JsonKey(name: 'virtual_tour_url') this.virtualTourUrl, required final  List<VenueSlotRequest> slots, required final  List<VenueServiceRequest> services, @JsonKey(name: 'instant_booking') required this.instantBooking}): _amenityIds = amenityIds,_galleryImages = galleryImages,_slots = slots,_services = services;
  factory _AddNewVenueRequest.fromJson(Map<String, dynamic> json) => _$AddNewVenueRequestFromJson(json);

@override@JsonKey(name: 'venue_name') final  String venueName;
@override final  String category;
@override final  String description;
@override final  VenueLocationRequest location;
@override@JsonKey(name: 'venue_size') final  int venueSize;
@override@JsonKey(name: 'max_capacity') final  int maxCapacity;
 final  List<String> _amenityIds;
@override@JsonKey(name: 'amenity_ids') List<String> get amenityIds {
  if (_amenityIds is EqualUnmodifiableListView) return _amenityIds;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_amenityIds);
}

@override@JsonKey(name: 'cover_image_url') final  String coverImageUrl;
 final  List<String> _galleryImages;
@override@JsonKey(name: 'gallery_images') List<String> get galleryImages {
  if (_galleryImages is EqualUnmodifiableListView) return _galleryImages;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_galleryImages);
}

@override@JsonKey(name: 'virtual_tour_url') final  String? virtualTourUrl;
 final  List<VenueSlotRequest> _slots;
@override List<VenueSlotRequest> get slots {
  if (_slots is EqualUnmodifiableListView) return _slots;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_slots);
}

 final  List<VenueServiceRequest> _services;
@override List<VenueServiceRequest> get services {
  if (_services is EqualUnmodifiableListView) return _services;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_services);
}

@override@JsonKey(name: 'instant_booking') final  bool instantBooking;

/// Create a copy of AddNewVenueRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AddNewVenueRequestCopyWith<_AddNewVenueRequest> get copyWith => __$AddNewVenueRequestCopyWithImpl<_AddNewVenueRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AddNewVenueRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _AddNewVenueRequest&&(identical(other.venueName, venueName) || other.venueName == venueName)&&(identical(other.category, category) || other.category == category)&&(identical(other.description, description) || other.description == description)&&(identical(other.location, location) || other.location == location)&&(identical(other.venueSize, venueSize) || other.venueSize == venueSize)&&(identical(other.maxCapacity, maxCapacity) || other.maxCapacity == maxCapacity)&&const DeepCollectionEquality().equals(other._amenityIds, _amenityIds)&&(identical(other.coverImageUrl, coverImageUrl) || other.coverImageUrl == coverImageUrl)&&const DeepCollectionEquality().equals(other._galleryImages, _galleryImages)&&(identical(other.virtualTourUrl, virtualTourUrl) || other.virtualTourUrl == virtualTourUrl)&&const DeepCollectionEquality().equals(other._slots, _slots)&&const DeepCollectionEquality().equals(other._services, _services)&&(identical(other.instantBooking, instantBooking) || other.instantBooking == instantBooking));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,venueName,category,description,location,venueSize,maxCapacity,const DeepCollectionEquality().hash(_amenityIds),coverImageUrl,const DeepCollectionEquality().hash(_galleryImages),virtualTourUrl,const DeepCollectionEquality().hash(_slots),const DeepCollectionEquality().hash(_services),instantBooking);

@override
String toString() {
  return 'AddNewVenueRequest(venueName: $venueName, category: $category, description: $description, location: $location, venueSize: $venueSize, maxCapacity: $maxCapacity, amenityIds: $amenityIds, coverImageUrl: $coverImageUrl, galleryImages: $galleryImages, virtualTourUrl: $virtualTourUrl, slots: $slots, services: $services, instantBooking: $instantBooking)';
}


}

/// @nodoc
abstract mixin class _$AddNewVenueRequestCopyWith<$Res> implements $AddNewVenueRequestCopyWith<$Res> {
  factory _$AddNewVenueRequestCopyWith(_AddNewVenueRequest value, $Res Function(_AddNewVenueRequest) _then) = __$AddNewVenueRequestCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'venue_name') String venueName, String category, String description, VenueLocationRequest location,@JsonKey(name: 'venue_size') int venueSize,@JsonKey(name: 'max_capacity') int maxCapacity,@JsonKey(name: 'amenity_ids') List<String> amenityIds,@JsonKey(name: 'cover_image_url') String coverImageUrl,@JsonKey(name: 'gallery_images') List<String> galleryImages,@JsonKey(name: 'virtual_tour_url') String? virtualTourUrl, List<VenueSlotRequest> slots, List<VenueServiceRequest> services,@JsonKey(name: 'instant_booking') bool instantBooking
});


@override $VenueLocationRequestCopyWith<$Res> get location;

}
/// @nodoc
class __$AddNewVenueRequestCopyWithImpl<$Res>
    implements _$AddNewVenueRequestCopyWith<$Res> {
  __$AddNewVenueRequestCopyWithImpl(this._self, this._then);

  final _AddNewVenueRequest _self;
  final $Res Function(_AddNewVenueRequest) _then;

/// Create a copy of AddNewVenueRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? venueName = null,Object? category = null,Object? description = null,Object? location = null,Object? venueSize = null,Object? maxCapacity = null,Object? amenityIds = null,Object? coverImageUrl = null,Object? galleryImages = null,Object? virtualTourUrl = freezed,Object? slots = null,Object? services = null,Object? instantBooking = null,}) {
  return _then(_AddNewVenueRequest(
venueName: null == venueName ? _self.venueName : venueName // ignore: cast_nullable_to_non_nullable
as String,category: null == category ? _self.category : category // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,location: null == location ? _self.location : location // ignore: cast_nullable_to_non_nullable
as VenueLocationRequest,venueSize: null == venueSize ? _self.venueSize : venueSize // ignore: cast_nullable_to_non_nullable
as int,maxCapacity: null == maxCapacity ? _self.maxCapacity : maxCapacity // ignore: cast_nullable_to_non_nullable
as int,amenityIds: null == amenityIds ? _self._amenityIds : amenityIds // ignore: cast_nullable_to_non_nullable
as List<String>,coverImageUrl: null == coverImageUrl ? _self.coverImageUrl : coverImageUrl // ignore: cast_nullable_to_non_nullable
as String,galleryImages: null == galleryImages ? _self._galleryImages : galleryImages // ignore: cast_nullable_to_non_nullable
as List<String>,virtualTourUrl: freezed == virtualTourUrl ? _self.virtualTourUrl : virtualTourUrl // ignore: cast_nullable_to_non_nullable
as String?,slots: null == slots ? _self._slots : slots // ignore: cast_nullable_to_non_nullable
as List<VenueSlotRequest>,services: null == services ? _self._services : services // ignore: cast_nullable_to_non_nullable
as List<VenueServiceRequest>,instantBooking: null == instantBooking ? _self.instantBooking : instantBooking // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

/// Create a copy of AddNewVenueRequest
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$VenueLocationRequestCopyWith<$Res> get location {
  
  return $VenueLocationRequestCopyWith<$Res>(_self.location, (value) {
    return _then(_self.copyWith(location: value));
  });
}
}


/// @nodoc
mixin _$VenueLocationRequest {

 String get address; String get city; String get state; String get country; String get pincode; double get latitude; double get longitude;
/// Create a copy of VenueLocationRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$VenueLocationRequestCopyWith<VenueLocationRequest> get copyWith => _$VenueLocationRequestCopyWithImpl<VenueLocationRequest>(this as VenueLocationRequest, _$identity);

  /// Serializes this VenueLocationRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VenueLocationRequest&&(identical(other.address, address) || other.address == address)&&(identical(other.city, city) || other.city == city)&&(identical(other.state, state) || other.state == state)&&(identical(other.country, country) || other.country == country)&&(identical(other.pincode, pincode) || other.pincode == pincode)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,address,city,state,country,pincode,latitude,longitude);

@override
String toString() {
  return 'VenueLocationRequest(address: $address, city: $city, state: $state, country: $country, pincode: $pincode, latitude: $latitude, longitude: $longitude)';
}


}

/// @nodoc
abstract mixin class $VenueLocationRequestCopyWith<$Res>  {
  factory $VenueLocationRequestCopyWith(VenueLocationRequest value, $Res Function(VenueLocationRequest) _then) = _$VenueLocationRequestCopyWithImpl;
@useResult
$Res call({
 String address, String city, String state, String country, String pincode, double latitude, double longitude
});




}
/// @nodoc
class _$VenueLocationRequestCopyWithImpl<$Res>
    implements $VenueLocationRequestCopyWith<$Res> {
  _$VenueLocationRequestCopyWithImpl(this._self, this._then);

  final VenueLocationRequest _self;
  final $Res Function(VenueLocationRequest) _then;

/// Create a copy of VenueLocationRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? address = null,Object? city = null,Object? state = null,Object? country = null,Object? pincode = null,Object? latitude = null,Object? longitude = null,}) {
  return _then(_self.copyWith(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,city: null == city ? _self.city : city // ignore: cast_nullable_to_non_nullable
as String,state: null == state ? _self.state : state // ignore: cast_nullable_to_non_nullable
as String,country: null == country ? _self.country : country // ignore: cast_nullable_to_non_nullable
as String,pincode: null == pincode ? _self.pincode : pincode // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [VenueLocationRequest].
extension VenueLocationRequestPatterns on VenueLocationRequest {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _VenueLocationRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _VenueLocationRequest() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _VenueLocationRequest value)  $default,){
final _that = this;
switch (_that) {
case _VenueLocationRequest():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _VenueLocationRequest value)?  $default,){
final _that = this;
switch (_that) {
case _VenueLocationRequest() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String address,  String city,  String state,  String country,  String pincode,  double latitude,  double longitude)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _VenueLocationRequest() when $default != null:
return $default(_that.address,_that.city,_that.state,_that.country,_that.pincode,_that.latitude,_that.longitude);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String address,  String city,  String state,  String country,  String pincode,  double latitude,  double longitude)  $default,) {final _that = this;
switch (_that) {
case _VenueLocationRequest():
return $default(_that.address,_that.city,_that.state,_that.country,_that.pincode,_that.latitude,_that.longitude);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String address,  String city,  String state,  String country,  String pincode,  double latitude,  double longitude)?  $default,) {final _that = this;
switch (_that) {
case _VenueLocationRequest() when $default != null:
return $default(_that.address,_that.city,_that.state,_that.country,_that.pincode,_that.latitude,_that.longitude);case _:
  return null;

}
}

}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _VenueLocationRequest implements VenueLocationRequest {
  const _VenueLocationRequest({required this.address, required this.city, required this.state, required this.country, required this.pincode, required this.latitude, required this.longitude});
  factory _VenueLocationRequest.fromJson(Map<String, dynamic> json) => _$VenueLocationRequestFromJson(json);

@override final  String address;
@override final  String city;
@override final  String state;
@override final  String country;
@override final  String pincode;
@override final  double latitude;
@override final  double longitude;

/// Create a copy of VenueLocationRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VenueLocationRequestCopyWith<_VenueLocationRequest> get copyWith => __$VenueLocationRequestCopyWithImpl<_VenueLocationRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$VenueLocationRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VenueLocationRequest&&(identical(other.address, address) || other.address == address)&&(identical(other.city, city) || other.city == city)&&(identical(other.state, state) || other.state == state)&&(identical(other.country, country) || other.country == country)&&(identical(other.pincode, pincode) || other.pincode == pincode)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,address,city,state,country,pincode,latitude,longitude);

@override
String toString() {
  return 'VenueLocationRequest(address: $address, city: $city, state: $state, country: $country, pincode: $pincode, latitude: $latitude, longitude: $longitude)';
}


}

/// @nodoc
abstract mixin class _$VenueLocationRequestCopyWith<$Res> implements $VenueLocationRequestCopyWith<$Res> {
  factory _$VenueLocationRequestCopyWith(_VenueLocationRequest value, $Res Function(_VenueLocationRequest) _then) = __$VenueLocationRequestCopyWithImpl;
@override @useResult
$Res call({
 String address, String city, String state, String country, String pincode, double latitude, double longitude
});




}
/// @nodoc
class __$VenueLocationRequestCopyWithImpl<$Res>
    implements _$VenueLocationRequestCopyWith<$Res> {
  __$VenueLocationRequestCopyWithImpl(this._self, this._then);

  final _VenueLocationRequest _self;
  final $Res Function(_VenueLocationRequest) _then;

/// Create a copy of VenueLocationRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? address = null,Object? city = null,Object? state = null,Object? country = null,Object? pincode = null,Object? latitude = null,Object? longitude = null,}) {
  return _then(_VenueLocationRequest(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,city: null == city ? _self.city : city // ignore: cast_nullable_to_non_nullable
as String,state: null == state ? _self.state : state // ignore: cast_nullable_to_non_nullable
as String,country: null == country ? _self.country : country // ignore: cast_nullable_to_non_nullable
as String,pincode: null == pincode ? _self.pincode : pincode // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}


/// @nodoc
mixin _$VenueSlotRequest {

@JsonKey(name: 'slot_name') String get slotName;@JsonKey(name: 'start_time') String get startTime;@JsonKey(name: 'end_time') String get endTime; double get price;
/// Create a copy of VenueSlotRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$VenueSlotRequestCopyWith<VenueSlotRequest> get copyWith => _$VenueSlotRequestCopyWithImpl<VenueSlotRequest>(this as VenueSlotRequest, _$identity);

  /// Serializes this VenueSlotRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VenueSlotRequest&&(identical(other.slotName, slotName) || other.slotName == slotName)&&(identical(other.startTime, startTime) || other.startTime == startTime)&&(identical(other.endTime, endTime) || other.endTime == endTime)&&(identical(other.price, price) || other.price == price));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,slotName,startTime,endTime,price);

@override
String toString() {
  return 'VenueSlotRequest(slotName: $slotName, startTime: $startTime, endTime: $endTime, price: $price)';
}


}

/// @nodoc
abstract mixin class $VenueSlotRequestCopyWith<$Res>  {
  factory $VenueSlotRequestCopyWith(VenueSlotRequest value, $Res Function(VenueSlotRequest) _then) = _$VenueSlotRequestCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'slot_name') String slotName,@JsonKey(name: 'start_time') String startTime,@JsonKey(name: 'end_time') String endTime, double price
});




}
/// @nodoc
class _$VenueSlotRequestCopyWithImpl<$Res>
    implements $VenueSlotRequestCopyWith<$Res> {
  _$VenueSlotRequestCopyWithImpl(this._self, this._then);

  final VenueSlotRequest _self;
  final $Res Function(VenueSlotRequest) _then;

/// Create a copy of VenueSlotRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? slotName = null,Object? startTime = null,Object? endTime = null,Object? price = null,}) {
  return _then(_self.copyWith(
slotName: null == slotName ? _self.slotName : slotName // ignore: cast_nullable_to_non_nullable
as String,startTime: null == startTime ? _self.startTime : startTime // ignore: cast_nullable_to_non_nullable
as String,endTime: null == endTime ? _self.endTime : endTime // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [VenueSlotRequest].
extension VenueSlotRequestPatterns on VenueSlotRequest {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _VenueSlotRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _VenueSlotRequest() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _VenueSlotRequest value)  $default,){
final _that = this;
switch (_that) {
case _VenueSlotRequest():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _VenueSlotRequest value)?  $default,){
final _that = this;
switch (_that) {
case _VenueSlotRequest() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'slot_name')  String slotName, @JsonKey(name: 'start_time')  String startTime, @JsonKey(name: 'end_time')  String endTime,  double price)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _VenueSlotRequest() when $default != null:
return $default(_that.slotName,_that.startTime,_that.endTime,_that.price);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'slot_name')  String slotName, @JsonKey(name: 'start_time')  String startTime, @JsonKey(name: 'end_time')  String endTime,  double price)  $default,) {final _that = this;
switch (_that) {
case _VenueSlotRequest():
return $default(_that.slotName,_that.startTime,_that.endTime,_that.price);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'slot_name')  String slotName, @JsonKey(name: 'start_time')  String startTime, @JsonKey(name: 'end_time')  String endTime,  double price)?  $default,) {final _that = this;
switch (_that) {
case _VenueSlotRequest() when $default != null:
return $default(_that.slotName,_that.startTime,_that.endTime,_that.price);case _:
  return null;

}
}

}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _VenueSlotRequest implements VenueSlotRequest {
  const _VenueSlotRequest({@JsonKey(name: 'slot_name') required this.slotName, @JsonKey(name: 'start_time') required this.startTime, @JsonKey(name: 'end_time') required this.endTime, required this.price});
  factory _VenueSlotRequest.fromJson(Map<String, dynamic> json) => _$VenueSlotRequestFromJson(json);

@override@JsonKey(name: 'slot_name') final  String slotName;
@override@JsonKey(name: 'start_time') final  String startTime;
@override@JsonKey(name: 'end_time') final  String endTime;
@override final  double price;

/// Create a copy of VenueSlotRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VenueSlotRequestCopyWith<_VenueSlotRequest> get copyWith => __$VenueSlotRequestCopyWithImpl<_VenueSlotRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$VenueSlotRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VenueSlotRequest&&(identical(other.slotName, slotName) || other.slotName == slotName)&&(identical(other.startTime, startTime) || other.startTime == startTime)&&(identical(other.endTime, endTime) || other.endTime == endTime)&&(identical(other.price, price) || other.price == price));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,slotName,startTime,endTime,price);

@override
String toString() {
  return 'VenueSlotRequest(slotName: $slotName, startTime: $startTime, endTime: $endTime, price: $price)';
}


}

/// @nodoc
abstract mixin class _$VenueSlotRequestCopyWith<$Res> implements $VenueSlotRequestCopyWith<$Res> {
  factory _$VenueSlotRequestCopyWith(_VenueSlotRequest value, $Res Function(_VenueSlotRequest) _then) = __$VenueSlotRequestCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'slot_name') String slotName,@JsonKey(name: 'start_time') String startTime,@JsonKey(name: 'end_time') String endTime, double price
});




}
/// @nodoc
class __$VenueSlotRequestCopyWithImpl<$Res>
    implements _$VenueSlotRequestCopyWith<$Res> {
  __$VenueSlotRequestCopyWithImpl(this._self, this._then);

  final _VenueSlotRequest _self;
  final $Res Function(_VenueSlotRequest) _then;

/// Create a copy of VenueSlotRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? slotName = null,Object? startTime = null,Object? endTime = null,Object? price = null,}) {
  return _then(_VenueSlotRequest(
slotName: null == slotName ? _self.slotName : slotName // ignore: cast_nullable_to_non_nullable
as String,startTime: null == startTime ? _self.startTime : startTime // ignore: cast_nullable_to_non_nullable
as String,endTime: null == endTime ? _self.endTime : endTime // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}


/// @nodoc
mixin _$VenueServiceRequest {

@JsonKey(name: 'service_name') String get serviceName; double get price;
/// Create a copy of VenueServiceRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$VenueServiceRequestCopyWith<VenueServiceRequest> get copyWith => _$VenueServiceRequestCopyWithImpl<VenueServiceRequest>(this as VenueServiceRequest, _$identity);

  /// Serializes this VenueServiceRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VenueServiceRequest&&(identical(other.serviceName, serviceName) || other.serviceName == serviceName)&&(identical(other.price, price) || other.price == price));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,serviceName,price);

@override
String toString() {
  return 'VenueServiceRequest(serviceName: $serviceName, price: $price)';
}


}

/// @nodoc
abstract mixin class $VenueServiceRequestCopyWith<$Res>  {
  factory $VenueServiceRequestCopyWith(VenueServiceRequest value, $Res Function(VenueServiceRequest) _then) = _$VenueServiceRequestCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'service_name') String serviceName, double price
});




}
/// @nodoc
class _$VenueServiceRequestCopyWithImpl<$Res>
    implements $VenueServiceRequestCopyWith<$Res> {
  _$VenueServiceRequestCopyWithImpl(this._self, this._then);

  final VenueServiceRequest _self;
  final $Res Function(VenueServiceRequest) _then;

/// Create a copy of VenueServiceRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? serviceName = null,Object? price = null,}) {
  return _then(_self.copyWith(
serviceName: null == serviceName ? _self.serviceName : serviceName // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [VenueServiceRequest].
extension VenueServiceRequestPatterns on VenueServiceRequest {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _VenueServiceRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _VenueServiceRequest() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _VenueServiceRequest value)  $default,){
final _that = this;
switch (_that) {
case _VenueServiceRequest():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _VenueServiceRequest value)?  $default,){
final _that = this;
switch (_that) {
case _VenueServiceRequest() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'service_name')  String serviceName,  double price)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _VenueServiceRequest() when $default != null:
return $default(_that.serviceName,_that.price);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'service_name')  String serviceName,  double price)  $default,) {final _that = this;
switch (_that) {
case _VenueServiceRequest():
return $default(_that.serviceName,_that.price);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'service_name')  String serviceName,  double price)?  $default,) {final _that = this;
switch (_that) {
case _VenueServiceRequest() when $default != null:
return $default(_that.serviceName,_that.price);case _:
  return null;

}
}

}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _VenueServiceRequest implements VenueServiceRequest {
  const _VenueServiceRequest({@JsonKey(name: 'service_name') required this.serviceName, required this.price});
  factory _VenueServiceRequest.fromJson(Map<String, dynamic> json) => _$VenueServiceRequestFromJson(json);

@override@JsonKey(name: 'service_name') final  String serviceName;
@override final  double price;

/// Create a copy of VenueServiceRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VenueServiceRequestCopyWith<_VenueServiceRequest> get copyWith => __$VenueServiceRequestCopyWithImpl<_VenueServiceRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$VenueServiceRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VenueServiceRequest&&(identical(other.serviceName, serviceName) || other.serviceName == serviceName)&&(identical(other.price, price) || other.price == price));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,serviceName,price);

@override
String toString() {
  return 'VenueServiceRequest(serviceName: $serviceName, price: $price)';
}


}

/// @nodoc
abstract mixin class _$VenueServiceRequestCopyWith<$Res> implements $VenueServiceRequestCopyWith<$Res> {
  factory _$VenueServiceRequestCopyWith(_VenueServiceRequest value, $Res Function(_VenueServiceRequest) _then) = __$VenueServiceRequestCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'service_name') String serviceName, double price
});




}
/// @nodoc
class __$VenueServiceRequestCopyWithImpl<$Res>
    implements _$VenueServiceRequestCopyWith<$Res> {
  __$VenueServiceRequestCopyWithImpl(this._self, this._then);

  final _VenueServiceRequest _self;
  final $Res Function(_VenueServiceRequest) _then;

/// Create a copy of VenueServiceRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? serviceName = null,Object? price = null,}) {
  return _then(_VenueServiceRequest(
serviceName: null == serviceName ? _self.serviceName : serviceName // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}

// dart format on
