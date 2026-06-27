// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'venue_response_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$VenueResponseModel {

 String get id;@JsonKey(name: 'owner_id') String get ownerId;@JsonKey(name: 'venue_name') String get venueName; String get slug; String get category; String get description; VenueLocation get location;@JsonKey(name: 'min_capacity') int get minCapacity;@JsonKey(name: 'max_capacity') int get maxCapacity; List<VenueAmenity> get amenities;@JsonKey(name: 'cover_image_url') String get coverImageUrl;@JsonKey(name: 'gallery_images') List<VenueGalleryImage> get galleryImages;@JsonKey(name: 'virtual_tour_url') String? get virtualTourUrl; List<VenueSlot> get slots; List<VenueService> get services;@JsonKey(name: 'instant_booking') bool get instantBooking; String get status;@JsonKey(name: 'average_rating') double get averageRating;@JsonKey(name: 'total_reviews') int get totalReviews;@JsonKey(name: 'view_count') int get viewCount;@JsonKey(name: 'booking_count') int get bookingCount;@JsonKey(name: 'is_featured') bool get isFeatured;@JsonKey(name: 'verification_status') String get verificationStatus;@JsonKey(name: 'approved_by') String? get approvedBy;@JsonKey(name: 'approved_at') DateTime? get approvedAt;@JsonKey(name: 'rejection_reason') String? get rejectionReason;@JsonKey(name: 'published_at') DateTime? get publishedAt;@JsonKey(name: 'created_at') DateTime get createdAt;@JsonKey(name: 'updated_at') DateTime get updatedAt;
/// Create a copy of VenueResponseModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$VenueResponseModelCopyWith<VenueResponseModel> get copyWith => _$VenueResponseModelCopyWithImpl<VenueResponseModel>(this as VenueResponseModel, _$identity);

  /// Serializes this VenueResponseModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VenueResponseModel&&(identical(other.id, id) || other.id == id)&&(identical(other.ownerId, ownerId) || other.ownerId == ownerId)&&(identical(other.venueName, venueName) || other.venueName == venueName)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.category, category) || other.category == category)&&(identical(other.description, description) || other.description == description)&&(identical(other.location, location) || other.location == location)&&(identical(other.minCapacity, minCapacity) || other.minCapacity == minCapacity)&&(identical(other.maxCapacity, maxCapacity) || other.maxCapacity == maxCapacity)&&const DeepCollectionEquality().equals(other.amenities, amenities)&&(identical(other.coverImageUrl, coverImageUrl) || other.coverImageUrl == coverImageUrl)&&const DeepCollectionEquality().equals(other.galleryImages, galleryImages)&&(identical(other.virtualTourUrl, virtualTourUrl) || other.virtualTourUrl == virtualTourUrl)&&const DeepCollectionEquality().equals(other.slots, slots)&&const DeepCollectionEquality().equals(other.services, services)&&(identical(other.instantBooking, instantBooking) || other.instantBooking == instantBooking)&&(identical(other.status, status) || other.status == status)&&(identical(other.averageRating, averageRating) || other.averageRating == averageRating)&&(identical(other.totalReviews, totalReviews) || other.totalReviews == totalReviews)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.bookingCount, bookingCount) || other.bookingCount == bookingCount)&&(identical(other.isFeatured, isFeatured) || other.isFeatured == isFeatured)&&(identical(other.verificationStatus, verificationStatus) || other.verificationStatus == verificationStatus)&&(identical(other.approvedBy, approvedBy) || other.approvedBy == approvedBy)&&(identical(other.approvedAt, approvedAt) || other.approvedAt == approvedAt)&&(identical(other.rejectionReason, rejectionReason) || other.rejectionReason == rejectionReason)&&(identical(other.publishedAt, publishedAt) || other.publishedAt == publishedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,ownerId,venueName,slug,category,description,location,minCapacity,maxCapacity,const DeepCollectionEquality().hash(amenities),coverImageUrl,const DeepCollectionEquality().hash(galleryImages),virtualTourUrl,const DeepCollectionEquality().hash(slots),const DeepCollectionEquality().hash(services),instantBooking,status,averageRating,totalReviews,viewCount,bookingCount,isFeatured,verificationStatus,approvedBy,approvedAt,rejectionReason,publishedAt,createdAt,updatedAt]);

@override
String toString() {
  return 'VenueResponseModel(id: $id, ownerId: $ownerId, venueName: $venueName, slug: $slug, category: $category, description: $description, location: $location, minCapacity: $minCapacity, maxCapacity: $maxCapacity, amenities: $amenities, coverImageUrl: $coverImageUrl, galleryImages: $galleryImages, virtualTourUrl: $virtualTourUrl, slots: $slots, services: $services, instantBooking: $instantBooking, status: $status, averageRating: $averageRating, totalReviews: $totalReviews, viewCount: $viewCount, bookingCount: $bookingCount, isFeatured: $isFeatured, verificationStatus: $verificationStatus, approvedBy: $approvedBy, approvedAt: $approvedAt, rejectionReason: $rejectionReason, publishedAt: $publishedAt, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $VenueResponseModelCopyWith<$Res>  {
  factory $VenueResponseModelCopyWith(VenueResponseModel value, $Res Function(VenueResponseModel) _then) = _$VenueResponseModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'owner_id') String ownerId,@JsonKey(name: 'venue_name') String venueName, String slug, String category, String description, VenueLocation location,@JsonKey(name: 'min_capacity') int minCapacity,@JsonKey(name: 'max_capacity') int maxCapacity, List<VenueAmenity> amenities,@JsonKey(name: 'cover_image_url') String coverImageUrl,@JsonKey(name: 'gallery_images') List<VenueGalleryImage> galleryImages,@JsonKey(name: 'virtual_tour_url') String? virtualTourUrl, List<VenueSlot> slots, List<VenueService> services,@JsonKey(name: 'instant_booking') bool instantBooking, String status,@JsonKey(name: 'average_rating') double averageRating,@JsonKey(name: 'total_reviews') int totalReviews,@JsonKey(name: 'view_count') int viewCount,@JsonKey(name: 'booking_count') int bookingCount,@JsonKey(name: 'is_featured') bool isFeatured,@JsonKey(name: 'verification_status') String verificationStatus,@JsonKey(name: 'approved_by') String? approvedBy,@JsonKey(name: 'approved_at') DateTime? approvedAt,@JsonKey(name: 'rejection_reason') String? rejectionReason,@JsonKey(name: 'published_at') DateTime? publishedAt,@JsonKey(name: 'created_at') DateTime createdAt,@JsonKey(name: 'updated_at') DateTime updatedAt
});


