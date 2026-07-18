// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'update_user_profile_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$UpdateUserProfileRequest {

@JsonKey(name: 'full_name') String get fullName; String get email;
/// Create a copy of UpdateUserProfileRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UpdateUserProfileRequestCopyWith<UpdateUserProfileRequest> get copyWith => _$UpdateUserProfileRequestCopyWithImpl<UpdateUserProfileRequest>(this as UpdateUserProfileRequest, _$identity);

  /// Serializes this UpdateUserProfileRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UpdateUserProfileRequest&&(identical(other.fullName, fullName) || other.fullName == fullName)&&(identical(other.email, email) || other.email == email));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,fullName,email);

@override
String toString() {
  return 'UpdateUserProfileRequest(fullName: $fullName, email: $email)';
}


}

/// @nodoc
abstract mixin class $UpdateUserProfileRequestCopyWith<$Res>  {
  factory $UpdateUserProfileRequestCopyWith(UpdateUserProfileRequest value, $Res Function(UpdateUserProfileRequest) _then) = _$UpdateUserProfileRequestCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'full_name') String fullName, String email
});




}
/// @nodoc
class _$UpdateUserProfileRequestCopyWithImpl<$Res>
    implements $UpdateUserProfileRequestCopyWith<$Res> {
  _$UpdateUserProfileRequestCopyWithImpl(this._self, this._then);

  final UpdateUserProfileRequest _self;
  final $Res Function(UpdateUserProfileRequest) _then;

/// Create a copy of UpdateUserProfileRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? fullName = null,Object? email = null,}) {
  return _then(_self.copyWith(
fullName: null == fullName ? _self.fullName : fullName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [UpdateUserProfileRequest].
extension UpdateUserProfileRequestPatterns on UpdateUserProfileRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UpdateUserProfileRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UpdateUserProfileRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UpdateUserProfileRequest value)  $default,){
final _that = this;
switch (_that) {
case _UpdateUserProfileRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UpdateUserProfileRequest value)?  $default,){
final _that = this;
switch (_that) {
case _UpdateUserProfileRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'full_name')  String fullName,  String email)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UpdateUserProfileRequest() when $default != null:
return $default(_that.fullName,_that.email);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'full_name')  String fullName,  String email)  $default,) {final _that = this;
switch (_that) {
case _UpdateUserProfileRequest():
return $default(_that.fullName,_that.email);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'full_name')  String fullName,  String email)?  $default,) {final _that = this;
switch (_that) {
case _UpdateUserProfileRequest() when $default != null:
return $default(_that.fullName,_that.email);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _UpdateUserProfileRequest implements UpdateUserProfileRequest {
  const _UpdateUserProfileRequest({@JsonKey(name: 'full_name') required this.fullName, required this.email});
  factory _UpdateUserProfileRequest.fromJson(Map<String, dynamic> json) => _$UpdateUserProfileRequestFromJson(json);

@override@JsonKey(name: 'full_name') final  String fullName;
@override final  String email;

/// Create a copy of UpdateUserProfileRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UpdateUserProfileRequestCopyWith<_UpdateUserProfileRequest> get copyWith => __$UpdateUserProfileRequestCopyWithImpl<_UpdateUserProfileRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UpdateUserProfileRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _UpdateUserProfileRequest&&(identical(other.fullName, fullName) || other.fullName == fullName)&&(identical(other.email, email) || other.email == email));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,fullName,email);

@override
String toString() {
  return 'UpdateUserProfileRequest(fullName: $fullName, email: $email)';
}


}

/// @nodoc
abstract mixin class _$UpdateUserProfileRequestCopyWith<$Res> implements $UpdateUserProfileRequestCopyWith<$Res> {
  factory _$UpdateUserProfileRequestCopyWith(_UpdateUserProfileRequest value, $Res Function(_UpdateUserProfileRequest) _then) = __$UpdateUserProfileRequestCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'full_name') String fullName, String email
});




}
/// @nodoc
class __$UpdateUserProfileRequestCopyWithImpl<$Res>
    implements _$UpdateUserProfileRequestCopyWith<$Res> {
  __$UpdateUserProfileRequestCopyWithImpl(this._self, this._then);

  final _UpdateUserProfileRequest _self;
  final $Res Function(_UpdateUserProfileRequest) _then;

/// Create a copy of UpdateUserProfileRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? fullName = null,Object? email = null,}) {
  return _then(_UpdateUserProfileRequest(
fullName: null == fullName ? _self.fullName : fullName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
