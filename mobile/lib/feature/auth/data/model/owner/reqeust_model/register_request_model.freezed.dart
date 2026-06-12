// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'register_request_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OwnerRegisterRequest {

@JsonKey(name: 'full_name') String get fullName;@JsonKey(name: 'business_name') String get businessName; String get email;@JsonKey(name: 'mobile_number') String get mobileNumber; String get password;
/// Create a copy of OwnerRegisterRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OwnerRegisterRequestCopyWith<OwnerRegisterRequest> get copyWith => _$OwnerRegisterRequestCopyWithImpl<OwnerRegisterRequest>(this as OwnerRegisterRequest, _$identity);

  /// Serializes this OwnerRegisterRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OwnerRegisterRequest&&(identical(other.fullName, fullName) || other.fullName == fullName)&&(identical(other.businessName, businessName) || other.businessName == businessName)&&(identical(other.email, email) || other.email == email)&&(identical(other.mobileNumber, mobileNumber) || other.mobileNumber == mobileNumber)&&(identical(other.password, password) || other.password == password));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,fullName,businessName,email,mobileNumber,password);

@override
String toString() {
  return 'OwnerRegisterRequest(fullName: $fullName, businessName: $businessName, email: $email, mobileNumber: $mobileNumber, password: $password)';
}


}