$VenueLocationCopyWith<$Res> get location;

}
/// @nodoc
class _$VenueResponseModelCopyWithImpl<$Res>
    implements $VenueResponseModelCopyWith<$Res> {
  _$VenueResponseModelCopyWithImpl(this._self, this._then);

  final VenueResponseModel _self;
  final $Res Function(VenueResponseModel) _then;

/// Create a copy of VenueResponseModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? ownerId = null,Object? venueName = null,Object? slug = null,Object? category = null,Object? description = null,Object? location = null,Object? minCapacity = null,Object? maxCapacity = null,Object? amenities = null,Object? coverImageUrl = null,Object? galleryImages = null,Object? virtualTourUrl = freezed,Object? slots = null,Object? services = null,Object? instantBooking = null,Object? status = null,Object? averageRating = null,Object? totalReviews = null,Object? viewCount = null,Object? bookingCount = null,Object? isFeatured = null,Object? verificationStatus = null,Object? approvedBy = freezed,Object? approvedAt = freezed,Object? rejectionReason = freezed,Object? publishedAt = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,ownerId: null == ownerId ? _self.ownerId : ownerId // ignore: cast_nullable_to_non_nullable
as String,venueName: null == venueName ? _self.venueName : venueName // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,category: null == category ? _self.category : category // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,location: null == location ? _self.location : location // ignore: cast_nullable_to_non_nullable
as VenueLocation,minCapacity: null == minCapacity ? _self.minCapacity : minCapacity // ignore: cast_nullable_to_non_nullable
as int,maxCapacity: null == maxCapacity ? _self.maxCapacity : maxCapacity // ignore: cast_nullable_to_non_nullable
as int,amenities: null == amenities ? _self.amenities : amenities // ignore: cast_nullable_to_non_nullable
as List<VenueAmenity>,coverImageUrl: null == coverImageUrl ? _self.coverImageUrl : coverImageUrl // ignore: cast_nullable_to_non_nullable
as String,galleryImages: null == galleryImages ? _self.galleryImages : galleryImages // ignore: cast_nullable_to_non_nullable
as List<VenueGalleryImage>,virtualTourUrl: freezed == virtualTourUrl ? _self.virtualTourUrl : virtualTourUrl // ignore: cast_nullable_to_non_nullable
as String?,slots: null == slots ? _self.slots : slots // ignore: cast_nullable_to_non_nullable
as List<VenueSlot>,services: null == services ? _self.services : services // ignore: cast_nullable_to_non_nullable
as List<VenueService>,instantBooking: null == instantBooking ? _self.instantBooking : instantBooking // ignore: cast_nullable_to_non_nullable
as bool,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,averageRating: null == averageRating ? _self.averageRating : averageRating // ignore: cast_nullable_to_non_nullable
as double,totalReviews: null == totalReviews ? _self.totalReviews : totalReviews // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,bookingCount: null == bookingCount ? _self.bookingCount : bookingCount // ignore: cast_nullable_to_non_nullable
as int,isFeatured: null == isFeatured ? _self.isFeatured : isFeatured // ignore: cast_nullable_to_non_nullable
as bool,verificationStatus: null == verificationStatus ? _self.verificationStatus : verificationStatus // ignore: cast_nullable_to_non_nullable
as String,approvedBy: freezed == approvedBy ? _self.approvedBy : approvedBy // ignore: cast_nullable_to_non_nullable
as String?,approvedAt: freezed == approvedAt ? _self.approvedAt : approvedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,rejectionReason: freezed == rejectionReason ? _self.rejectionReason : rejectionReason // ignore: cast_nullable_to_non_nullable
as String?,publishedAt: freezed == publishedAt ? _self.publishedAt : publishedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}
/// Create a copy of VenueResponseModel
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$VenueLocationCopyWith<$Res> get location {
  
  return $VenueLocationCopyWith<$Res>(_self.location, (value) {
    return _then(_self.copyWith(location: value));
  });
}
}


