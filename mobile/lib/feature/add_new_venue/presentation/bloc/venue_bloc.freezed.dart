// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'venue_bloc.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$VenueEvent {





@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VenueEvent);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'VenueEvent()';
}


}

/// @nodoc
class $VenueEventCopyWith<$Res>  {
$VenueEventCopyWith(VenueEvent _, $Res Function(VenueEvent) __);
}


/// Adds pattern-matching-related methods to [VenueEvent].
extension VenueEventPatterns on VenueEvent {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>({TResult Function( _AddNewVenue value)?  addNewVenue,TResult Function( _GetAllVenues value)?  getAllVenues,TResult Function( _GetVenueById value)?  getVenueById,TResult Function( _GetAmenities value)?  getAmenities,required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AddNewVenue() when addNewVenue != null:
return addNewVenue(_that);case _GetAllVenues() when getAllVenues != null:
return getAllVenues(_that);case _GetVenueById() when getVenueById != null:
return getVenueById(_that);case _GetAmenities() when getAmenities != null:
return getAmenities(_that);case _:
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

@optionalTypeArgs TResult map<TResult extends Object?>({required TResult Function( _AddNewVenue value)  addNewVenue,required TResult Function( _GetAllVenues value)  getAllVenues,required TResult Function( _GetVenueById value)  getVenueById,required TResult Function( _GetAmenities value)  getAmenities,}){
final _that = this;
switch (_that) {
case _AddNewVenue():
return addNewVenue(_that);case _GetAllVenues():
return getAllVenues(_that);case _GetVenueById():
return getVenueById(_that);case _GetAmenities():
return getAmenities(_that);}
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>({TResult? Function( _AddNewVenue value)?  addNewVenue,TResult? Function( _GetAllVenues value)?  getAllVenues,TResult? Function( _GetVenueById value)?  getVenueById,TResult? Function( _GetAmenities value)?  getAmenities,}){
final _that = this;
switch (_that) {
case _AddNewVenue() when addNewVenue != null:
return addNewVenue(_that);case _GetAllVenues() when getAllVenues != null:
return getAllVenues(_that);case _GetVenueById() when getVenueById != null:
return getVenueById(_that);case _GetAmenities() when getAmenities != null:
return getAmenities(_that);case _:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>({TResult Function( AddNewVenueRequestParams params)?  addNewVenue,TResult Function( GetVenuesParams params)?  getAllVenues,TResult Function( String venueId)?  getVenueById,TResult Function()?  getAmenities,required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AddNewVenue() when addNewVenue != null:
return addNewVenue(_that.params);case _GetAllVenues() when getAllVenues != null:
return getAllVenues(_that.params);case _GetVenueById() when getVenueById != null:
return getVenueById(_that.venueId);case _GetAmenities() when getAmenities != null:
return getAmenities();case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>({required TResult Function( AddNewVenueRequestParams params)  addNewVenue,required TResult Function( GetVenuesParams params)  getAllVenues,required TResult Function( String venueId)  getVenueById,required TResult Function()  getAmenities,}) {final _that = this;
switch (_that) {
case _AddNewVenue():
return addNewVenue(_that.params);case _GetAllVenues():
return getAllVenues(_that.params);case _GetVenueById():
return getVenueById(_that.venueId);case _GetAmenities():
return getAmenities();}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>({TResult? Function( AddNewVenueRequestParams params)?  addNewVenue,TResult? Function( GetVenuesParams params)?  getAllVenues,TResult? Function( String venueId)?  getVenueById,TResult? Function()?  getAmenities,}) {final _that = this;
switch (_that) {
case _AddNewVenue() when addNewVenue != null:
return addNewVenue(_that.params);case _GetAllVenues() when getAllVenues != null:
return getAllVenues(_that.params);case _GetVenueById() when getVenueById != null:
return getVenueById(_that.venueId);case _GetAmenities() when getAmenities != null:
return getAmenities();case _:
  return null;

}
}

}

/// @nodoc


class _AddNewVenue implements VenueEvent {
  const _AddNewVenue({required this.params});
  

 final  AddNewVenueRequestParams params;

/// Create a copy of VenueEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AddNewVenueCopyWith<_AddNewVenue> get copyWith => __$AddNewVenueCopyWithImpl<_AddNewVenue>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _AddNewVenue&&(identical(other.params, params) || other.params == params));
}


@override
int get hashCode => Object.hash(runtimeType,params);

@override
String toString() {
  return 'VenueEvent.addNewVenue(params: $params)';
}


}

/// @nodoc
abstract mixin class _$AddNewVenueCopyWith<$Res> implements $VenueEventCopyWith<$Res> {
  factory _$AddNewVenueCopyWith(_AddNewVenue value, $Res Function(_AddNewVenue) _then) = __$AddNewVenueCopyWithImpl;
@useResult
$Res call({
 AddNewVenueRequestParams params
});




}
/// @nodoc
class __$AddNewVenueCopyWithImpl<$Res>
    implements _$AddNewVenueCopyWith<$Res> {
  __$AddNewVenueCopyWithImpl(this._self, this._then);

  final _AddNewVenue _self;
  final $Res Function(_AddNewVenue) _then;

/// Create a copy of VenueEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? params = null,}) {
  return _then(_AddNewVenue(
params: null == params ? _self.params : params // ignore: cast_nullable_to_non_nullable
as AddNewVenueRequestParams,
  ));
}


}

/// @nodoc


class _GetAllVenues implements VenueEvent {
  const _GetAllVenues({required this.params});
  

 final  GetVenuesParams params;

/// Create a copy of VenueEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$GetAllVenuesCopyWith<_GetAllVenues> get copyWith => __$GetAllVenuesCopyWithImpl<_GetAllVenues>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _GetAllVenues&&(identical(other.params, params) || other.params == params));
}


@override
int get hashCode => Object.hash(runtimeType,params);

@override
String toString() {
  return 'VenueEvent.getAllVenues(params: $params)';
}


}

/// @nodoc
abstract mixin class _$GetAllVenuesCopyWith<$Res> implements $VenueEventCopyWith<$Res> {
  factory _$GetAllVenuesCopyWith(_GetAllVenues value, $Res Function(_GetAllVenues) _then) = __$GetAllVenuesCopyWithImpl;
@useResult
$Res call({
 GetVenuesParams params
});




}
/// @nodoc
class __$GetAllVenuesCopyWithImpl<$Res>
    implements _$GetAllVenuesCopyWith<$Res> {
  __$GetAllVenuesCopyWithImpl(this._self, this._then);

  final _GetAllVenues _self;
  final $Res Function(_GetAllVenues) _then;

/// Create a copy of VenueEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? params = null,}) {
  return _then(_GetAllVenues(
params: null == params ? _self.params : params // ignore: cast_nullable_to_non_nullable
as GetVenuesParams,
  ));
}


}

/// @nodoc


class _GetVenueById implements VenueEvent {
  const _GetVenueById({required this.venueId});
  

 final  String venueId;

/// Create a copy of VenueEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$GetVenueByIdCopyWith<_GetVenueById> get copyWith => __$GetVenueByIdCopyWithImpl<_GetVenueById>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _GetVenueById&&(identical(other.venueId, venueId) || other.venueId == venueId));
}


@override
int get hashCode => Object.hash(runtimeType,venueId);

@override
String toString() {
  return 'VenueEvent.getVenueById(venueId: $venueId)';
}


}

/// @nodoc
abstract mixin class _$GetVenueByIdCopyWith<$Res> implements $VenueEventCopyWith<$Res> {
  factory _$GetVenueByIdCopyWith(_GetVenueById value, $Res Function(_GetVenueById) _then) = __$GetVenueByIdCopyWithImpl;
@useResult
$Res call({
 String venueId
});




}
/// @nodoc
class __$GetVenueByIdCopyWithImpl<$Res>
    implements _$GetVenueByIdCopyWith<$Res> {
  __$GetVenueByIdCopyWithImpl(this._self, this._then);

  final _GetVenueById _self;
  final $Res Function(_GetVenueById) _then;

/// Create a copy of VenueEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? venueId = null,}) {
  return _then(_GetVenueById(
venueId: null == venueId ? _self.venueId : venueId // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

/// @nodoc


class _GetAmenities implements VenueEvent {
  const _GetAmenities();
  






@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _GetAmenities);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'VenueEvent.getAmenities()';
}


}




/// @nodoc
mixin _$VenueState {

 VenueStatus get addVenueStatus; VenueStatus get getAllVenuesStatus; VenueStatus get getVenueStatus; VenueStatus get getAmenitiesStatus; AddNewVenueEntity? get addedVenue; List<VenueEntity> get venues; VenueEntity? get selectedVenue; List<VenueAmenityEntity> get amenities; String? get successMessage; String? get errorMessage;
/// Create a copy of VenueState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$VenueStateCopyWith<VenueState> get copyWith => _$VenueStateCopyWithImpl<VenueState>(this as VenueState, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VenueState&&(identical(other.addVenueStatus, addVenueStatus) || other.addVenueStatus == addVenueStatus)&&(identical(other.getAllVenuesStatus, getAllVenuesStatus) || other.getAllVenuesStatus == getAllVenuesStatus)&&(identical(other.getVenueStatus, getVenueStatus) || other.getVenueStatus == getVenueStatus)&&(identical(other.getAmenitiesStatus, getAmenitiesStatus) || other.getAmenitiesStatus == getAmenitiesStatus)&&(identical(other.addedVenue, addedVenue) || other.addedVenue == addedVenue)&&const DeepCollectionEquality().equals(other.venues, venues)&&(identical(other.selectedVenue, selectedVenue) || other.selectedVenue == selectedVenue)&&const DeepCollectionEquality().equals(other.amenities, amenities)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage));
}


@override
int get hashCode => Object.hash(runtimeType,addVenueStatus,getAllVenuesStatus,getVenueStatus,getAmenitiesStatus,addedVenue,const DeepCollectionEquality().hash(venues),selectedVenue,const DeepCollectionEquality().hash(amenities),successMessage,errorMessage);

@override
String toString() {
  return 'VenueState(addVenueStatus: $addVenueStatus, getAllVenuesStatus: $getAllVenuesStatus, getVenueStatus: $getVenueStatus, getAmenitiesStatus: $getAmenitiesStatus, addedVenue: $addedVenue, venues: $venues, selectedVenue: $selectedVenue, amenities: $amenities, successMessage: $successMessage, errorMessage: $errorMessage)';
}


}

/// @nodoc
abstract mixin class $VenueStateCopyWith<$Res>  {
  factory $VenueStateCopyWith(VenueState value, $Res Function(VenueState) _then) = _$VenueStateCopyWithImpl;
@useResult
$Res call({
 VenueStatus addVenueStatus, VenueStatus getAllVenuesStatus, VenueStatus getVenueStatus, VenueStatus getAmenitiesStatus, AddNewVenueEntity? addedVenue, List<VenueEntity> venues, VenueEntity? selectedVenue, List<VenueAmenityEntity> amenities, String? successMessage, String? errorMessage
});




}
/// @nodoc
class _$VenueStateCopyWithImpl<$Res>
    implements $VenueStateCopyWith<$Res> {
  _$VenueStateCopyWithImpl(this._self, this._then);

  final VenueState _self;
  final $Res Function(VenueState) _then;

/// Create a copy of VenueState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? addVenueStatus = null,Object? getAllVenuesStatus = null,Object? getVenueStatus = null,Object? getAmenitiesStatus = null,Object? addedVenue = freezed,Object? venues = null,Object? selectedVenue = freezed,Object? amenities = null,Object? successMessage = freezed,Object? errorMessage = freezed,}) {
  return _then(_self.copyWith(
addVenueStatus: null == addVenueStatus ? _self.addVenueStatus : addVenueStatus // ignore: cast_nullable_to_non_nullable
as VenueStatus,getAllVenuesStatus: null == getAllVenuesStatus ? _self.getAllVenuesStatus : getAllVenuesStatus // ignore: cast_nullable_to_non_nullable
as VenueStatus,getVenueStatus: null == getVenueStatus ? _self.getVenueStatus : getVenueStatus // ignore: cast_nullable_to_non_nullable
as VenueStatus,getAmenitiesStatus: null == getAmenitiesStatus ? _self.getAmenitiesStatus : getAmenitiesStatus // ignore: cast_nullable_to_non_nullable
as VenueStatus,addedVenue: freezed == addedVenue ? _self.addedVenue : addedVenue // ignore: cast_nullable_to_non_nullable
as AddNewVenueEntity?,venues: null == venues ? _self.venues : venues // ignore: cast_nullable_to_non_nullable
as List<VenueEntity>,selectedVenue: freezed == selectedVenue ? _self.selectedVenue : selectedVenue // ignore: cast_nullable_to_non_nullable
as VenueEntity?,amenities: null == amenities ? _self.amenities : amenities // ignore: cast_nullable_to_non_nullable
as List<VenueAmenityEntity>,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [VenueState].
extension VenueStatePatterns on VenueState {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _VenueState value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _VenueState() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _VenueState value)  $default,){
final _that = this;
switch (_that) {
case _VenueState():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _VenueState value)?  $default,){
final _that = this;
switch (_that) {
case _VenueState() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( VenueStatus addVenueStatus,  VenueStatus getAllVenuesStatus,  VenueStatus getVenueStatus,  VenueStatus getAmenitiesStatus,  AddNewVenueEntity? addedVenue,  List<VenueEntity> venues,  VenueEntity? selectedVenue,  List<VenueAmenityEntity> amenities,  String? successMessage,  String? errorMessage)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _VenueState() when $default != null:
return $default(_that.addVenueStatus,_that.getAllVenuesStatus,_that.getVenueStatus,_that.getAmenitiesStatus,_that.addedVenue,_that.venues,_that.selectedVenue,_that.amenities,_that.successMessage,_that.errorMessage);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( VenueStatus addVenueStatus,  VenueStatus getAllVenuesStatus,  VenueStatus getVenueStatus,  VenueStatus getAmenitiesStatus,  AddNewVenueEntity? addedVenue,  List<VenueEntity> venues,  VenueEntity? selectedVenue,  List<VenueAmenityEntity> amenities,  String? successMessage,  String? errorMessage)  $default,) {final _that = this;
switch (_that) {
case _VenueState():
return $default(_that.addVenueStatus,_that.getAllVenuesStatus,_that.getVenueStatus,_that.getAmenitiesStatus,_that.addedVenue,_that.venues,_that.selectedVenue,_that.amenities,_that.successMessage,_that.errorMessage);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( VenueStatus addVenueStatus,  VenueStatus getAllVenuesStatus,  VenueStatus getVenueStatus,  VenueStatus getAmenitiesStatus,  AddNewVenueEntity? addedVenue,  List<VenueEntity> venues,  VenueEntity? selectedVenue,  List<VenueAmenityEntity> amenities,  String? successMessage,  String? errorMessage)?  $default,) {final _that = this;
switch (_that) {
case _VenueState() when $default != null:
return $default(_that.addVenueStatus,_that.getAllVenuesStatus,_that.getVenueStatus,_that.getAmenitiesStatus,_that.addedVenue,_that.venues,_that.selectedVenue,_that.amenities,_that.successMessage,_that.errorMessage);case _:
  return null;

}
}

}

/// @nodoc


class _VenueState implements VenueState {
  const _VenueState({this.addVenueStatus = VenueStatus.initial, this.getAllVenuesStatus = VenueStatus.initial, this.getVenueStatus = VenueStatus.initial, this.getAmenitiesStatus = VenueStatus.initial, this.addedVenue, final  List<VenueEntity> venues = const <VenueEntity>[], this.selectedVenue, final  List<VenueAmenityEntity> amenities = const <VenueAmenityEntity>[], this.successMessage, this.errorMessage}): _venues = venues,_amenities = amenities;
  

@override@JsonKey() final  VenueStatus addVenueStatus;
@override@JsonKey() final  VenueStatus getAllVenuesStatus;
@override@JsonKey() final  VenueStatus getVenueStatus;
@override@JsonKey() final  VenueStatus getAmenitiesStatus;
@override final  AddNewVenueEntity? addedVenue;
 final  List<VenueEntity> _venues;
@override@JsonKey() List<VenueEntity> get venues {
  if (_venues is EqualUnmodifiableListView) return _venues;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_venues);
}

@override final  VenueEntity? selectedVenue;
 final  List<VenueAmenityEntity> _amenities;
@override@JsonKey() List<VenueAmenityEntity> get amenities {
  if (_amenities is EqualUnmodifiableListView) return _amenities;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_amenities);
}

@override final  String? successMessage;
@override final  String? errorMessage;

/// Create a copy of VenueState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VenueStateCopyWith<_VenueState> get copyWith => __$VenueStateCopyWithImpl<_VenueState>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VenueState&&(identical(other.addVenueStatus, addVenueStatus) || other.addVenueStatus == addVenueStatus)&&(identical(other.getAllVenuesStatus, getAllVenuesStatus) || other.getAllVenuesStatus == getAllVenuesStatus)&&(identical(other.getVenueStatus, getVenueStatus) || other.getVenueStatus == getVenueStatus)&&(identical(other.getAmenitiesStatus, getAmenitiesStatus) || other.getAmenitiesStatus == getAmenitiesStatus)&&(identical(other.addedVenue, addedVenue) || other.addedVenue == addedVenue)&&const DeepCollectionEquality().equals(other._venues, _venues)&&(identical(other.selectedVenue, selectedVenue) || other.selectedVenue == selectedVenue)&&const DeepCollectionEquality().equals(other._amenities, _amenities)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage));
}


@override
int get hashCode => Object.hash(runtimeType,addVenueStatus,getAllVenuesStatus,getVenueStatus,getAmenitiesStatus,addedVenue,const DeepCollectionEquality().hash(_venues),selectedVenue,const DeepCollectionEquality().hash(_amenities),successMessage,errorMessage);

@override
String toString() {
  return 'VenueState(addVenueStatus: $addVenueStatus, getAllVenuesStatus: $getAllVenuesStatus, getVenueStatus: $getVenueStatus, getAmenitiesStatus: $getAmenitiesStatus, addedVenue: $addedVenue, venues: $venues, selectedVenue: $selectedVenue, amenities: $amenities, successMessage: $successMessage, errorMessage: $errorMessage)';
}


}

/// @nodoc
abstract mixin class _$VenueStateCopyWith<$Res> implements $VenueStateCopyWith<$Res> {
  factory _$VenueStateCopyWith(_VenueState value, $Res Function(_VenueState) _then) = __$VenueStateCopyWithImpl;
@override @useResult
$Res call({
 VenueStatus addVenueStatus, VenueStatus getAllVenuesStatus, VenueStatus getVenueStatus, VenueStatus getAmenitiesStatus, AddNewVenueEntity? addedVenue, List<VenueEntity> venues, VenueEntity? selectedVenue, List<VenueAmenityEntity> amenities, String? successMessage, String? errorMessage
});




}
/// @nodoc
class __$VenueStateCopyWithImpl<$Res>
    implements _$VenueStateCopyWith<$Res> {
  __$VenueStateCopyWithImpl(this._self, this._then);

  final _VenueState _self;
  final $Res Function(_VenueState) _then;

/// Create a copy of VenueState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? addVenueStatus = null,Object? getAllVenuesStatus = null,Object? getVenueStatus = null,Object? getAmenitiesStatus = null,Object? addedVenue = freezed,Object? venues = null,Object? selectedVenue = freezed,Object? amenities = null,Object? successMessage = freezed,Object? errorMessage = freezed,}) {
  return _then(_VenueState(
addVenueStatus: null == addVenueStatus ? _self.addVenueStatus : addVenueStatus // ignore: cast_nullable_to_non_nullable
as VenueStatus,getAllVenuesStatus: null == getAllVenuesStatus ? _self.getAllVenuesStatus : getAllVenuesStatus // ignore: cast_nullable_to_non_nullable
as VenueStatus,getVenueStatus: null == getVenueStatus ? _self.getVenueStatus : getVenueStatus // ignore: cast_nullable_to_non_nullable
as VenueStatus,getAmenitiesStatus: null == getAmenitiesStatus ? _self.getAmenitiesStatus : getAmenitiesStatus // ignore: cast_nullable_to_non_nullable
as VenueStatus,addedVenue: freezed == addedVenue ? _self.addedVenue : addedVenue // ignore: cast_nullable_to_non_nullable
as AddNewVenueEntity?,venues: null == venues ? _self._venues : venues // ignore: cast_nullable_to_non_nullable
as List<VenueEntity>,selectedVenue: freezed == selectedVenue ? _self.selectedVenue : selectedVenue // ignore: cast_nullable_to_non_nullable
as VenueEntity?,amenities: null == amenities ? _self._amenities : amenities // ignore: cast_nullable_to_non_nullable
as List<VenueAmenityEntity>,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
