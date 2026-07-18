// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'register_response_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$RegisterResponseModel {

@JsonKey(name: 'full_name') String get fullName; String get email;@JsonKey(name: 'mobile_number') String get mobileNumber; String get otp;@JsonKey(name: 'expires_in_seconds') int get expiresInSeconds; String get message;
/// Create a copy of RegisterResponseModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$RegisterResponseModelCopyWith<RegisterResponseModel> get copyWith => _$RegisterResponseModelCopyWithImpl<RegisterResponseModel>(this as RegisterResponseModel, _$identity);

  /// Serializes this RegisterResponseModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is RegisterResponseModel&&(identical(other.fullName, fullName) || other.fullName == fullName)&&(identical(other.email, email) || other.email == email)&&(identical(other.mobileNumber, mobileNumber) || other.mobileNumber == mobileNumber)&&(identical(other.otp, otp) || other.otp == otp)&&(identical(other.expiresInSeconds, expiresInSeconds) || other.expiresInSeconds == expiresInSeconds)&&(identical(other.message, message) || other.message == message));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,fullName,email,mobileNumber,otp,expiresInSeconds,message);

@override
String toString() {
  return 'RegisterResponseModel(fullName: $fullName, email: $email, mobileNumber: $mobileNumber, otp: $otp, expiresInSeconds: $expiresInSeconds, message: $message)';
}


}

