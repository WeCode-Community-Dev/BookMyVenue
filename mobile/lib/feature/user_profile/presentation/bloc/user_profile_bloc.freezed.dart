// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user_profile_bloc.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$UserProfileEvent {





@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserProfileEvent);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'UserProfileEvent()';
}


}

/// @nodoc
class $UserProfileEventCopyWith<$Res>  {
$UserProfileEventCopyWith(UserProfileEvent _, $Res Function(UserProfileEvent) __);
}


/// Adds pattern-matching-related methods to [UserProfileEvent].
extension UserProfileEventPatterns on UserProfileEvent {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>({TResult Function( _GetUserProfile value)?  getUserProfile,TResult Function( _Logout value)?  logout,TResult Function( _UpdateUserProfile value)?  updateUserProfile,required TResult orElse(),}){
final _that = this;
switch (_that) {
case _GetUserProfile() when getUserProfile != null:
return getUserProfile(_that);case _Logout() when logout != null:
return logout(_that);case _UpdateUserProfile() when updateUserProfile != null:
return updateUserProfile(_that);case _:
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

@optionalTypeArgs TResult map<TResult extends Object?>({required TResult Function( _GetUserProfile value)  getUserProfile,required TResult Function( _Logout value)  logout,required TResult Function( _UpdateUserProfile value)  updateUserProfile,}){
final _that = this;
switch (_that) {
case _GetUserProfile():
return getUserProfile(_that);case _Logout():
return logout(_that);case _UpdateUserProfile():
return updateUserProfile(_that);case _:
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>({TResult? Function( _GetUserProfile value)?  getUserProfile,TResult? Function( _Logout value)?  logout,TResult? Function( _UpdateUserProfile value)?  updateUserProfile,}){
final _that = this;
switch (_that) {
case _GetUserProfile() when getUserProfile != null:
return getUserProfile(_that);case _Logout() when logout != null:
return logout(_that);case _UpdateUserProfile() when updateUserProfile != null:
return updateUserProfile(_that);case _:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>({TResult Function()?  getUserProfile,TResult Function()?  logout,TResult Function( String fullName,  String email)?  updateUserProfile,required TResult orElse(),}) {final _that = this;
switch (_that) {
case _GetUserProfile() when getUserProfile != null:
return getUserProfile();case _Logout() when logout != null:
return logout();case _UpdateUserProfile() when updateUserProfile != null:
return updateUserProfile(_that.fullName,_that.email);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>({required TResult Function()  getUserProfile,required TResult Function()  logout,required TResult Function( String fullName,  String email)  updateUserProfile,}) {final _that = this;
switch (_that) {
case _GetUserProfile():
return getUserProfile();case _Logout():
return logout();case _UpdateUserProfile():
return updateUserProfile(_that.fullName,_that.email);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>({TResult? Function()?  getUserProfile,TResult? Function()?  logout,TResult? Function( String fullName,  String email)?  updateUserProfile,}) {final _that = this;
switch (_that) {
case _GetUserProfile() when getUserProfile != null:
return getUserProfile();case _Logout() when logout != null:
return logout();case _UpdateUserProfile() when updateUserProfile != null:
return updateUserProfile(_that.fullName,_that.email);case _:
  return null;

}
}

}

/// @nodoc


class _GetUserProfile implements UserProfileEvent {
  const _GetUserProfile();
  






@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _GetUserProfile);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'UserProfileEvent.getUserProfile()';
}


}




/// @nodoc


class _Logout implements UserProfileEvent {
  const _Logout();
  






@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _Logout);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'UserProfileEvent.logout()';
}


}




/// @nodoc


class _UpdateUserProfile implements UserProfileEvent {
  const _UpdateUserProfile({required this.fullName, required this.email});
  

 final  String fullName;
 final  String email;

/// Create a copy of UserProfileEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UpdateUserProfileCopyWith<_UpdateUserProfile> get copyWith => __$UpdateUserProfileCopyWithImpl<_UpdateUserProfile>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _UpdateUserProfile&&(identical(other.fullName, fullName) || other.fullName == fullName)&&(identical(other.email, email) || other.email == email));
}


@override
int get hashCode => Object.hash(runtimeType,fullName,email);

@override
String toString() {
  return 'UserProfileEvent.updateUserProfile(fullName: $fullName, email: $email)';
}


}

/// @nodoc
abstract mixin class _$UpdateUserProfileCopyWith<$Res> implements $UserProfileEventCopyWith<$Res> {
  factory _$UpdateUserProfileCopyWith(_UpdateUserProfile value, $Res Function(_UpdateUserProfile) _then) = __$UpdateUserProfileCopyWithImpl;
@useResult
$Res call({
 String fullName, String email
});




}
/// @nodoc
class __$UpdateUserProfileCopyWithImpl<$Res>
    implements _$UpdateUserProfileCopyWith<$Res> {
  __$UpdateUserProfileCopyWithImpl(this._self, this._then);

  final _UpdateUserProfile _self;
  final $Res Function(_UpdateUserProfile) _then;

/// Create a copy of UserProfileEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? fullName = null,Object? email = null,}) {
  return _then(_UpdateUserProfile(
fullName: null == fullName ? _self.fullName : fullName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

/// @nodoc
mixin _$UserProfileState {

 UserProfileStatus get status; UserProfileResponseEntity? get profile; String? get successMessage; String? get errorMessage; bool get isLoggedOut;
/// Create a copy of UserProfileState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserProfileStateCopyWith<UserProfileState> get copyWith => _$UserProfileStateCopyWithImpl<UserProfileState>(this as UserProfileState, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserProfileState&&(identical(other.status, status) || other.status == status)&&(identical(other.profile, profile) || other.profile == profile)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage)&&(identical(other.isLoggedOut, isLoggedOut) || other.isLoggedOut == isLoggedOut));
}


@override
int get hashCode => Object.hash(runtimeType,status,profile,successMessage,errorMessage,isLoggedOut);

@override
String toString() {
  return 'UserProfileState(status: $status, profile: $profile, successMessage: $successMessage, errorMessage: $errorMessage, isLoggedOut: $isLoggedOut)';
}


}

/// @nodoc
abstract mixin class $UserProfileStateCopyWith<$Res>  {
  factory $UserProfileStateCopyWith(UserProfileState value, $Res Function(UserProfileState) _then) = _$UserProfileStateCopyWithImpl;
@useResult
$Res call({
 UserProfileStatus status, UserProfileResponseEntity? profile, String? successMessage, String? errorMessage, bool isLoggedOut
});




}
/// @nodoc
class _$UserProfileStateCopyWithImpl<$Res>
    implements $UserProfileStateCopyWith<$Res> {
  _$UserProfileStateCopyWithImpl(this._self, this._then);

  final UserProfileState _self;
  final $Res Function(UserProfileState) _then;

/// Create a copy of UserProfileState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? status = null,Object? profile = freezed,Object? successMessage = freezed,Object? errorMessage = freezed,Object? isLoggedOut = null,}) {
  return _then(_self.copyWith(
status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as UserProfileStatus,profile: freezed == profile ? _self.profile : profile // ignore: cast_nullable_to_non_nullable
as UserProfileResponseEntity?,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,isLoggedOut: null == isLoggedOut ? _self.isLoggedOut : isLoggedOut // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [UserProfileState].
extension UserProfileStatePatterns on UserProfileState {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UserProfileState value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UserProfileState() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UserProfileState value)  $default,){
final _that = this;
switch (_that) {
case _UserProfileState():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UserProfileState value)?  $default,){
final _that = this;
switch (_that) {
case _UserProfileState() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( UserProfileStatus status,  UserProfileResponseEntity? profile,  String? successMessage,  String? errorMessage,  bool isLoggedOut)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UserProfileState() when $default != null:
return $default(_that.status,_that.profile,_that.successMessage,_that.errorMessage,_that.isLoggedOut);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( UserProfileStatus status,  UserProfileResponseEntity? profile,  String? successMessage,  String? errorMessage,  bool isLoggedOut)  $default,) {final _that = this;
switch (_that) {
case _UserProfileState():
return $default(_that.status,_that.profile,_that.successMessage,_that.errorMessage,_that.isLoggedOut);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( UserProfileStatus status,  UserProfileResponseEntity? profile,  String? successMessage,  String? errorMessage,  bool isLoggedOut)?  $default,) {final _that = this;
switch (_that) {
case _UserProfileState() when $default != null:
return $default(_that.status,_that.profile,_that.successMessage,_that.errorMessage,_that.isLoggedOut);case _:
  return null;

}
}

}

/// @nodoc


class _UserProfileState implements UserProfileState {
  const _UserProfileState({this.status = UserProfileStatus.initial, this.profile, this.successMessage, this.errorMessage, this.isLoggedOut = false});
  

@override@JsonKey() final  UserProfileStatus status;
@override final  UserProfileResponseEntity? profile;
@override final  String? successMessage;
@override final  String? errorMessage;
@override@JsonKey() final  bool isLoggedOut;

/// Create a copy of UserProfileState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UserProfileStateCopyWith<_UserProfileState> get copyWith => __$UserProfileStateCopyWithImpl<_UserProfileState>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _UserProfileState&&(identical(other.status, status) || other.status == status)&&(identical(other.profile, profile) || other.profile == profile)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage)&&(identical(other.isLoggedOut, isLoggedOut) || other.isLoggedOut == isLoggedOut));
}


@override
int get hashCode => Object.hash(runtimeType,status,profile,successMessage,errorMessage,isLoggedOut);

@override
String toString() {
  return 'UserProfileState(status: $status, profile: $profile, successMessage: $successMessage, errorMessage: $errorMessage, isLoggedOut: $isLoggedOut)';
}


}

/// @nodoc
abstract mixin class _$UserProfileStateCopyWith<$Res> implements $UserProfileStateCopyWith<$Res> {
  factory _$UserProfileStateCopyWith(_UserProfileState value, $Res Function(_UserProfileState) _then) = __$UserProfileStateCopyWithImpl;
@override @useResult
$Res call({
 UserProfileStatus status, UserProfileResponseEntity? profile, String? successMessage, String? errorMessage, bool isLoggedOut
});




}
/// @nodoc
class __$UserProfileStateCopyWithImpl<$Res>
    implements _$UserProfileStateCopyWith<$Res> {
  __$UserProfileStateCopyWithImpl(this._self, this._then);

  final _UserProfileState _self;
  final $Res Function(_UserProfileState) _then;

/// Create a copy of UserProfileState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? status = null,Object? profile = freezed,Object? successMessage = freezed,Object? errorMessage = freezed,Object? isLoggedOut = null,}) {
  return _then(_UserProfileState(
status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as UserProfileStatus,profile: freezed == profile ? _self.profile : profile // ignore: cast_nullable_to_non_nullable
as UserProfileResponseEntity?,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,isLoggedOut: null == isLoggedOut ? _self.isLoggedOut : isLoggedOut // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}

// dart format on