/// Adds pattern-matching-related methods to [VenueResponseModel].
extension VenueResponseModelPatterns on VenueResponseModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _VenueResponseModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _VenueResponseModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _VenueResponseModel value)  $default,){
final _that = this;
switch (_that) {
case _VenueResponseModel():
return $default(_that);}
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _VenueResponseModel value)?  $default,){
final _that = this;
switch (_that) {
case _VenueResponseModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'owner_id')  String ownerId, @JsonKey(name: 'venue_name')  String venueName,  String slug,  String category,  String description,  VenueLocation location, @JsonKey(name: 'min_capacity')  int minCapacity, @JsonKey(name: 'max_capacity')  int maxCapacity,  List<VenueAmenity> amenities, @JsonKey(name: 'cover_image_url')  String coverImageUrl, @JsonKey(name: 'gallery_images')  List<VenueGalleryImage> galleryImages, @JsonKey(name: 'virtual_tour_url')  String? virtualTourUrl,  List<VenueSlot> slots,  List<VenueService> services, @JsonKey(name: 'instant_booking')  bool instantBooking,  String status, @JsonKey(name: 'average_rating')  double averageRating, @JsonKey(name: 'total_reviews')  int totalReviews, @JsonKey(name: 'view_count')  int viewCount, @JsonKey(name: 'booking_count')  int bookingCount, @JsonKey(name: 'is_featured')  bool isFeatured, @JsonKey(name: 'verification_status')  String verificationStatus, @JsonKey(name: 'approved_by')  String? approvedBy, @JsonKey(name: 'approved_at')  DateTime? approvedAt, @JsonKey(name: 'rejection_reason')  String? rejectionReason, @JsonKey(name: 'published_at')  DateTime? publishedAt, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _VenueResponseModel() when $default != null:
return $default(_that.id,_that.ownerId,_that.venueName,_that.slug,_that.category,_that.description,_that.location,_that.minCapacity,_that.maxCapacity,_that.amenities,_that.coverImageUrl,_that.galleryImages,_that.virtualTourUrl,_that.slots,_that.services,_that.instantBooking,_that.status,_that.averageRating,_that.totalReviews,_that.viewCount,_that.bookingCount,_that.isFeatured,_that.verificationStatus,_that.approvedBy,_that.approvedAt,_that.rejectionReason,_that.publishedAt,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'owner_id')  String ownerId, @JsonKey(name: 'venue_name')  String venueName,  String slug,  String category,  String description,  VenueLocation location, @JsonKey(name: 'min_capacity')  int minCapacity, @JsonKey(name: 'max_capacity')  int maxCapacity,  List<VenueAmenity> amenities, @JsonKey(name: 'cover_image_url')  String coverImageUrl, @JsonKey(name: 'gallery_images')  List<VenueGalleryImage> galleryImages, @JsonKey(name: 'virtual_tour_url')  String? virtualTourUrl,  List<VenueSlot> slots,  List<VenueService> services, @JsonKey(name: 'instant_booking')  bool instantBooking,  String status, @JsonKey(name: 'average_rating')  double averageRating, @JsonKey(name: 'total_reviews')  int totalReviews, @JsonKey(name: 'view_count')  int viewCount, @JsonKey(name: 'booking_count')  int bookingCount, @JsonKey(name: 'is_featured')  bool isFeatured, @JsonKey(name: 'verification_status')  String verificationStatus, @JsonKey(name: 'approved_by')  String? approvedBy, @JsonKey(name: 'approved_at')  DateTime? approvedAt, @JsonKey(name: 'rejection_reason')  String? rejectionReason, @JsonKey(name: 'published_at')  DateTime? publishedAt, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _VenueResponseModel():
return $default(_that.id,_that.ownerId,_that.venueName,_that.slug,_that.category,_that.description,_that.location,_that.minCapacity,_that.maxCapacity,_that.amenities,_that.coverImageUrl,_that.galleryImages,_that.virtualTourUrl,_that.slots,_that.services,_that.instantBooking,_that.status,_that.averageRating,_that.totalReviews,_that.viewCount,_that.bookingCount,_that.isFeatured,_that.verificationStatus,_that.approvedBy,_that.approvedAt,_that.rejectionReason,_that.publishedAt,_that.createdAt,_that.updatedAt);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'owner_id')  String ownerId, @JsonKey(name: 'venue_name')  String venueName,  String slug,  String category,  String description,  VenueLocation location, @JsonKey(name: 'min_capacity')  int minCapacity, @JsonKey(name: 'max_capacity')  int maxCapacity,  List<VenueAmenity> amenities, @JsonKey(name: 'cover_image_url')  String coverImageUrl, @JsonKey(name: 'gallery_images')  List<VenueGalleryImage> galleryImages, @JsonKey(name: 'virtual_tour_url')  String? virtualTourUrl,  List<VenueSlot> slots,  List<VenueService> services, @JsonKey(name: 'instant_booking')  bool instantBooking,  String status, @JsonKey(name: 'average_rating')  double averageRating, @JsonKey(name: 'total_reviews')  int totalReviews, @JsonKey(name: 'view_count')  int viewCount, @JsonKey(name: 'booking_count')  int bookingCount, @JsonKey(name: 'is_featured')  bool isFeatured, @JsonKey(name: 'verification_status')  String verificationStatus, @JsonKey(name: 'approved_by')  String? approvedBy, @JsonKey(name: 'approved_at')  DateTime? approvedAt, @JsonKey(name: 'rejection_reason')  String? rejectionReason, @JsonKey(name: 'published_at')  DateTime? publishedAt, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _VenueResponseModel() when $default != null:
return $default(_that.id,_that.ownerId,_that.venueName,_that.slug,_that.category,_that.description,_that.location,_that.minCapacity,_that.maxCapacity,_that.amenities,_that.coverImageUrl,_that.galleryImages,_that.virtualTourUrl,_that.slots,_that.services,_that.instantBooking,_that.status,_that.averageRating,_that.totalReviews,_that.viewCount,_that.bookingCount,_that.isFeatured,_that.verificationStatus,_that.approvedBy,_that.approvedAt,_that.rejectionReason,_that.publishedAt,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _VenueResponseModel implements VenueResponseModel {
  const _VenueResponseModel({required this.id, @JsonKey(name: 'owner_id') required this.ownerId, @JsonKey(name: 'venue_name') required this.venueName, required this.slug, required this.category, required this.description, required this.location, @JsonKey(name: 'min_capacity') required this.minCapacity, @JsonKey(name: 'max_capacity') required this.maxCapacity, required final  List<VenueAmenity> amenities, @JsonKey(name: 'cover_image_url') required this.coverImageUrl, @JsonKey(name: 'gallery_images') required final  List<VenueGalleryImage> galleryImages, @JsonKey(name: 'virtual_tour_url') this.virtualTourUrl, required final  List<VenueSlot> slots, required final  List<VenueService> services, @JsonKey(name: 'instant_booking') required this.instantBooking, required this.status, @JsonKey(name: 'average_rating') required this.averageRating, @JsonKey(name: 'total_reviews') required this.totalReviews, @JsonKey(name: 'view_count') required this.viewCount, @JsonKey(name: 'booking_count') required this.bookingCount, @JsonKey(name: 'is_featured') required this.isFeatured, @JsonKey(name: 'verification_status') required this.verificationStatus, @JsonKey(name: 'approved_by') this.approvedBy, @JsonKey(name: 'approved_at') this.approvedAt, @JsonKey(name: 'rejection_reason') this.rejectionReason, @JsonKey(name: 'published_at') this.publishedAt, @JsonKey(name: 'created_at') required this.createdAt, @JsonKey(name: 'updated_at') required this.updatedAt}): _amenities = amenities,_galleryImages = galleryImages,_slots = slots,_services = services;
  factory _VenueResponseModel.fromJson(Map<String, dynamic> json) => _$VenueResponseModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'owner_id') final  String ownerId;
@override@JsonKey(name: 'venue_name') final  String venueName;
@override final  String slug;
@override final  String category;
@override final  String description;
@override final  VenueLocation location;
@override@JsonKey(name: 'min_capacity') final  int minCapacity;
@override@JsonKey(name: 'max_capacity') final  int maxCapacity;
 final  List<VenueAmenity> _amenities;
@override List<VenueAmenity> get amenities {
  if (_amenities is EqualUnmodifiableListView) return _amenities;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_amenities);
}

@override@JsonKey(name: 'cover_image_url') final  String coverImageUrl;
 final  List<VenueGalleryImage> _galleryImages;
@override@JsonKey(name: 'gallery_images') List<VenueGalleryImage> get galleryImages {
  if (_galleryImages is EqualUnmodifiableListView) return _galleryImages;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_galleryImages);
}

@override@JsonKey(name: 'virtual_tour_url') final  String? virtualTourUrl;
 final  List<VenueSlot> _slots;
@override List<VenueSlot> get slots {
  if (_slots is EqualUnmodifiableListView) return _slots;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_slots);
}

 final  List<VenueService> _services;
@override List<VenueService> get services {
  if (_services is EqualUnmodifiableListView) return _services;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_services);
}