/// @nodoc
abstract mixin class $RegisterResponseModelCopyWith<$Res>  {
  factory $RegisterResponseModelCopyWith(RegisterResponseModel value, $Res Function(RegisterResponseModel) _then) = _$RegisterResponseModelCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'full_name') String fullName, String email,@JsonKey(name: 'mobile_number') String mobileNumber, String otp,@JsonKey(name: 'expires_in_seconds') int expiresInSeconds, String message
});




}
/// @nodoc
class _$RegisterResponseModelCopyWithImpl<$Res>
    implements $RegisterResponseModelCopyWith<$Res> {
  _$RegisterResponseModelCopyWithImpl(this._self, this._then);

  final RegisterResponseModel _self;
  final $Res Function(RegisterResponseModel) _then;

/// Create a copy of RegisterResponseModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? fullName = null,Object? email = null,Object? mobileNumber = null,Object? otp = null,Object? expiresInSeconds = null,Object? message = null,}) {
  return _then(_self.copyWith(
fullName: null == fullName ? _self.fullName : fullName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,mobileNumber: null == mobileNumber ? _self.mobileNumber : mobileNumber // ignore: cast_nullable_to_non_nullable
as String,otp: null == otp ? _self.otp : otp // ignore: cast_nullable_to_non_nullable
as String,expiresInSeconds: null == expiresInSeconds ? _self.expiresInSeconds : expiresInSeconds // ignore: cast_nullable_to_non_nullable
as int,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [RegisterResponseModel].
extension RegisterResponseModelPatterns on RegisterResponseModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _RegisterResponseModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _RegisterResponseModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _RegisterResponseModel value)  $default,){
final _that = this;
switch (_that) {
case _RegisterResponseModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _RegisterResponseModel value)?  $default,){
final _that = this;
switch (_that) {
case _RegisterResponseModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'full_name')  String fullName,  String email, @JsonKey(name: 'mobile_number')  String mobileNumber,  String otp, @JsonKey(name: 'expires_in_seconds')  int expiresInSeconds,  String message)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _RegisterResponseModel() when $default != null:
return $default(_that.fullName,_that.email,_that.mobileNumber,_that.otp,_that.expiresInSeconds,_that.message);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'full_name')  String fullName,  String email, @JsonKey(name: 'mobile_number')  String mobileNumber,  String otp, @JsonKey(name: 'expires_in_seconds')  int expiresInSeconds,  String message)  $default,) {final _that = this;
switch (_that) {
case _RegisterResponseModel():
return $default(_that.fullName,_that.email,_that.mobileNumber,_that.otp,_that.expiresInSeconds,_that.message);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'full_name')  String fullName,  String email, @JsonKey(name: 'mobile_number')  String mobileNumber,  String otp, @JsonKey(name: 'expires_in_seconds')  int expiresInSeconds,  String message)?  $default,) {final _that = this;
switch (_that) {
case _RegisterResponseModel() when $default != null:
return $default(_that.fullName,_that.email,_that.mobileNumber,_that.otp,_that.expiresInSeconds,_that.message);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _RegisterResponseModel implements RegisterResponseModel {
  const _RegisterResponseModel({@JsonKey(name: 'full_name') required this.fullName, required this.email, @JsonKey(name: 'mobile_number') required this.mobileNumber, required this.otp, @JsonKey(name: 'expires_in_seconds') required this.expiresInSeconds, required this.message});
  factory _RegisterResponseModel.fromJson(Map<String, dynamic> json) => _$RegisterResponseModelFromJson(json);

@override@JsonKey(name: 'full_name') final  String fullName;
@override final  String email;
@override@JsonKey(name: 'mobile_number') final  String mobileNumber;
@override final  String otp;
@override@JsonKey(name: 'expires_in_seconds') final  int expiresInSeconds;
@override final  String message;

/// Create a copy of RegisterResponseModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$RegisterResponseModelCopyWith<_RegisterResponseModel> get copyWith => __$RegisterResponseModelCopyWithImpl<_RegisterResponseModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$RegisterResponseModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _RegisterResponseModel&&(identical(other.fullName, fullName) || other.fullName == fullName)&&(identical(other.email, email) || other.email == email)&&(identical(other.mobileNumber, mobileNumber) || other.mobileNumber == mobileNumber)&&(identical(other.otp, otp) || other.otp == otp)&&(identical(other.expiresInSeconds, expiresInSeconds) || other.expiresInSeconds == expiresInSeconds)&&(identical(other.message, message) || other.message == message));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,fullName,email,mobileNumber,otp,expiresInSeconds,message);

@override
String toString() {
  return 'RegisterResponseModel(fullName: $fullName, email: $email, mobileNumber: $mobileNumber, otp: $otp, expiresInSeconds: $expiresInSeconds, message: $message)';
}


}

/// @nodoc
abstract mixin class _$RegisterResponseModelCopyWith<$Res> implements $RegisterResponseModelCopyWith<$Res> {
  factory _$RegisterResponseModelCopyWith(_RegisterResponseModel value, $Res Function(_RegisterResponseModel) _then) = __$RegisterResponseModelCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'full_name') String fullName, String email,@JsonKey(name: 'mobile_number') String mobileNumber, String otp,@JsonKey(name: 'expires_in_seconds') int expiresInSeconds, String message
});




}
/// @nodoc
class __$RegisterResponseModelCopyWithImpl<$Res>
    implements _$RegisterResponseModelCopyWith<$Res> {
  __$RegisterResponseModelCopyWithImpl(this._self, this._then);

  final _RegisterResponseModel _self;
  final $Res Function(_RegisterResponseModel) _then;

/// Create a copy of RegisterResponseModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? fullName = null,Object? email = null,Object? mobileNumber = null,Object? otp = null,Object? expiresInSeconds = null,Object? message = null,}) {
  return _then(_RegisterResponseModel(
fullName: null == fullName ? _self.fullName : fullName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,mobileNumber: null == mobileNumber ? _self.mobileNumber : mobileNumber // ignore: cast_nullable_to_non_nullable
as String,otp: null == otp ? _self.otp : otp // ignore: cast_nullable_to_non_nullable
as String,expiresInSeconds: null == expiresInSeconds ? _self.expiresInSeconds : expiresInSeconds // ignore: cast_nullable_to_non_nullable
as int,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$VerifyOwnerOtpResponseModel {

@JsonKey(name: 'access_token') String get accessToken;@JsonKey(name: 'refresh_token') String get refreshToken;@JsonKey(name: 'token_type') String get tokenType; UserModel get user;
/// Create a copy of VerifyOwnerOtpResponseModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$VerifyOwnerOtpResponseModelCopyWith<VerifyOwnerOtpResponseModel> get copyWith => _$VerifyOwnerOtpResponseModelCopyWithImpl<VerifyOwnerOtpResponseModel>(this as VerifyOwnerOtpResponseModel, _$identity);

  /// Serializes this VerifyOwnerOtpResponseModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VerifyOwnerOtpResponseModel&&(identical(other.accessToken, accessToken) || other.accessToken == accessToken)&&(identical(other.refreshToken, refreshToken) || other.refreshToken == refreshToken)&&(identical(other.tokenType, tokenType) || other.tokenType == tokenType)&&(identical(other.user, user) || other.user == user));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,accessToken,refreshToken,tokenType,user);

@override
String toString() {
  return 'VerifyOwnerOtpResponseModel(accessToken: $accessToken, refreshToken: $refreshToken, tokenType: $tokenType, user: $user)';
}


}

/// @nodoc
abstract mixin class $VerifyOwnerOtpResponseModelCopyWith<$Res>  {
  factory $VerifyOwnerOtpResponseModelCopyWith(VerifyOwnerOtpResponseModel value, $Res Function(VerifyOwnerOtpResponseModel) _then) = _$VerifyOwnerOtpResponseModelCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'access_token') String accessToken,@JsonKey(name: 'refresh_token') String refreshToken,@JsonKey(name: 'token_type') String tokenType, UserModel user
});


$UserModelCopyWith<$Res> get user;

}
/// @nodoc
class _$VerifyOwnerOtpResponseModelCopyWithImpl<$Res>
    implements $VerifyOwnerOtpResponseModelCopyWith<$Res> {
  _$VerifyOwnerOtpResponseModelCopyWithImpl(this._self, this._then);

  final VerifyOwnerOtpResponseModel _self;
  final $Res Function(VerifyOwnerOtpResponseModel) _then;

/// Create a copy of VerifyOwnerOtpResponseModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? accessToken = null,Object? refreshToken = null,Object? tokenType = null,Object? user = null,}) {
  return _then(_self.copyWith(
accessToken: null == accessToken ? _self.accessToken : accessToken // ignore: cast_nullable_to_non_nullable
as String,refreshToken: null == refreshToken ? _self.refreshToken : refreshToken // ignore: cast_nullable_to_non_nullable
as String,tokenType: null == tokenType ? _self.tokenType : tokenType // ignore: cast_nullable_to_non_nullable
as String,user: null == user ? _self.user : user // ignore: cast_nullable_to_non_nullable
as UserModel,
  ));
}
/// Create a copy of VerifyOwnerOtpResponseModel
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$UserModelCopyWith<$Res> get user {
  
  return $UserModelCopyWith<$Res>(_self.user, (value) {
    return _then(_self.copyWith(user: value));
  });
}
}


