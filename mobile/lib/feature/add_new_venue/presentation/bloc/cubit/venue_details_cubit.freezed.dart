// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'venue_details_cubit.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$VenueDetailsState {

 VenueBasicInfoState? get basicInfo; VenueLocationState? get location; VenueMediaState? get media; List<VenuePricingState>? get pricing; List<VenueServiceState>? get service; int get step;
/// Create a copy of VenueDetailsState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$VenueDetailsStateCopyWith<VenueDetailsState> get copyWith => _$VenueDetailsStateCopyWithImpl<VenueDetailsState>(this as VenueDetailsState, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VenueDetailsState&&(identical(other.basicInfo, basicInfo) || other.basicInfo == basicInfo)&&(identical(other.location, location) || other.location == location)&&(identical(other.media, media) || other.media == media)&&const DeepCollectionEquality().equals(other.pricing, pricing)&&const DeepCollectionEquality().equals(other.service, service)&&(identical(other.step, step) || other.step == step));
}


@override
int get hashCode => Object.hash(runtimeType,basicInfo,location,media,const DeepCollectionEquality().hash(pricing),const DeepCollectionEquality().hash(service),step);

@override
String toString() {
  return 'VenueDetailsState(basicInfo: $basicInfo, location: $location, media: $media, pricing: $pricing, service: $service, step: $step)';
}


}