@override@JsonKey(name: 'instant_booking') final  bool instantBooking;
@override final  String status;
@override@JsonKey(name: 'average_rating') final  double averageRating;
@override@JsonKey(name: 'total_reviews') final  int totalReviews;
@override@JsonKey(name: 'view_count') final  int viewCount;
@override@JsonKey(name: 'booking_count') final  int bookingCount;
@override@JsonKey(name: 'is_featured') final  bool isFeatured;
@override@JsonKey(name: 'verification_status') final  String verificationStatus;
@override@JsonKey(name: 'approved_by') final  String? approvedBy;
@override@JsonKey(name: 'approved_at') final  DateTime? approvedAt;
@override@JsonKey(name: 'rejection_reason') final  String? rejectionReason;
@override@JsonKey(name: 'published_at') final  DateTime? publishedAt;
@override@JsonKey(name: 'created_at') final  DateTime createdAt;
@override@JsonKey(name: 'updated_at') final  DateTime updatedAt;

/// Create a copy of VenueResponseModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VenueResponseModelCopyWith<_VenueResponseModel> get copyWith => __$VenueResponseModelCopyWithImpl<_VenueResponseModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$VenueResponseModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VenueResponseModel&&(identical(other.id, id) || other.id == id)&&(identical(other.ownerId, ownerId) || other.ownerId == ownerId)&&(identical(other.venueName, venueName) || other.venueName == venueName)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.category, category) || other.category == category)&&(identical(other.description, description) || other.description == description)&&(identical(other.location, location) || other.location == location)&&(identical(other.minCapacity, minCapacity) || other.minCapacity == minCapacity)&&(identical(other.maxCapacity, maxCapacity) || other.maxCapacity == maxCapacity)&&const DeepCollectionEquality().equals(other._amenities, _amenities)&&(identical(other.coverImageUrl, coverImageUrl) || other.coverImageUrl == coverImageUrl)&&const DeepCollectionEquality().equals(other._galleryImages, _galleryImages)&&(identical(other.virtualTourUrl, virtualTourUrl) || other.virtualTourUrl == virtualTourUrl)&&const DeepCollectionEquality().equals(other._slots, _slots)&&const DeepCollectionEquality().equals(other._services, _services)&&(identical(other.instantBooking, instantBooking) || other.instantBooking == instantBooking)&&(identical(other.status, status) || other.status == status)&&(identical(other.averageRating, averageRating) || other.averageRating == averageRating)&&(identical(other.totalReviews, totalReviews) || other.totalReviews == totalReviews)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.bookingCount, bookingCount) || other.bookingCount == bookingCount)&&(identical(other.isFeatured, isFeatured) || other.isFeatured == isFeatured)&&(identical(other.verificationStatus, verificationStatus) || other.verificationStatus == verificationStatus)&&(identical(other.approvedBy, approvedBy) || other.approvedBy == approvedBy)&&(identical(other.approvedAt, approvedAt) || other.approvedAt == approvedAt)&&(identical(other.rejectionReason, rejectionReason) || other.rejectionReason == rejectionReason)&&(identical(other.publishedAt, publishedAt) || other.publishedAt == publishedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,ownerId,venueName,slug,category,description,location,minCapacity,maxCapacity,const DeepCollectionEquality().hash(_amenities),coverImageUrl,const DeepCollectionEquality().hash(_galleryImages),virtualTourUrl,const DeepCollectionEquality().hash(_slots),const DeepCollectionEquality().hash(_services),instantBooking,status,averageRating,totalReviews,viewCount,bookingCount,isFeatured,verificationStatus,approvedBy,approvedAt,rejectionReason,publishedAt,createdAt,updatedAt]);

@override
String toString() {
  return 'VenueResponseModel(id: $id, ownerId: $ownerId, venueName: $venueName, slug: $slug, category: $category, description: $description, location: $location, minCapacity: $minCapacity, maxCapacity: $maxCapacity, amenities: $amenities, coverImageUrl: $coverImageUrl, galleryImages: $galleryImages, virtualTourUrl: $virtualTourUrl, slots: $slots, services: $services, instantBooking: $instantBooking, status: $status, averageRating: $averageRating, totalReviews: $totalReviews, viewCount: $viewCount, bookingCount: $bookingCount, isFeatured: $isFeatured, verificationStatus: $verificationStatus, approvedBy: $approvedBy, approvedAt: $approvedAt, rejectionReason: $rejectionReason, publishedAt: $publishedAt, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$VenueResponseModelCopyWith<$Res> implements $VenueResponseModelCopyWith<$Res> {
  factory _$VenueResponseModelCopyWith(_VenueResponseModel value, $Res Function(_VenueResponseModel) _then) = __$VenueResponseModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'owner_id') String ownerId,@JsonKey(name: 'venue_name') String venueName, String slug, String category, String description, VenueLocation location,@JsonKey(name: 'min_capacity') int minCapacity,@JsonKey(name: 'max_capacity') int maxCapacity, List<VenueAmenity> amenities,@JsonKey(name: 'cover_image_url') String coverImageUrl,@JsonKey(name: 'gallery_images') List<VenueGalleryImage> galleryImages,@JsonKey(name: 'virtual_tour_url') String? virtualTourUrl, List<VenueSlot> slots, List<VenueService> services,@JsonKey(name: 'instant_booking') bool instantBooking, String status,@JsonKey(name: 'average_rating') double averageRating,@JsonKey(name: 'total_reviews') int totalReviews,@JsonKey(name: 'view_count') int viewCount,@JsonKey(name: 'booking_count') int bookingCount,@JsonKey(name: 'is_featured') bool isFeatured,@JsonKey(name: 'verification_status') String verificationStatus,@JsonKey(name: 'approved_by') String? approvedBy,@JsonKey(name: 'approved_at') DateTime? approvedAt,@JsonKey(name: 'rejection_reason') String? rejectionReason,@JsonKey(name: 'published_at') DateTime? publishedAt,@JsonKey(name: 'created_at') DateTime createdAt,@JsonKey(name: 'updated_at') DateTime updatedAt
});