/// Adds pattern-matching-related methods to [VerifyOwnerOtpResponseModel].
extension VerifyOwnerOtpResponseModelPatterns on VerifyOwnerOtpResponseModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _VerifyOwnerOtpResponseModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _VerifyOwnerOtpResponseModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _VerifyOwnerOtpResponseModel value)  $default,){
final _that = this;
switch (_that) {
case _VerifyOwnerOtpResponseModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _VerifyOwnerOtpResponseModel value)?  $default,){
final _that = this;
switch (_that) {
case _VerifyOwnerOtpResponseModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'access_token')  String accessToken, @JsonKey(name: 'refresh_token')  String refreshToken, @JsonKey(name: 'token_type')  String tokenType,  UserModel user)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _VerifyOwnerOtpResponseModel() when $default != null:
return $default(_that.accessToken,_that.refreshToken,_that.tokenType,_that.user);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'access_token')  String accessToken, @JsonKey(name: 'refresh_token')  String refreshToken, @JsonKey(name: 'token_type')  String tokenType,  UserModel user)  $default,) {final _that = this;
switch (_that) {
case _VerifyOwnerOtpResponseModel():
return $default(_that.accessToken,_that.refreshToken,_that.tokenType,_that.user);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'access_token')  String accessToken, @JsonKey(name: 'refresh_token')  String refreshToken, @JsonKey(name: 'token_type')  String tokenType,  UserModel user)?  $default,) {final _that = this;
switch (_that) {
case _VerifyOwnerOtpResponseModel() when $default != null:
return $default(_that.accessToken,_that.refreshToken,_that.tokenType,_that.user);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _VerifyOwnerOtpResponseModel implements VerifyOwnerOtpResponseModel {
  const _VerifyOwnerOtpResponseModel({@JsonKey(name: 'access_token') required this.accessToken, @JsonKey(name: 'refresh_token') required this.refreshToken, @JsonKey(name: 'token_type') required this.tokenType, required this.user});
  factory _VerifyOwnerOtpResponseModel.fromJson(Map<String, dynamic> json) => _$VerifyOwnerOtpResponseModelFromJson(json);

@override@JsonKey(name: 'access_token') final  String accessToken;
@override@JsonKey(name: 'refresh_token') final  String refreshToken;
@override@JsonKey(name: 'token_type') final  String tokenType;
@override final  UserModel user;

/// Create a copy of VerifyOwnerOtpResponseModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VerifyOwnerOtpResponseModelCopyWith<_VerifyOwnerOtpResponseModel> get copyWith => __$VerifyOwnerOtpResponseModelCopyWithImpl<_VerifyOwnerOtpResponseModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$VerifyOwnerOtpResponseModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VerifyOwnerOtpResponseModel&&(identical(other.accessToken, accessToken) || other.accessToken == accessToken)&&(identical(other.refreshToken, refreshToken) || other.refreshToken == refreshToken)&&(identical(other.tokenType, tokenType) || other.tokenType == tokenType)&&(identical(other.user, user) || other.user == user));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,accessToken,refreshToken,tokenType,user);

@override
String toString() {
  return 'VerifyOwnerOtpResponseModel(accessToken: $accessToken, refreshToken: $refreshToken, tokenType: $tokenType, user: $user)';
}


}

/// @nodoc
abstract mixin class _$VerifyOwnerOtpResponseModelCopyWith<$Res> implements $VerifyOwnerOtpResponseModelCopyWith<$Res> {
  factory _$VerifyOwnerOtpResponseModelCopyWith(_VerifyOwnerOtpResponseModel value, $Res Function(_VerifyOwnerOtpResponseModel) _then) = __$VerifyOwnerOtpResponseModelCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'access_token') String accessToken,@JsonKey(name: 'refresh_token') String refreshToken,@JsonKey(name: 'token_type') String tokenType, UserModel user
});