/// @nodoc
abstract mixin class $VenueDetailsStateCopyWith<$Res>  {
  factory $VenueDetailsStateCopyWith(VenueDetailsState value, $Res Function(VenueDetailsState) _then) = _$VenueDetailsStateCopyWithImpl;
@useResult
$Res call({
 VenueBasicInfoState? basicInfo, VenueLocationState? location, VenueMediaState? media, List<VenuePricingState>? pricing, List<VenueServiceState>? service, int step
});




}
/// @nodoc
class _$VenueDetailsStateCopyWithImpl<$Res>
    implements $VenueDetailsStateCopyWith<$Res> {
  _$VenueDetailsStateCopyWithImpl(this._self, this._then);

  final VenueDetailsState _self;
  final $Res Function(VenueDetailsState) _then;

/// Create a copy of VenueDetailsState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? basicInfo = freezed,Object? location = freezed,Object? media = freezed,Object? pricing = freezed,Object? service = freezed,Object? step = null,}) {
  return _then(_self.copyWith(
basicInfo: freezed == basicInfo ? _self.basicInfo : basicInfo // ignore: cast_nullable_to_non_nullable
as VenueBasicInfoState?,location: freezed == location ? _self.location : location // ignore: cast_nullable_to_non_nullable
as VenueLocationState?,media: freezed == media ? _self.media : media // ignore: cast_nullable_to_non_nullable
as VenueMediaState?,pricing: freezed == pricing ? _self.pricing : pricing // ignore: cast_nullable_to_non_nullable
as List<VenuePricingState>?,service: freezed == service ? _self.service : service // ignore: cast_nullable_to_non_nullable
as List<VenueServiceState>?,step: null == step ? _self.step : step // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [VenueDetailsState].
extension VenueDetailsStatePatterns on VenueDetailsState {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _VenueDetailsState value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _VenueDetailsState() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _VenueDetailsState value)  $default,){
final _that = this;
switch (_that) {
case _VenueDetailsState():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _VenueDetailsState value)?  $default,){
final _that = this;
switch (_that) {
case _VenueDetailsState() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( VenueBasicInfoState? basicInfo,  VenueLocationState? location,  VenueMediaState? media,  List<VenuePricingState>? pricing,  List<VenueServiceState>? service,  int step)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _VenueDetailsState() when $default != null:
return $default(_that.basicInfo,_that.location,_that.media,_that.pricing,_that.service,_that.step);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( VenueBasicInfoState? basicInfo,  VenueLocationState? location,  VenueMediaState? media,  List<VenuePricingState>? pricing,  List<VenueServiceState>? service,  int step)  $default,) {final _that = this;
switch (_that) {
case _VenueDetailsState():
return $default(_that.basicInfo,_that.location,_that.media,_that.pricing,_that.service,_that.step);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( VenueBasicInfoState? basicInfo,  VenueLocationState? location,  VenueMediaState? media,  List<VenuePricingState>? pricing,  List<VenueServiceState>? service,  int step)?  $default,) {final _that = this;
switch (_that) {
case _VenueDetailsState() when $default != null:
return $default(_that.basicInfo,_that.location,_that.media,_that.pricing,_that.service,_that.step);case _:
  return null;

}
}

}

/// @nodoc


class _VenueDetailsState implements VenueDetailsState {
  const _VenueDetailsState({this.basicInfo, this.location, this.media, final  List<VenuePricingState>? pricing, final  List<VenueServiceState>? service, required this.step}): _pricing = pricing,_service = service;
  

@override final  VenueBasicInfoState? basicInfo;
@override final  VenueLocationState? location;
@override final  VenueMediaState? media;
 final  List<VenuePricingState>? _pricing;
@override List<VenuePricingState>? get pricing {
  final value = _pricing;
  if (value == null) return null;
  if (_pricing is EqualUnmodifiableListView) return _pricing;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

 final  List<VenueServiceState>? _service;
@override List<VenueServiceState>? get service {
  final value = _service;
  if (value == null) return null;
  if (_service is EqualUnmodifiableListView) return _service;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

@override final  int step;

/// Create a copy of VenueDetailsState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VenueDetailsStateCopyWith<_VenueDetailsState> get copyWith => __$VenueDetailsStateCopyWithImpl<_VenueDetailsState>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VenueDetailsState&&(identical(other.basicInfo, basicInfo) || other.basicInfo == basicInfo)&&(identical(other.location, location) || other.location == location)&&(identical(other.media, media) || other.media == media)&&const DeepCollectionEquality().equals(other._pricing, _pricing)&&const DeepCollectionEquality().equals(other._service, _service)&&(identical(other.step, step) || other.step == step));
}


@override
int get hashCode => Object.hash(runtimeType,basicInfo,location,media,const DeepCollectionEquality().hash(_pricing),const DeepCollectionEquality().hash(_service),step);

@override
String toString() {
  return 'VenueDetailsState(basicInfo: $basicInfo, location: $location, media: $media, pricing: $pricing, service: $service, step: $step)';
}


}

/// @nodoc
abstract mixin class _$VenueDetailsStateCopyWith<$Res> implements $VenueDetailsStateCopyWith<$Res> {
  factory _$VenueDetailsStateCopyWith(_VenueDetailsState value, $Res Function(_VenueDetailsState) _then) = __$VenueDetailsStateCopyWithImpl;
@override @useResult
$Res call({
 VenueBasicInfoState? basicInfo, VenueLocationState? location, VenueMediaState? media, List<VenuePricingState>? pricing, List<VenueServiceState>? service, int step
});




}
/// @nodoc
class __$VenueDetailsStateCopyWithImpl<$Res>
    implements _$VenueDetailsStateCopyWith<$Res> {
  __$VenueDetailsStateCopyWithImpl(this._self, this._then);

  final _VenueDetailsState _self;
  final $Res Function(_VenueDetailsState) _then;

/// Create a copy of VenueDetailsState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? basicInfo = freezed,Object? location = freezed,Object? media = freezed,Object? pricing = freezed,Object? service = freezed,Object? step = null,}) {
  return _then(_VenueDetailsState(
basicInfo: freezed == basicInfo ? _self.basicInfo : basicInfo // ignore: cast_nullable_to_non_nullable
as VenueBasicInfoState?,location: freezed == location ? _self.location : location // ignore: cast_nullable_to_non_nullable
as VenueLocationState?,media: freezed == media ? _self.media : media // ignore: cast_nullable_to_non_nullable
as VenueMediaState?,pricing: freezed == pricing ? _self._pricing : pricing // ignore: cast_nullable_to_non_nullable
as List<VenuePricingState>?,service: freezed == service ? _self._service : service // ignore: cast_nullable_to_non_nullable
as List<VenueServiceState>?,step: null == step ? _self.step : step // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