@override $VenueLocationCopyWith<$Res> get location;

}
/// @nodoc
class __$VenueResponseModelCopyWithImpl<$Res>
    implements _$VenueResponseModelCopyWith<$Res> {
  __$VenueResponseModelCopyWithImpl(this._self, this._then);

  final _VenueResponseModel _self;
  final $Res Function(_VenueResponseModel) _then;

/// Create a copy of VenueResponseModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? ownerId = null,Object? venueName = null,Object? slug = null,Object? category = null,Object? description = null,Object? location = null,Object? minCapacity = null,Object? maxCapacity = null,Object? amenities = null,Object? coverImageUrl = null,Object? galleryImages = null,Object? virtualTourUrl = freezed,Object? slots = null,Object? services = null,Object? instantBooking = null,Object? status = null,Object? averageRating = null,Object? totalReviews = null,Object? viewCount = null,Object? bookingCount = null,Object? isFeatured = null,Object? verificationStatus = null,Object? approvedBy = freezed,Object? approvedAt = freezed,Object? rejectionReason = freezed,Object? publishedAt = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_VenueResponseModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,ownerId: null == ownerId ? _self.ownerId : ownerId // ignore: cast_nullable_to_non_nullable
as String,venueName: null == venueName ? _self.venueName : venueName // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,category: null == category ? _self.category : category // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,location: null == location ? _self.location : location // ignore: cast_nullable_to_non_nullable
as VenueLocation,minCapacity: null == minCapacity ? _self.minCapacity : minCapacity // ignore: cast_nullable_to_non_nullable
as int,maxCapacity: null == maxCapacity ? _self.maxCapacity : maxCapacity // ignore: cast_nullable_to_non_nullable
as int,amenities: null == amenities ? _self._amenities : amenities // ignore: cast_nullable_to_non_nullable
as List<VenueAmenity>,coverImageUrl: null == coverImageUrl ? _self.coverImageUrl : coverImageUrl // ignore: cast_nullable_to_non_nullable
as String,galleryImages: null == galleryImages ? _self._galleryImages : galleryImages // ignore: cast_nullable_to_non_nullable
as List<VenueGalleryImage>,virtualTourUrl: freezed == virtualTourUrl ? _self.virtualTourUrl : virtualTourUrl // ignore: cast_nullable_to_non_nullable
as String?,slots: null == slots ? _self._slots : slots // ignore: cast_nullable_to_non_nullable
as List<VenueSlot>,services: null == services ? _self._services : services // ignore: cast_nullable_to_non_nullable
as List<VenueService>,instantBooking: null == instantBooking ? _self.instantBooking : instantBooking // ignore: cast_nullable_to_non_nullable
as bool,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,averageRating: null == averageRating ? _self.averageRating : averageRating // ignore: cast_nullable_to_non_nullable
as double,totalReviews: null == totalReviews ? _self.totalReviews : totalReviews // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,bookingCount: null == bookingCount ? _self.bookingCount : bookingCount // ignore: cast_nullable_to_non_nullable
as int,isFeatured: null == isFeatured ? _self.isFeatured : isFeatured // ignore: cast_nullable_to_non_nullable
as bool,verificationStatus: null == verificationStatus ? _self.verificationStatus : verificationStatus // ignore: cast_nullable_to_non_nullable
as String,approvedBy: freezed == approvedBy ? _self.approvedBy : approvedBy // ignore: cast_nullable_to_non_nullable
as String?,approvedAt: freezed == approvedAt ? _self.approvedAt : approvedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,rejectionReason: freezed == rejectionReason ? _self.rejectionReason : rejectionReason // ignore: cast_nullable_to_non_nullable
as String?,publishedAt: freezed == publishedAt ? _self.publishedAt : publishedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

/// Create a copy of VenueResponseModel
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$VenueLocationCopyWith<$Res> get location {
  
  return $VenueLocationCopyWith<$Res>(_self.location, (value) {
    return _then(_self.copyWith(location: value));
  });
}
}


/// @nodoc
mixin _$VenueLocation {

 String get address; String get city; String get state; String get country; String get pincode; double get latitude; double get longitude;
/// Create a copy of VenueLocation
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$VenueLocationCopyWith<VenueLocation> get copyWith => _$VenueLocationCopyWithImpl<VenueLocation>(this as VenueLocation, _$identity);

  /// Serializes this VenueLocation to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VenueLocation&&(identical(other.address, address) || other.address == address)&&(identical(other.city, city) || other.city == city)&&(identical(other.state, state) || other.state == state)&&(identical(other.country, country) || other.country == country)&&(identical(other.pincode, pincode) || other.pincode == pincode)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,address,city,state,country,pincode,latitude,longitude);

@override
String toString() {
  return 'VenueLocation(address: $address, city: $city, state: $state, country: $country, pincode: $pincode, latitude: $latitude, longitude: $longitude)';
}


}

/// @nodoc
abstract mixin class $VenueLocationCopyWith<$Res>  {
  factory $VenueLocationCopyWith(VenueLocation value, $Res Function(VenueLocation) _then) = _$VenueLocationCopyWithImpl;
@useResult
$Res call({
 String address, String city, String state, String country, String pincode, double latitude, double longitude
});




}
/// @nodoc
class _$VenueLocationCopyWithImpl<$Res>
    implements $VenueLocationCopyWith<$Res> {
  _$VenueLocationCopyWithImpl(this._self, this._then);

  final VenueLocation _self;
  final $Res Function(VenueLocation) _then;

/// Create a copy of VenueLocation
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


/// Adds pattern-matching-related methods to [VenueLocation].
extension VenueLocationPatterns on VenueLocation {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _VenueLocation value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _VenueLocation() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _VenueLocation value)  $default,){
final _that = this;
switch (_that) {
case _VenueLocation():
return $default(_that);}
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _VenueLocation value)?  $default,){
final _that = this;
switch (_that) {
case _VenueLocation() when $default != null:
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
case _VenueLocation() when $default != null:
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
case _VenueLocation():
return $default(_that.address,_that.city,_that.state,_that.country,_that.pincode,_that.latitude,_that.longitude);}
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
case _VenueLocation() when $default != null:
return $default(_that.address,_that.city,_that.state,_that.country,_that.pincode,_that.latitude,_that.longitude);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _VenueLocation implements VenueLocation {
  const _VenueLocation({required this.address, required this.city, required this.state, required this.country, required this.pincode, required this.latitude, required this.longitude});
  factory _VenueLocation.fromJson(Map<String, dynamic> json) => _$VenueLocationFromJson(json);

@override final  String address;
@override final  String city;
@override final  String state;
@override final  String country;
@override final  String pincode;
@override final  double latitude;
@override final  double longitude;

/// Create a copy of VenueLocation
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VenueLocationCopyWith<_VenueLocation> get copyWith => __$VenueLocationCopyWithImpl<_VenueLocation>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$VenueLocationToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VenueLocation&&(identical(other.address, address) || other.address == address)&&(identical(other.city, city) || other.city == city)&&(identical(other.state, state) || other.state == state)&&(identical(other.country, country) || other.country == country)&&(identical(other.pincode, pincode) || other.pincode == pincode)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,address,city,state,country,pincode,latitude,longitude);

@override
String toString() {
  return 'VenueLocation(address: $address, city: $city, state: $state, country: $country, pincode: $pincode, latitude: $latitude, longitude: $longitude)';
}


}