@override $UserModelCopyWith<$Res> get user;

}
/// @nodoc
class __$VerifyOwnerOtpResponseModelCopyWithImpl<$Res>
    implements _$VerifyOwnerOtpResponseModelCopyWith<$Res> {
  __$VerifyOwnerOtpResponseModelCopyWithImpl(this._self, this._then);

  final _VerifyOwnerOtpResponseModel _self;
  final $Res Function(_VerifyOwnerOtpResponseModel) _then;

/// Create a copy of VerifyOwnerOtpResponseModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? accessToken = null,Object? refreshToken = null,Object? tokenType = null,Object? user = null,}) {
  return _then(_VerifyOwnerOtpResponseModel(
accessToken: null == accessToken ? _self.accessToken : accessToken // ignore: cast_nullable_to_non_nullable
as String,refreshToken: null == refreshToken ? _self.refreshToken : refreshToken // ignore: cast_nullable_to_non_nullable
as String,tokenType: null == tokenType ? _self.tokenType : tokenType // ignore: cast_nullable_to_non_nullable
as String,user: null == user ? _self.user : user // ignore: cast_nullable_to_non_nullable
as UserModel,
  ));
}

/// Create a copy of VerifyOwnerOtpResponseModel
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$UserModelCopyWith<$Res> get user {
  
  return $UserModelCopyWith<$Res>(_self.user, (value) {
    return _then(_self.copyWith(user: value));
  });
}
}


/// @nodoc
mixin _$UserModel {

 String get id;@JsonKey(name: 'mobile_number') String get mobileNumber;@JsonKey(name: 'full_name') String get fullName; String get email;@JsonKey(name: 'mobile_verified') bool get mobileVerified;@JsonKey(name: 'email_verified') bool get emailVerified; UserRole get role; String get status;@JsonKey(name: 'created_at') DateTime get createdAt;@JsonKey(name: 'updated_at') DateTime get updatedAt;@JsonKey(name: 'owner_profile') OwnerBusinessProfileModel? get ownerProfile;
/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserModelCopyWith<UserModel> get copyWith => _$UserModelCopyWithImpl<UserModel>(this as UserModel, _$identity);

  /// Serializes this UserModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserModel&&(identical(other.id, id) || other.id == id)&&(identical(other.mobileNumber, mobileNumber) || other.mobileNumber == mobileNumber)&&(identical(other.fullName, fullName) || other.fullName == fullName)&&(identical(other.email, email) || other.email == email)&&(identical(other.mobileVerified, mobileVerified) || other.mobileVerified == mobileVerified)&&(identical(other.emailVerified, emailVerified) || other.emailVerified == emailVerified)&&(identical(other.role, role) || other.role == role)&&(identical(other.status, status) || other.status == status)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.ownerProfile, ownerProfile) || other.ownerProfile == ownerProfile));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,mobileNumber,fullName,email,mobileVerified,emailVerified,role,status,createdAt,updatedAt,ownerProfile);

@override
String toString() {
  return 'UserModel(id: $id, mobileNumber: $mobileNumber, fullName: $fullName, email: $email, mobileVerified: $mobileVerified, emailVerified: $emailVerified, role: $role, status: $status, createdAt: $createdAt, updatedAt: $updatedAt, ownerProfile: $ownerProfile)';
}


}

