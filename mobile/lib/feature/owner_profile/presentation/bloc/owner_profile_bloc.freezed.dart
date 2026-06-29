// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'owner_profile_bloc.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$OwnerProfileEvent {





@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OwnerProfileEvent);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'OwnerProfileEvent()';
}


}

/// @nodoc
class $OwnerProfileEventCopyWith<$Res>  {
$OwnerProfileEventCopyWith(OwnerProfileEvent _, $Res Function(OwnerProfileEvent) __);
}


/// Adds pattern-matching-related methods to [OwnerProfileEvent].
extension OwnerProfileEventPatterns on OwnerProfileEvent {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>({TResult Function( _GetOwnerProfile value)?  getOwnerProfile,required TResult orElse(),}){
final _that = this;
switch (_that) {
case _GetOwnerProfile() when getOwnerProfile != null:
return getOwnerProfile(_that);case _:
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

@optionalTypeArgs TResult map<TResult extends Object?>({required TResult Function( _GetOwnerProfile value)  getOwnerProfile,}){
final _that = this;
switch (_that) {
case _GetOwnerProfile():
return getOwnerProfile(_that);case _:
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>({TResult? Function( _GetOwnerProfile value)?  getOwnerProfile,}){
final _that = this;
switch (_that) {
case _GetOwnerProfile() when getOwnerProfile != null:
return getOwnerProfile(_that);case _:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>({TResult Function()?  getOwnerProfile,required TResult orElse(),}) {final _that = this;
switch (_that) {
case _GetOwnerProfile() when getOwnerProfile != null:
return getOwnerProfile();case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>({required TResult Function()  getOwnerProfile,}) {final _that = this;
switch (_that) {
case _GetOwnerProfile():
return getOwnerProfile();case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>({TResult? Function()?  getOwnerProfile,}) {final _that = this;
switch (_that) {
case _GetOwnerProfile() when getOwnerProfile != null:
return getOwnerProfile();case _:
  return null;

}
}

}

/// @nodoc


class _GetOwnerProfile implements OwnerProfileEvent {
  const _GetOwnerProfile();
  






@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _GetOwnerProfile);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'OwnerProfileEvent.getOwnerProfile()';
}


}




/// @nodoc
mixin _$OwnerProfileState {

 OwnerProfileStatus get status; OwnerProfileResponseEntity? get profile; String? get errorMessage; String? get successMessage;
/// Create a copy of OwnerProfileState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OwnerProfileStateCopyWith<OwnerProfileState> get copyWith => _$OwnerProfileStateCopyWithImpl<OwnerProfileState>(this as OwnerProfileState, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OwnerProfileState&&(identical(other.status, status) || other.status == status)&&(identical(other.profile, profile) || other.profile == profile)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage));
}


@override
int get hashCode => Object.hash(runtimeType,status,profile,errorMessage,successMessage);

@override
String toString() {
  return 'OwnerProfileState(status: $status, profile: $profile, errorMessage: $errorMessage, successMessage: $successMessage)';
}


}

/// @nodoc
abstract mixin class $OwnerProfileStateCopyWith<$Res>  {
  factory $OwnerProfileStateCopyWith(OwnerProfileState value, $Res Function(OwnerProfileState) _then) = _$OwnerProfileStateCopyWithImpl;
@useResult
$Res call({
 OwnerProfileStatus status, OwnerProfileResponseEntity? profile, String? errorMessage, String? successMessage
});




}
/// @nodoc
class _$OwnerProfileStateCopyWithImpl<$Res>
    implements $OwnerProfileStateCopyWith<$Res> {
  _$OwnerProfileStateCopyWithImpl(this._self, this._then);

  final OwnerProfileState _self;
  final $Res Function(OwnerProfileState) _then;

/// Create a copy of OwnerProfileState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? status = null,Object? profile = freezed,Object? errorMessage = freezed,Object? successMessage = freezed,}) {
  return _then(_self.copyWith(
status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as OwnerProfileStatus,profile: freezed == profile ? _self.profile : profile // ignore: cast_nullable_to_non_nullable
as OwnerProfileResponseEntity?,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [OwnerProfileState].
extension OwnerProfileStatePatterns on OwnerProfileState {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OwnerProfileState value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OwnerProfileState() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OwnerProfileState value)  $default,){
final _that = this;
switch (_that) {
case _OwnerProfileState():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OwnerProfileState value)?  $default,){
final _that = this;
switch (_that) {
case _OwnerProfileState() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( OwnerProfileStatus status,  OwnerProfileResponseEntity? profile,  String? errorMessage,  String? successMessage)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OwnerProfileState() when $default != null:
return $default(_that.status,_that.profile,_that.errorMessage,_that.successMessage);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( OwnerProfileStatus status,  OwnerProfileResponseEntity? profile,  String? errorMessage,  String? successMessage)  $default,) {final _that = this;
switch (_that) {
case _OwnerProfileState():
return $default(_that.status,_that.profile,_that.errorMessage,_that.successMessage);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( OwnerProfileStatus status,  OwnerProfileResponseEntity? profile,  String? errorMessage,  String? successMessage)?  $default,) {final _that = this;
switch (_that) {
case _OwnerProfileState() when $default != null:
return $default(_that.status,_that.profile,_that.errorMessage,_that.successMessage);case _:
  return null;

}
}

}

/// @nodoc


class _OwnerProfileState implements OwnerProfileState {
  const _OwnerProfileState({this.status = OwnerProfileStatus.initial, this.profile, this.errorMessage, this.successMessage});
  

@override@JsonKey() final  OwnerProfileStatus status;
@override final  OwnerProfileResponseEntity? profile;
@override final  String? errorMessage;
@override final  String? successMessage;

/// Create a copy of OwnerProfileState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OwnerProfileStateCopyWith<_OwnerProfileState> get copyWith => __$OwnerProfileStateCopyWithImpl<_OwnerProfileState>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _OwnerProfileState&&(identical(other.status, status) || other.status == status)&&(identical(other.profile, profile) || other.profile == profile)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage));
}


@override
int get hashCode => Object.hash(runtimeType,status,profile,errorMessage,successMessage);

@override
String toString() {
  return 'OwnerProfileState(status: $status, profile: $profile, errorMessage: $errorMessage, successMessage: $successMessage)';
}


}

/// @nodoc
abstract mixin class _$OwnerProfileStateCopyWith<$Res> implements $OwnerProfileStateCopyWith<$Res> {
  factory _$OwnerProfileStateCopyWith(_OwnerProfileState value, $Res Function(_OwnerProfileState) _then) = __$OwnerProfileStateCopyWithImpl;
@override @useResult
$Res call({
 OwnerProfileStatus status, OwnerProfileResponseEntity? profile, String? errorMessage, String? successMessage
});




}
/// @nodoc
class __$OwnerProfileStateCopyWithImpl<$Res>
    implements _$OwnerProfileStateCopyWith<$Res> {
  __$OwnerProfileStateCopyWithImpl(this._self, this._then);

  final _OwnerProfileState _self;
  final $Res Function(_OwnerProfileState) _then;

/// Create a copy of OwnerProfileState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? status = null,Object? profile = freezed,Object? errorMessage = freezed,Object? successMessage = freezed,}) {
  return _then(_OwnerProfileState(
status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as OwnerProfileStatus,profile: freezed == profile ? _self.profile : profile // ignore: cast_nullable_to_non_nullable
as OwnerProfileResponseEntity?,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