/// @nodoc
abstract mixin class _$VenueLocationCopyWith<$Res> implements $VenueLocationCopyWith<$Res> {
  factory _$VenueLocationCopyWith(_VenueLocation value, $Res Function(_VenueLocation) _then) = __$VenueLocationCopyWithImpl;
@override @useResult
$Res call({
 String address, String city, String state, String country, String pincode, double latitude, double longitude
});




}
/// @nodoc
class __$VenueLocationCopyWithImpl<$Res>
    implements _$VenueLocationCopyWith<$Res> {
  __$VenueLocationCopyWithImpl(this._self, this._then);

  final _VenueLocation _self;
  final $Res Function(_VenueLocation) _then;

/// Create a copy of VenueLocation
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? address = null,Object? city = null,Object? state = null,Object? country = null,Object? pincode = null,Object? latitude = null,Object? longitude = null,}) {
  return _then(_VenueLocation(
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
mixin _$VenueAmenity {

 String get id; String get name;
/// Create a copy of VenueAmenity
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$VenueAmenityCopyWith<VenueAmenity> get copyWith => _$VenueAmenityCopyWithImpl<VenueAmenity>(this as VenueAmenity, _$identity);

  /// Serializes this VenueAmenity to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VenueAmenity&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name);

@override
String toString() {
  return 'VenueAmenity(id: $id, name: $name)';
}


}

/// @nodoc
abstract mixin class $VenueAmenityCopyWith<$Res>  {
  factory $VenueAmenityCopyWith(VenueAmenity value, $Res Function(VenueAmenity) _then) = _$VenueAmenityCopyWithImpl;
@useResult
$Res call({
 String id, String name
});




}
/// @nodoc
class _$VenueAmenityCopyWithImpl<$Res>
    implements $VenueAmenityCopyWith<$Res> {
  _$VenueAmenityCopyWithImpl(this._self, this._then);

  final VenueAmenity _self;
  final $Res Function(VenueAmenity) _then;

/// Create a copy of VenueAmenity
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [VenueAmenity].
extension VenueAmenityPatterns on VenueAmenity {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _VenueAmenity value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _VenueAmenity() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _VenueAmenity value)  $default,){
final _that = this;
switch (_that) {
case _VenueAmenity():
return $default(_that);}
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _VenueAmenity value)?  $default,){
final _that = this;
switch (_that) {
case _VenueAmenity() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _VenueAmenity() when $default != null:
return $default(_that.id,_that.name);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name)  $default,) {final _that = this;
switch (_that) {
case _VenueAmenity():
return $default(_that.id,_that.name);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name)?  $default,) {final _that = this;
switch (_that) {
case _VenueAmenity() when $default != null:
return $default(_that.id,_that.name);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _VenueAmenity implements VenueAmenity {
  const _VenueAmenity({required this.id, required this.name});
  factory _VenueAmenity.fromJson(Map<String, dynamic> json) => _$VenueAmenityFromJson(json);

@override final  String id;
@override final  String name;

/// Create a copy of VenueAmenity
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VenueAmenityCopyWith<_VenueAmenity> get copyWith => __$VenueAmenityCopyWithImpl<_VenueAmenity>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$VenueAmenityToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VenueAmenity&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name);

@override
String toString() {
  return 'VenueAmenity(id: $id, name: $name)';
}


}

/// @nodoc
abstract mixin class _$VenueAmenityCopyWith<$Res> implements $VenueAmenityCopyWith<$Res> {
  factory _$VenueAmenityCopyWith(_VenueAmenity value, $Res Function(_VenueAmenity) _then) = __$VenueAmenityCopyWithImpl;
@override @useResult
$Res call({
 String id, String name
});




}
/// @nodoc
class __$VenueAmenityCopyWithImpl<$Res>
    implements _$VenueAmenityCopyWith<$Res> {
  __$VenueAmenityCopyWithImpl(this._self, this._then);

  final _VenueAmenity _self;
  final $Res Function(_VenueAmenity) _then;

/// Create a copy of VenueAmenity
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,}) {
  return _then(_VenueAmenity(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$VenueGalleryImage {

 String get id;@JsonKey(name: 'image_url') String get imageUrl;@JsonKey(name: 'sort_order') int get sortOrder;@JsonKey(name: 'created_at') DateTime get createdAt;
/// Create a copy of VenueGalleryImage
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$VenueGalleryImageCopyWith<VenueGalleryImage> get copyWith => _$VenueGalleryImageCopyWithImpl<VenueGalleryImage>(this as VenueGalleryImage, _$identity);

  /// Serializes this VenueGalleryImage to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VenueGalleryImage&&(identical(other.id, id) || other.id == id)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,imageUrl,sortOrder,createdAt);

@override
String toString() {
  return 'VenueGalleryImage(id: $id, imageUrl: $imageUrl, sortOrder: $sortOrder, createdAt: $createdAt)';
}


}

/// @nodoc
abstract mixin class $VenueGalleryImageCopyWith<$Res>  {
  factory $VenueGalleryImageCopyWith(VenueGalleryImage value, $Res Function(VenueGalleryImage) _then) = _$VenueGalleryImageCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'image_url') String imageUrl,@JsonKey(name: 'sort_order') int sortOrder,@JsonKey(name: 'created_at') DateTime createdAt
});




}
/// @nodoc
class _$VenueGalleryImageCopyWithImpl<$Res>
    implements $VenueGalleryImageCopyWith<$Res> {
  _$VenueGalleryImageCopyWithImpl(this._self, this._then);

  final VenueGalleryImage _self;
  final $Res Function(VenueGalleryImage) _then;

/// Create a copy of VenueGalleryImage
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? imageUrl = null,Object? sortOrder = null,Object? createdAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,imageUrl: null == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [VenueGalleryImage].
extension VenueGalleryImagePatterns on VenueGalleryImage {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _VenueGalleryImage value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _VenueGalleryImage() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _VenueGalleryImage value)  $default,){
final _that = this;
switch (_that) {
case _VenueGalleryImage():
return $default(_that);}
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _VenueGalleryImage value)?  $default,){
final _that = this;
switch (_that) {
case _VenueGalleryImage() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'image_url')  String imageUrl, @JsonKey(name: 'sort_order')  int sortOrder, @JsonKey(name: 'created_at')  DateTime createdAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _VenueGalleryImage() when $default != null:
return $default(_that.id,_that.imageUrl,_that.sortOrder,_that.createdAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'image_url')  String imageUrl, @JsonKey(name: 'sort_order')  int sortOrder, @JsonKey(name: 'created_at')  DateTime createdAt)  $default,) {final _that = this;
switch (_that) {
case _VenueGalleryImage():
return $default(_that.id,_that.imageUrl,_that.sortOrder,_that.createdAt);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'image_url')  String imageUrl, @JsonKey(name: 'sort_order')  int sortOrder, @JsonKey(name: 'created_at')  DateTime createdAt)?  $default,) {final _that = this;
switch (_that) {
case _VenueGalleryImage() when $default != null:
return $default(_that.id,_that.imageUrl,_that.sortOrder,_that.createdAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _VenueGalleryImage implements VenueGalleryImage {
  const _VenueGalleryImage({required this.id, @JsonKey(name: 'image_url') required this.imageUrl, @JsonKey(name: 'sort_order') required this.sortOrder, @JsonKey(name: 'created_at') required this.createdAt});
  factory _VenueGalleryImage.fromJson(Map<String, dynamic> json) => _$VenueGalleryImageFromJson(json);

@override final  String id;
@override@JsonKey(name: 'image_url') final  String imageUrl;
@override@JsonKey(name: 'sort_order') final  int sortOrder;
@override@JsonKey(name: 'created_at') final  DateTime createdAt;

/// Create a copy of VenueGalleryImage
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VenueGalleryImageCopyWith<_VenueGalleryImage> get copyWith => __$VenueGalleryImageCopyWithImpl<_VenueGalleryImage>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$VenueGalleryImageToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VenueGalleryImage&&(identical(other.id, id) || other.id == id)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,imageUrl,sortOrder,createdAt);

@override
String toString() {
  return 'VenueGalleryImage(id: $id, imageUrl: $imageUrl, sortOrder: $sortOrder, createdAt: $createdAt)';
}


}

/// @nodoc
abstract mixin class _$VenueGalleryImageCopyWith<$Res> implements $VenueGalleryImageCopyWith<$Res> {
  factory _$VenueGalleryImageCopyWith(_VenueGalleryImage value, $Res Function(_VenueGalleryImage) _then) = __$VenueGalleryImageCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'image_url') String imageUrl,@JsonKey(name: 'sort_order') int sortOrder,@JsonKey(name: 'created_at') DateTime createdAt
});




}
/// @nodoc
class __$VenueGalleryImageCopyWithImpl<$Res>
    implements _$VenueGalleryImageCopyWith<$Res> {
  __$VenueGalleryImageCopyWithImpl(this._self, this._then);

  final _VenueGalleryImage _self;
  final $Res Function(_VenueGalleryImage) _then;

/// Create a copy of VenueGalleryImage
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? imageUrl = null,Object? sortOrder = null,Object? createdAt = null,}) {
  return _then(_VenueGalleryImage(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,imageUrl: null == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}


/// @nodoc
mixin _$VenueSlot {

 String get id;@JsonKey(name: 'slot_name') String get slotName;@JsonKey(name: 'start_time') String get startTime;@JsonKey(name: 'end_time') String get endTime; int get capacity; double get price;
/// Create a copy of VenueSlot
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$VenueSlotCopyWith<VenueSlot> get copyWith => _$VenueSlotCopyWithImpl<VenueSlot>(this as VenueSlot, _$identity);

  /// Serializes this VenueSlot to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VenueSlot&&(identical(other.id, id) || other.id == id)&&(identical(other.slotName, slotName) || other.slotName == slotName)&&(identical(other.startTime, startTime) || other.startTime == startTime)&&(identical(other.endTime, endTime) || other.endTime == endTime)&&(identical(other.capacity, capacity) || other.capacity == capacity)&&(identical(other.price, price) || other.price == price));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,slotName,startTime,endTime,capacity,price);

@override
String toString() {
  return 'VenueSlot(id: $id, slotName: $slotName, startTime: $startTime, endTime: $endTime, capacity: $capacity, price: $price)';
}


}

/// @nodoc
abstract mixin class $VenueSlotCopyWith<$Res>  {
  factory $VenueSlotCopyWith(VenueSlot value, $Res Function(VenueSlot) _then) = _$VenueSlotCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'slot_name') String slotName,@JsonKey(name: 'start_time') String startTime,@JsonKey(name: 'end_time') String endTime, int capacity, double price
});




}
/// @nodoc
class _$VenueSlotCopyWithImpl<$Res>
    implements $VenueSlotCopyWith<$Res> {
  _$VenueSlotCopyWithImpl(this._self, this._then);

  final VenueSlot _self;
  final $Res Function(VenueSlot) _then;

/// Create a copy of VenueSlot
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? slotName = null,Object? startTime = null,Object? endTime = null,Object? capacity = null,Object? price = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,slotName: null == slotName ? _self.slotName : slotName // ignore: cast_nullable_to_non_nullable
as String,startTime: null == startTime ? _self.startTime : startTime // ignore: cast_nullable_to_non_nullable
as String,endTime: null == endTime ? _self.endTime : endTime // ignore: cast_nullable_to_non_nullable
as String,capacity: null == capacity ? _self.capacity : capacity // ignore: cast_nullable_to_non_nullable
as int,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [VenueSlot].
extension VenueSlotPatterns on VenueSlot {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _VenueSlot value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _VenueSlot() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _VenueSlot value)  $default,){
final _that = this;
switch (_that) {
case _VenueSlot():
return $default(_that);}
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _VenueSlot value)?  $default,){
final _that = this;
switch (_that) {
case _VenueSlot() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'slot_name')  String slotName, @JsonKey(name: 'start_time')  String startTime, @JsonKey(name: 'end_time')  String endTime,  int capacity,  double price)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _VenueSlot() when $default != null:
return $default(_that.id,_that.slotName,_that.startTime,_that.endTime,_that.capacity,_that.price);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'slot_name')  String slotName, @JsonKey(name: 'start_time')  String startTime, @JsonKey(name: 'end_time')  String endTime,  int capacity,  double price)  $default,) {final _that = this;
switch (_that) {
case _VenueSlot():
return $default(_that.id,_that.slotName,_that.startTime,_that.endTime,_that.capacity,_that.price);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'slot_name')  String slotName, @JsonKey(name: 'start_time')  String startTime, @JsonKey(name: 'end_time')  String endTime,  int capacity,  double price)?  $default,) {final _that = this;
switch (_that) {
case _VenueSlot() when $default != null:
return $default(_that.id,_that.slotName,_that.startTime,_that.endTime,_that.capacity,_that.price);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _VenueSlot implements VenueSlot {
  const _VenueSlot({required this.id, @JsonKey(name: 'slot_name') required this.slotName, @JsonKey(name: 'start_time') required this.startTime, @JsonKey(name: 'end_time') required this.endTime, required this.capacity, required this.price});
  factory _VenueSlot.fromJson(Map<String, dynamic> json) => _$VenueSlotFromJson(json);

@override final  String id;
@override@JsonKey(name: 'slot_name') final  String slotName;
@override@JsonKey(name: 'start_time') final  String startTime;
@override@JsonKey(name: 'end_time') final  String endTime;
@override final  int capacity;
@override final  double price;

/// Create a copy of VenueSlot
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VenueSlotCopyWith<_VenueSlot> get copyWith => __$VenueSlotCopyWithImpl<_VenueSlot>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$VenueSlotToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VenueSlot&&(identical(other.id, id) || other.id == id)&&(identical(other.slotName, slotName) || other.slotName == slotName)&&(identical(other.startTime, startTime) || other.startTime == startTime)&&(identical(other.endTime, endTime) || other.endTime == endTime)&&(identical(other.capacity, capacity) || other.capacity == capacity)&&(identical(other.price, price) || other.price == price));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,slotName,startTime,endTime,capacity,price);

@override
String toString() {
  return 'VenueSlot(id: $id, slotName: $slotName, startTime: $startTime, endTime: $endTime, capacity: $capacity, price: $price)';
}


}