/// @nodoc
abstract mixin class $UserModelCopyWith<$Res>  {
  factory $UserModelCopyWith(UserModel value, $Res Function(UserModel) _then) = _$UserModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'mobile_number') String mobileNumber,@JsonKey(name: 'full_name') String fullName, String email,@JsonKey(name: 'mobile_verified') bool mobileVerified,@JsonKey(name: 'email_verified') bool emailVerified, UserRole role, String status,@JsonKey(name: 'created_at') DateTime createdAt,@JsonKey(name: 'updated_at') DateTime updatedAt,@JsonKey(name: 'owner_profile') OwnerBusinessProfileModel? ownerProfile
});


$OwnerBusinessProfileModelCopyWith<$Res>? get ownerProfile;

}
/// @nodoc
class _$UserModelCopyWithImpl<$Res>
    implements $UserModelCopyWith<$Res> {
  _$UserModelCopyWithImpl(this._self, this._then);

  final UserModel _self;
  final $Res Function(UserModel) _then;

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? mobileNumber = null,Object? fullName = null,Object? email = null,Object? mobileVerified = null,Object? emailVerified = null,Object? role = null,Object? status = null,Object? createdAt = null,Object? updatedAt = null,Object? ownerProfile = freezed,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,mobileNumber: null == mobileNumber ? _self.mobileNumber : mobileNumber // ignore: cast_nullable_to_non_nullable
as String,fullName: null == fullName ? _self.fullName : fullName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,mobileVerified: null == mobileVerified ? _self.mobileVerified : mobileVerified // ignore: cast_nullable_to_non_nullable
as bool,emailVerified: null == emailVerified ? _self.emailVerified : emailVerified // ignore: cast_nullable_to_non_nullable
as bool,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as UserRole,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,ownerProfile: freezed == ownerProfile ? _self.ownerProfile : ownerProfile // ignore: cast_nullable_to_non_nullable
as OwnerBusinessProfileModel?,
  ));
}
/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OwnerBusinessProfileModelCopyWith<$Res>? get ownerProfile {
    if (_self.ownerProfile == null) {
    return null;
  }

  return $OwnerBusinessProfileModelCopyWith<$Res>(_self.ownerProfile!, (value) {
    return _then(_self.copyWith(ownerProfile: value));
  });
}
}