/// @nodoc
abstract mixin class $OwnerRegisterRequestCopyWith<$Res>  {
  factory $OwnerRegisterRequestCopyWith(OwnerRegisterRequest value, $Res Function(OwnerRegisterRequest) _then) = _$OwnerRegisterRequestCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'full_name') String fullName,@JsonKey(name: 'business_name') String businessName, String email,@JsonKey(name: 'mobile_number') String mobileNumber, String password
});




}
/// @nodoc
class _$OwnerRegisterRequestCopyWithImpl<$Res>
    implements $OwnerRegisterRequestCopyWith<$Res> {
  _$OwnerRegisterRequestCopyWithImpl(this._self, this._then);

  final OwnerRegisterRequest _self;
  final $Res Function(OwnerRegisterRequest) _then;

/// Create a copy of OwnerRegisterRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? fullName = null,Object? businessName = null,Object? email = null,Object? mobileNumber = null,Object? password = null,}) {
  return _then(_self.copyWith(
fullName: null == fullName ? _self.fullName : fullName // ignore: cast_nullable_to_non_nullable
as String,businessName: null == businessName ? _self.businessName : businessName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,mobileNumber: null == mobileNumber ? _self.mobileNumber : mobileNumber // ignore: cast_nullable_to_non_nullable
as String,password: null == password ? _self.password : password // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [OwnerRegisterRequest].
extension OwnerRegisterRequestPatterns on OwnerRegisterRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OwnerRegisterRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OwnerRegisterRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OwnerRegisterRequest value)  $default,){
final _that = this;
switch (_that) {
case _OwnerRegisterRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OwnerRegisterRequest value)?  $default,){
final _that = this;
switch (_that) {
case _OwnerRegisterRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'full_name')  String fullName, @JsonKey(name: 'business_name')  String businessName,  String email, @JsonKey(name: 'mobile_number')  String mobileNumber,  String password)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OwnerRegisterRequest() when $default != null:
return $default(_that.fullName,_that.businessName,_that.email,_that.mobileNumber,_that.password);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'full_name')  String fullName, @JsonKey(name: 'business_name')  String businessName,  String email, @JsonKey(name: 'mobile_number')  String mobileNumber,  String password)  $default,) {final _that = this;
switch (_that) {
case _OwnerRegisterRequest():
return $default(_that.fullName,_that.businessName,_that.email,_that.mobileNumber,_that.password);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'full_name')  String fullName, @JsonKey(name: 'business_name')  String businessName,  String email, @JsonKey(name: 'mobile_number')  String mobileNumber,  String password)?  $default,) {final _that = this;
switch (_that) {
case _OwnerRegisterRequest() when $default != null:
return $default(_that.fullName,_that.businessName,_that.email,_that.mobileNumber,_that.password);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OwnerRegisterRequest implements OwnerRegisterRequest {
  const _OwnerRegisterRequest({@JsonKey(name: 'full_name') required this.fullName, @JsonKey(name: 'business_name') required this.businessName, required this.email, @JsonKey(name: 'mobile_number') required this.mobileNumber, required this.password});
  factory _OwnerRegisterRequest.fromJson(Map<String, dynamic> json) => _$OwnerRegisterRequestFromJson(json);

@override@JsonKey(name: 'full_name') final  String fullName;
@override@JsonKey(name: 'business_name') final  String businessName;
@override final  String email;
@override@JsonKey(name: 'mobile_number') final  String mobileNumber;
@override final  String password;

/// Create a copy of OwnerRegisterRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OwnerRegisterRequestCopyWith<_OwnerRegisterRequest> get copyWith => __$OwnerRegisterRequestCopyWithImpl<_OwnerRegisterRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OwnerRegisterRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _OwnerRegisterRequest&&(identical(other.fullName, fullName) || other.fullName == fullName)&&(identical(other.businessName, businessName) || other.businessName == businessName)&&(identical(other.email, email) || other.email == email)&&(identical(other.mobileNumber, mobileNumber) || other.mobileNumber == mobileNumber)&&(identical(other.password, password) || other.password == password));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,fullName,businessName,email,mobileNumber,password);

@override
String toString() {
  return 'OwnerRegisterRequest(fullName: $fullName, businessName: $businessName, email: $email, mobileNumber: $mobileNumber, password: $password)';
}


}

/// @nodoc
abstract mixin class _$OwnerRegisterRequestCopyWith<$Res> implements $OwnerRegisterRequestCopyWith<$Res> {
  factory _$OwnerRegisterRequestCopyWith(_OwnerRegisterRequest value, $Res Function(_OwnerRegisterRequest) _then) = __$OwnerRegisterRequestCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'full_name') String fullName,@JsonKey(name: 'business_name') String businessName, String email,@JsonKey(name: 'mobile_number') String mobileNumber, String password
});




}
/// @nodoc
class __$OwnerRegisterRequestCopyWithImpl<$Res>
    implements _$OwnerRegisterRequestCopyWith<$Res> {
  __$OwnerRegisterRequestCopyWithImpl(this._self, this._then);

  final _OwnerRegisterRequest _self;
  final $Res Function(_OwnerRegisterRequest) _then;

/// Create a copy of OwnerRegisterRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? fullName = null,Object? businessName = null,Object? email = null,Object? mobileNumber = null,Object? password = null,}) {
  return _then(_OwnerRegisterRequest(
fullName: null == fullName ? _self.fullName : fullName // ignore: cast_nullable_to_non_nullable
as String,businessName: null == businessName ? _self.businessName : businessName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,mobileNumber: null == mobileNumber ? _self.mobileNumber : mobileNumber // ignore: cast_nullable_to_non_nullable
as String,password: null == password ? _self.password : password // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$VerifyOwnerOtpRequest {

@JsonKey(name: 'mobile_number') String get mobileNumber; String get otp;
/// Create a copy of VerifyOwnerOtpRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$VerifyOwnerOtpRequestCopyWith<VerifyOwnerOtpRequest> get copyWith => _$VerifyOwnerOtpRequestCopyWithImpl<VerifyOwnerOtpRequest>(this as VerifyOwnerOtpRequest, _$identity);

  /// Serializes this VerifyOwnerOtpRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is VerifyOwnerOtpRequest&&(identical(other.mobileNumber, mobileNumber) || other.mobileNumber == mobileNumber)&&(identical(other.otp, otp) || other.otp == otp));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,mobileNumber,otp);

@override
String toString() {
  return 'VerifyOwnerOtpRequest(mobileNumber: $mobileNumber, otp: $otp)';
}


}

/// @nodoc
abstract mixin class $VerifyOwnerOtpRequestCopyWith<$Res>  {
  factory $VerifyOwnerOtpRequestCopyWith(VerifyOwnerOtpRequest value, $Res Function(VerifyOwnerOtpRequest) _then) = _$VerifyOwnerOtpRequestCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'mobile_number') String mobileNumber, String otp
});




}
/// @nodoc
class _$VerifyOwnerOtpRequestCopyWithImpl<$Res>
    implements $VerifyOwnerOtpRequestCopyWith<$Res> {
  _$VerifyOwnerOtpRequestCopyWithImpl(this._self, this._then);

  final VerifyOwnerOtpRequest _self;
  final $Res Function(VerifyOwnerOtpRequest) _then;

/// Create a copy of VerifyOwnerOtpRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? mobileNumber = null,Object? otp = null,}) {
  return _then(_self.copyWith(
mobileNumber: null == mobileNumber ? _self.mobileNumber : mobileNumber // ignore: cast_nullable_to_non_nullable
as String,otp: null == otp ? _self.otp : otp // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [VerifyOwnerOtpRequest].
extension VerifyOwnerOtpRequestPatterns on VerifyOwnerOtpRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _VerifyOwnerOtpRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _VerifyOwnerOtpRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _VerifyOwnerOtpRequest value)  $default,){
final _that = this;
switch (_that) {
case _VerifyOwnerOtpRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _VerifyOwnerOtpRequest value)?  $default,){
final _that = this;
switch (_that) {
case _VerifyOwnerOtpRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'mobile_number')  String mobileNumber,  String otp)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _VerifyOwnerOtpRequest() when $default != null:
return $default(_that.mobileNumber,_that.otp);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'mobile_number')  String mobileNumber,  String otp)  $default,) {final _that = this;
switch (_that) {
case _VerifyOwnerOtpRequest():
return $default(_that.mobileNumber,_that.otp);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'mobile_number')  String mobileNumber,  String otp)?  $default,) {final _that = this;
switch (_that) {
case _VerifyOwnerOtpRequest() when $default != null:
return $default(_that.mobileNumber,_that.otp);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _VerifyOwnerOtpRequest implements VerifyOwnerOtpRequest {
  const _VerifyOwnerOtpRequest({@JsonKey(name: 'mobile_number') required this.mobileNumber, required this.otp});
  factory _VerifyOwnerOtpRequest.fromJson(Map<String, dynamic> json) => _$VerifyOwnerOtpRequestFromJson(json);

@override@JsonKey(name: 'mobile_number') final  String mobileNumber;
@override final  String otp;

/// Create a copy of VerifyOwnerOtpRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VerifyOwnerOtpRequestCopyWith<_VerifyOwnerOtpRequest> get copyWith => __$VerifyOwnerOtpRequestCopyWithImpl<_VerifyOwnerOtpRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$VerifyOwnerOtpRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VerifyOwnerOtpRequest&&(identical(other.mobileNumber, mobileNumber) || other.mobileNumber == mobileNumber)&&(identical(other.otp, otp) || other.otp == otp));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,mobileNumber,otp);

@override
String toString() {
  return 'VerifyOwnerOtpRequest(mobileNumber: $mobileNumber, otp: $otp)';
}


}

/// @nodoc
abstract mixin class _$VerifyOwnerOtpRequestCopyWith<$Res> implements $VerifyOwnerOtpRequestCopyWith<$Res> {
  factory _$VerifyOwnerOtpRequestCopyWith(_VerifyOwnerOtpRequest value, $Res Function(_VerifyOwnerOtpRequest) _then) = __$VerifyOwnerOtpRequestCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'mobile_number') String mobileNumber, String otp
});




}
/// @nodoc
class __$VerifyOwnerOtpRequestCopyWithImpl<$Res>
    implements _$VerifyOwnerOtpRequestCopyWith<$Res> {
  __$VerifyOwnerOtpRequestCopyWithImpl(this._self, this._then);

  final _VerifyOwnerOtpRequest _self;
  final $Res Function(_VerifyOwnerOtpRequest) _then;

/// Create a copy of VerifyOwnerOtpRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? mobileNumber = null,Object? otp = null,}) {
  return _then(_VerifyOwnerOtpRequest(
mobileNumber: null == mobileNumber ? _self.mobileNumber : mobileNumber // ignore: cast_nullable_to_non_nullable
as String,otp: null == otp ? _self.otp : otp // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