/// @nodoc
abstract mixin class _$VenueSlotCopyWith<$Res> implements $VenueSlotCopyWith<$Res> {
  factory _$VenueSlotCopyWith(_VenueSlot value, $Res Function(_VenueSlot) _then) = __$VenueSlotCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'slot_name') String slotName,@JsonKey(name: 'start_time') String startTime,@JsonKey(name: 'end_time') String endTime, int capacity, double price
});




}
/// @nodoc
class __$VenueSlotCopyWithImpl<$Res>
    implements _$VenueSlotCopyWith<$Res> {
  __$VenueSlotCopyWithImpl(this._self, this._then);

  final _VenueSlot _self;
  final $Res Function(_VenueSlot) _then;

/// Create a copy of VenueSlot
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? slotName = null,Object? startTime = null,Object? endTime = null,Object? capacity = null,Object? price = null,}) {
  return _then(_VenueSlot(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,slotName: null == slotName ? _self.slotName : slotName // ignore: cast_nullable_to_non_nullable
as String,startTime: null == startTime ? _self.startTime : startTime // ignore: cast_nullable_to_non_nullable
as String,endTime: null == endTime ? _self.endTime : endTime // ignore: cast_nullable_to_non_nullable
as String,capacity: null == capacity ? _self.capacity : capacity // ignore: cast_nullable_to_non_nullable
as int,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}


/// @nodoc
mixin _$VenueService {

 String get id;@JsonKey(name: 'service_name') String get serviceName; double get price;
/// Create a copy of VenueService
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$VenueServiceCopyWith<VenueService> get copyWith => _$VenueServiceCopyWithImpl<VenueService>(this as VenueService, _$identity);

  /// Serializes this VenueService to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VenueService&&(identical(other.id, id) || other.id == id)&&(identical(other.serviceName, serviceName) || other.serviceName == serviceName)&&(identical(other.price, price) || other.price == price));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,serviceName,price);

@override
String toString() {
  return 'VenueService(id: $id, serviceName: $serviceName, price: $price)';
}


}

/// @nodoc
abstract mixin class $VenueServiceCopyWith<$Res>  {
  factory $VenueServiceCopyWith(VenueService value, $Res Function(VenueService) _then) = _$VenueServiceCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'service_name') String serviceName, double price
});




}
/// @nodoc
class _$VenueServiceCopyWithImpl<$Res>
    implements $VenueServiceCopyWith<$Res> {
  _$VenueServiceCopyWithImpl(this._self, this._then);

  final VenueService _self;
  final $Res Function(VenueService) _then;

/// Create a copy of VenueService
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? serviceName = null,Object? price = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,serviceName: null == serviceName ? _self.serviceName : serviceName // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [VenueService].
extension VenueServicePatterns on VenueService {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _VenueService value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _VenueService() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _VenueService value)  $default,){
final _that = this;
switch (_that) {
case _VenueService():
return $default(_that);}
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _VenueService value)?  $default,){
final _that = this;
switch (_that) {
case _VenueService() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'service_name')  String serviceName,  double price)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _VenueService() when $default != null:
return $default(_that.id,_that.serviceName,_that.price);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'service_name')  String serviceName,  double price)  $default,) {final _that = this;
switch (_that) {
case _VenueService():
return $default(_that.id,_that.serviceName,_that.price);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'service_name')  String serviceName,  double price)?  $default,) {final _that = this;
switch (_that) {
case _VenueService() when $default != null:
return $default(_that.id,_that.serviceName,_that.price);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _VenueService implements VenueService {
  const _VenueService({required this.id, @JsonKey(name: 'service_name') required this.serviceName, required this.price});
  factory _VenueService.fromJson(Map<String, dynamic> json) => _$VenueServiceFromJson(json);

@override final  String id;
@override@JsonKey(name: 'service_name') final  String serviceName;
@override final  double price;

/// Create a copy of VenueService
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VenueServiceCopyWith<_VenueService> get copyWith => __$VenueServiceCopyWithImpl<_VenueService>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$VenueServiceToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VenueService&&(identical(other.id, id) || other.id == id)&&(identical(other.serviceName, serviceName) || other.serviceName == serviceName)&&(identical(other.price, price) || other.price == price));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,serviceName,price);

@override
String toString() {
  return 'VenueService(id: $id, serviceName: $serviceName, price: $price)';
}


}

/// @nodoc
abstract mixin class _$VenueServiceCopyWith<$Res> implements $VenueServiceCopyWith<$Res> {
  factory _$VenueServiceCopyWith(_VenueService value, $Res Function(_VenueService) _then) = __$VenueServiceCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'service_name') String serviceName, double price
});




}
/// @nodoc
class __$VenueServiceCopyWithImpl<$Res>
    implements _$VenueServiceCopyWith<$Res> {
  __$VenueServiceCopyWithImpl(this._self, this._then);

  final _VenueService _self;
  final $Res Function(_VenueService) _then;

/// Create a copy of VenueService
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? serviceName = null,Object? price = null,}) {
  return _then(_VenueService(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,serviceName: null == serviceName ? _self.serviceName : serviceName // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}

// dart format on