/// Adds pattern-matching-related methods to [UserModel].
extension UserModelPatterns on UserModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UserModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UserModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UserModel value)  $default,){
final _that = this;
switch (_that) {
case _UserModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UserModel value)?  $default,){
final _that = this;
switch (_that) {
case _UserModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'mobile_number')  String mobileNumber, @JsonKey(name: 'full_name')  String fullName,  String email, @JsonKey(name: 'mobile_verified')  bool mobileVerified, @JsonKey(name: 'email_verified')  bool emailVerified,  UserRole role,  String status, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt, @JsonKey(name: 'owner_profile')  OwnerBusinessProfileModel? ownerProfile)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UserModel() when $default != null:
return $default(_that.id,_that.mobileNumber,_that.fullName,_that.email,_that.mobileVerified,_that.emailVerified,_that.role,_that.status,_that.createdAt,_that.updatedAt,_that.ownerProfile);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'mobile_number')  String mobileNumber, @JsonKey(name: 'full_name')  String fullName,  String email, @JsonKey(name: 'mobile_verified')  bool mobileVerified, @JsonKey(name: 'email_verified')  bool emailVerified,  UserRole role,  String status, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt, @JsonKey(name: 'owner_profile')  OwnerBusinessProfileModel? ownerProfile)  $default,) {final _that = this;
switch (_that) {
case _UserModel():
return $default(_that.id,_that.mobileNumber,_that.fullName,_that.email,_that.mobileVerified,_that.emailVerified,_that.role,_that.status,_that.createdAt,_that.updatedAt,_that.ownerProfile);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'mobile_number')  String mobileNumber, @JsonKey(name: 'full_name')  String fullName,  String email, @JsonKey(name: 'mobile_verified')  bool mobileVerified, @JsonKey(name: 'email_verified')  bool emailVerified,  UserRole role,  String status, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt, @JsonKey(name: 'owner_profile')  OwnerBusinessProfileModel? ownerProfile)?  $default,) {final _that = this;
switch (_that) {
case _UserModel() when $default != null:
return $default(_that.id,_that.mobileNumber,_that.fullName,_that.email,_that.mobileVerified,_that.emailVerified,_that.role,_that.status,_that.createdAt,_that.updatedAt,_that.ownerProfile);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _UserModel implements UserModel {
  const _UserModel({required this.id, @JsonKey(name: 'mobile_number') required this.mobileNumber, @JsonKey(name: 'full_name') required this.fullName, required this.email, @JsonKey(name: 'mobile_verified') required this.mobileVerified, @JsonKey(name: 'email_verified') required this.emailVerified, required this.role, required this.status, @JsonKey(name: 'created_at') required this.createdAt, @JsonKey(name: 'updated_at') required this.updatedAt, @JsonKey(name: 'owner_profile') this.ownerProfile});
  factory _UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'mobile_number') final  String mobileNumber;
@override@JsonKey(name: 'full_name') final  String fullName;
@override final  String email;
@override@JsonKey(name: 'mobile_verified') final  bool mobileVerified;
@override@JsonKey(name: 'email_verified') final  bool emailVerified;
@override final  UserRole role;
@override final  String status;
@override@JsonKey(name: 'created_at') final  DateTime createdAt;
@override@JsonKey(name: 'updated_at') final  DateTime updatedAt;
@override@JsonKey(name: 'owner_profile') final  OwnerBusinessProfileModel? ownerProfile;

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UserModelCopyWith<_UserModel> get copyWith => __$UserModelCopyWithImpl<_UserModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UserModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _UserModel&&(identical(other.id, id) || other.id == id)&&(identical(other.mobileNumber, mobileNumber) || other.mobileNumber == mobileNumber)&&(identical(other.fullName, fullName) || other.fullName == fullName)&&(identical(other.email, email) || other.email == email)&&(identical(other.mobileVerified, mobileVerified) || other.mobileVerified == mobileVerified)&&(identical(other.emailVerified, emailVerified) || other.emailVerified == emailVerified)&&(identical(other.role, role) || other.role == role)&&(identical(other.status, status) || other.status == status)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.ownerProfile, ownerProfile) || other.ownerProfile == ownerProfile));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,mobileNumber,fullName,email,mobileVerified,emailVerified,role,status,createdAt,updatedAt,ownerProfile);

@override
String toString() {
  return 'UserModel(id: $id, mobileNumber: $mobileNumber, fullName: $fullName, email: $email, mobileVerified: $mobileVerified, emailVerified: $emailVerified, role: $role, status: $status, createdAt: $createdAt, updatedAt: $updatedAt, ownerProfile: $ownerProfile)';
}


}

/// @nodoc
abstract mixin class _$UserModelCopyWith<$Res> implements $UserModelCopyWith<$Res> {
  factory _$UserModelCopyWith(_UserModel value, $Res Function(_UserModel) _then) = __$UserModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'mobile_number') String mobileNumber,@JsonKey(name: 'full_name') String fullName, String email,@JsonKey(name: 'mobile_verified') bool mobileVerified,@JsonKey(name: 'email_verified') bool emailVerified, UserRole role, String status,@JsonKey(name: 'created_at') DateTime createdAt,@JsonKey(name: 'updated_at') DateTime updatedAt,@JsonKey(name: 'owner_profile') OwnerBusinessProfileModel? ownerProfile
});


