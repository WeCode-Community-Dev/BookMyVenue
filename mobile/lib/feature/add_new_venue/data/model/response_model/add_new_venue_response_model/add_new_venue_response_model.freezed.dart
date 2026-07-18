// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'add_new_venue_response_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AddNewVenueResponseModel {

 String get id;@JsonKey(name: 'venue_name') String get venueName; String get slug; String get status;@JsonKey(name: 'verification_status') String get verificationStatus;
/// Create a copy of AddNewVenueResponseModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AddNewVenueResponseModelCopyWith<AddNewVenueResponseModel> get copyWith => _$AddNewVenueResponseModelCopyWithImpl<AddNewVenueResponseModel>(this as AddNewVenueResponseModel, _$identity);

  /// Serializes this AddNewVenueResponseModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AddNewVenueResponseModel&&(identical(other.id, id) || other.id == id)&&(identical(other.venueName, venueName) || other.venueName == venueName)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.status, status) || other.status == status)&&(identical(other.verificationStatus, verificationStatus) || other.verificationStatus == verificationStatus));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,venueName,slug,status,verificationStatus);

@override
String toString() {
  return 'AddNewVenueResponseModel(id: $id, venueName: $venueName, slug: $slug, status: $status, verificationStatus: $verificationStatus)';
}


}

/// @nodoc
abstract mixin class $AddNewVenueResponseModelCopyWith<$Res>  {
  factory $AddNewVenueResponseModelCopyWith(AddNewVenueResponseModel value, $Res Function(AddNewVenueResponseModel) _then) = _$AddNewVenueResponseModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'venue_name') String venueName, String slug, String status,@JsonKey(name: 'verification_status') String verificationStatus
});




}
/// @nodoc
class _$AddNewVenueResponseModelCopyWithImpl<$Res>
    implements $AddNewVenueResponseModelCopyWith<$Res> {
  _$AddNewVenueResponseModelCopyWithImpl(this._self, this._then);

  final AddNewVenueResponseModel _self;
  final $Res Function(AddNewVenueResponseModel) _then;

/// Create a copy of AddNewVenueResponseModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? venueName = null,Object? slug = null,Object? status = null,Object? verificationStatus = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,venueName: null == venueName ? _self.venueName : venueName // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,verificationStatus: null == verificationStatus ? _self.verificationStatus : verificationStatus // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [AddNewVenueResponseModel].
extension AddNewVenueResponseModelPatterns on AddNewVenueResponseModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AddNewVenueResponseModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AddNewVenueResponseModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AddNewVenueResponseModel value)  $default,){
final _that = this;
switch (_that) {
case _AddNewVenueResponseModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AddNewVenueResponseModel value)?  $default,){
final _that = this;
switch (_that) {
case _AddNewVenueResponseModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'venue_name')  String venueName,  String slug,  String status, @JsonKey(name: 'verification_status')  String verificationStatus)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AddNewVenueResponseModel() when $default != null:
return $default(_that.id,_that.venueName,_that.slug,_that.status,_that.verificationStatus);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'venue_name')  String venueName,  String slug,  String status, @JsonKey(name: 'verification_status')  String verificationStatus)  $default,) {final _that = this;
switch (_that) {
case _AddNewVenueResponseModel():
return $default(_that.id,_that.venueName,_that.slug,_that.status,_that.verificationStatus);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'venue_name')  String venueName,  String slug,  String status, @JsonKey(name: 'verification_status')  String verificationStatus)?  $default,) {final _that = this;
switch (_that) {
case _AddNewVenueResponseModel() when $default != null:
return $default(_that.id,_that.venueName,_that.slug,_that.status,_that.verificationStatus);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AddNewVenueResponseModel implements AddNewVenueResponseModel {
  const _AddNewVenueResponseModel({required this.id, @JsonKey(name: 'venue_name') required this.venueName, required this.slug, required this.status, @JsonKey(name: 'verification_status') required this.verificationStatus});
  factory _AddNewVenueResponseModel.fromJson(Map<String, dynamic> json) => _$AddNewVenueResponseModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'venue_name') final  String venueName;
@override final  String slug;
@override final  String status;
@override@JsonKey(name: 'verification_status') final  String verificationStatus;

/// Create a copy of AddNewVenueResponseModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AddNewVenueResponseModelCopyWith<_AddNewVenueResponseModel> get copyWith => __$AddNewVenueResponseModelCopyWithImpl<_AddNewVenueResponseModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AddNewVenueResponseModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _AddNewVenueResponseModel&&(identical(other.id, id) || other.id == id)&&(identical(other.venueName, venueName) || other.venueName == venueName)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.status, status) || other.status == status)&&(identical(other.verificationStatus, verificationStatus) || other.verificationStatus == verificationStatus));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,venueName,slug,status,verificationStatus);

@override
String toString() {
  return 'AddNewVenueResponseModel(id: $id, venueName: $venueName, slug: $slug, status: $status, verificationStatus: $verificationStatus)';
}


}

/// @nodoc
abstract mixin class _$AddNewVenueResponseModelCopyWith<$Res> implements $AddNewVenueResponseModelCopyWith<$Res> {
  factory _$AddNewVenueResponseModelCopyWith(_AddNewVenueResponseModel value, $Res Function(_AddNewVenueResponseModel) _then) = __$AddNewVenueResponseModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'venue_name') String venueName, String slug, String status,@JsonKey(name: 'verification_status') String verificationStatus
});




}
/// @nodoc
class __$AddNewVenueResponseModelCopyWithImpl<$Res>
    implements _$AddNewVenueResponseModelCopyWith<$Res> {
  __$AddNewVenueResponseModelCopyWithImpl(this._self, this._then);

  final _AddNewVenueResponseModel _self;
  final $Res Function(_AddNewVenueResponseModel) _then;

/// Create a copy of AddNewVenueResponseModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? venueName = null,Object? slug = null,Object? status = null,Object? verificationStatus = null,}) {
  return _then(_AddNewVenueResponseModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,venueName: null == venueName ? _self.venueName : venueName // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,verificationStatus: null == verificationStatus ? _self.verificationStatus : verificationStatus // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