@override $OwnerBusinessProfileModelCopyWith<$Res>? get ownerProfile;

}
/// @nodoc
class __$UserModelCopyWithImpl<$Res>
    implements _$UserModelCopyWith<$Res> {
  __$UserModelCopyWithImpl(this._self, this._then);

  final _UserModel _self;
  final $Res Function(_UserModel) _then;

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? mobileNumber = null,Object? fullName = null,Object? email = null,Object? mobileVerified = null,Object? emailVerified = null,Object? role = null,Object? status = null,Object? createdAt = null,Object? updatedAt = null,Object? ownerProfile = freezed,}) {
  return _then(_UserModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,mobileNumber: null == mobileNumber ? _self.mobileNumber : mobileNumber // ignore: cast_nullable_to_non_nullable
as String,fullName: null == fullName ? _self.fullName : fullName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,mobileVerified: null == mobileVerified ? _self.mobileVerified : mobileVerified // ignore: cast_nullable_to_non_nullable
as bool,emailVerified: null == emailVerified ? _self.emailVerified : emailVerified // ignore: cast_nullable_to_non_nullable
as bool,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as UserRole,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,ownerProfile: freezed == ownerProfile ? _self.ownerProfile : ownerProfile // ignore: cast_nullable_to_non_nullable
as OwnerBusinessProfileModel?,
  ));
}

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OwnerBusinessProfileModelCopyWith<$Res>? get ownerProfile {
    if (_self.ownerProfile == null) {
    return null;
  }

  return $OwnerBusinessProfileModelCopyWith<$Res>(_self.ownerProfile!, (value) {
    return _then(_self.copyWith(ownerProfile: value));
  });
}
}


/// @nodoc
mixin _$OwnerBusinessProfileModel {

 String get id;@JsonKey(name: 'user_id') String get userId;@JsonKey(name: 'business_name') String get businessName;@JsonKey(name: 'approval_status') ApprovalStatus get approvalStatus;@JsonKey(name: 'created_at') DateTime get createdAt;@JsonKey(name: 'updated_at') DateTime get updatedAt;
/// Create a copy of OwnerBusinessProfileModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OwnerBusinessProfileModelCopyWith<OwnerBusinessProfileModel> get copyWith => _$OwnerBusinessProfileModelCopyWithImpl<OwnerBusinessProfileModel>(this as OwnerBusinessProfileModel, _$identity);

  /// Serializes this OwnerBusinessProfileModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OwnerBusinessProfileModel&&(identical(other.id, id) || other.id == id)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.businessName, businessName) || other.businessName == businessName)&&(identical(other.approvalStatus, approvalStatus) || other.approvalStatus == approvalStatus)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,userId,businessName,approvalStatus,createdAt,updatedAt);

@override
String toString() {
  return 'OwnerBusinessProfileModel(id: $id, userId: $userId, businessName: $businessName, approvalStatus: $approvalStatus, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $OwnerBusinessProfileModelCopyWith<$Res>  {
  factory $OwnerBusinessProfileModelCopyWith(OwnerBusinessProfileModel value, $Res Function(OwnerBusinessProfileModel) _then) = _$OwnerBusinessProfileModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'user_id') String userId,@JsonKey(name: 'business_name') String businessName,@JsonKey(name: 'approval_status') ApprovalStatus approvalStatus,@JsonKey(name: 'created_at') DateTime createdAt,@JsonKey(name: 'updated_at') DateTime updatedAt
});




}
/// @nodoc
class _$OwnerBusinessProfileModelCopyWithImpl<$Res>
    implements $OwnerBusinessProfileModelCopyWith<$Res> {
  _$OwnerBusinessProfileModelCopyWithImpl(this._self, this._then);

  final OwnerBusinessProfileModel _self;
  final $Res Function(OwnerBusinessProfileModel) _then;

/// Create a copy of OwnerBusinessProfileModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? userId = null,Object? businessName = null,Object? approvalStatus = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,businessName: null == businessName ? _self.businessName : businessName // ignore: cast_nullable_to_non_nullable
as String,approvalStatus: null == approvalStatus ? _self.approvalStatus : approvalStatus // ignore: cast_nullable_to_non_nullable
as ApprovalStatus,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [OwnerBusinessProfileModel].
extension OwnerBusinessProfileModelPatterns on OwnerBusinessProfileModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OwnerBusinessProfileModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OwnerBusinessProfileModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OwnerBusinessProfileModel value)  $default,){
final _that = this;
switch (_that) {
case _OwnerBusinessProfileModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OwnerBusinessProfileModel value)?  $default,){
final _that = this;
switch (_that) {
case _OwnerBusinessProfileModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'user_id')  String userId, @JsonKey(name: 'business_name')  String businessName, @JsonKey(name: 'approval_status')  ApprovalStatus approvalStatus, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OwnerBusinessProfileModel() when $default != null:
return $default(_that.id,_that.userId,_that.businessName,_that.approvalStatus,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'user_id')  String userId, @JsonKey(name: 'business_name')  String businessName, @JsonKey(name: 'approval_status')  ApprovalStatus approvalStatus, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _OwnerBusinessProfileModel():
return $default(_that.id,_that.userId,_that.businessName,_that.approvalStatus,_that.createdAt,_that.updatedAt);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'user_id')  String userId, @JsonKey(name: 'business_name')  String businessName, @JsonKey(name: 'approval_status')  ApprovalStatus approvalStatus, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _OwnerBusinessProfileModel() when $default != null:
return $default(_that.id,_that.userId,_that.businessName,_that.approvalStatus,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OwnerBusinessProfileModel implements OwnerBusinessProfileModel {
  const _OwnerBusinessProfileModel({required this.id, @JsonKey(name: 'user_id') required this.userId, @JsonKey(name: 'business_name') required this.businessName, @JsonKey(name: 'approval_status') required this.approvalStatus, @JsonKey(name: 'created_at') required this.createdAt, @JsonKey(name: 'updated_at') required this.updatedAt});
  factory _OwnerBusinessProfileModel.fromJson(Map<String, dynamic> json) => _$OwnerBusinessProfileModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'user_id') final  String userId;
@override@JsonKey(name: 'business_name') final  String businessName;
@override@JsonKey(name: 'approval_status') final  ApprovalStatus approvalStatus;
@override@JsonKey(name: 'created_at') final  DateTime createdAt;
@override@JsonKey(name: 'updated_at') final  DateTime updatedAt;

/// Create a copy of OwnerBusinessProfileModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OwnerBusinessProfileModelCopyWith<_OwnerBusinessProfileModel> get copyWith => __$OwnerBusinessProfileModelCopyWithImpl<_OwnerBusinessProfileModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OwnerBusinessProfileModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _OwnerBusinessProfileModel&&(identical(other.id, id) || other.id == id)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.businessName, businessName) || other.businessName == businessName)&&(identical(other.approvalStatus, approvalStatus) || other.approvalStatus == approvalStatus)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,userId,businessName,approvalStatus,createdAt,updatedAt);

@override
String toString() {
  return 'OwnerBusinessProfileModel(id: $id, userId: $userId, businessName: $businessName, approvalStatus: $approvalStatus, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$OwnerBusinessProfileModelCopyWith<$Res> implements $OwnerBusinessProfileModelCopyWith<$Res> {
  factory _$OwnerBusinessProfileModelCopyWith(_OwnerBusinessProfileModel value, $Res Function(_OwnerBusinessProfileModel) _then) = __$OwnerBusinessProfileModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'user_id') String userId,@JsonKey(name: 'business_name') String businessName,@JsonKey(name: 'approval_status') ApprovalStatus approvalStatus,@JsonKey(name: 'created_at') DateTime createdAt,@JsonKey(name: 'updated_at') DateTime updatedAt
});




}
/// @nodoc
class __$OwnerBusinessProfileModelCopyWithImpl<$Res>
    implements _$OwnerBusinessProfileModelCopyWith<$Res> {
  __$OwnerBusinessProfileModelCopyWithImpl(this._self, this._then);

  final _OwnerBusinessProfileModel _self;
  final $Res Function(_OwnerBusinessProfileModel) _then;

/// Create a copy of OwnerBusinessProfileModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? userId = null,Object? businessName = null,Object? approvalStatus = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_OwnerBusinessProfileModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,businessName: null == businessName ? _self.businessName : businessName // ignore: cast_nullable_to_non_nullable
as String,approvalStatus: null == approvalStatus ? _self.approvalStatus : approvalStatus // ignore: cast_nullable_to_non_nullable
as ApprovalStatus,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
