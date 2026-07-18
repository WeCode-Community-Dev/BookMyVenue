// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'owner_profile_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OwnerProfileModel {

 String get id;@JsonKey(name: 'mobile_number') String get mobileNumber;@JsonKey(name: 'full_name') String get fullName; String get email;@JsonKey(name: 'mobile_verified') bool get mobileVerified;@JsonKey(name: 'email_verified') bool get emailVerified; String get role; String get status;@JsonKey(name: 'created_at') DateTime get createdAt;@JsonKey(name: 'updated_at') DateTime get updatedAt;@JsonKey(name: 'owner_profile') OwnerDetailModel? get ownerProfile;
/// Create a copy of OwnerProfileModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OwnerProfileModelCopyWith<OwnerProfileModel> get copyWith => _$OwnerProfileModelCopyWithImpl<OwnerProfileModel>(this as OwnerProfileModel, _$identity);

  /// Serializes this OwnerProfileModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OwnerProfileModel&&(identical(other.id, id) || other.id == id)&&(identical(other.mobileNumber, mobileNumber) || other.mobileNumber == mobileNumber)&&(identical(other.fullName, fullName) || other.fullName == fullName)&&(identical(other.email, email) || other.email == email)&&(identical(other.mobileVerified, mobileVerified) || other.mobileVerified == mobileVerified)&&(identical(other.emailVerified, emailVerified) || other.emailVerified == emailVerified)&&(identical(other.role, role) || other.role == role)&&(identical(other.status, status) || other.status == status)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.ownerProfile, ownerProfile) || other.ownerProfile == ownerProfile));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,mobileNumber,fullName,email,mobileVerified,emailVerified,role,status,createdAt,updatedAt,ownerProfile);

@override
String toString() {
  return 'OwnerProfileModel(id: $id, mobileNumber: $mobileNumber, fullName: $fullName, email: $email, mobileVerified: $mobileVerified, emailVerified: $emailVerified, role: $role, status: $status, createdAt: $createdAt, updatedAt: $updatedAt, ownerProfile: $ownerProfile)';
}


}

/// @nodoc
abstract mixin class $OwnerProfileModelCopyWith<$Res>  {
  factory $OwnerProfileModelCopyWith(OwnerProfileModel value, $Res Function(OwnerProfileModel) _then) = _$OwnerProfileModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'mobile_number') String mobileNumber,@JsonKey(name: 'full_name') String fullName, String email,@JsonKey(name: 'mobile_verified') bool mobileVerified,@JsonKey(name: 'email_verified') bool emailVerified, String role, String status,@JsonKey(name: 'created_at') DateTime createdAt,@JsonKey(name: 'updated_at') DateTime updatedAt,@JsonKey(name: 'owner_profile') OwnerDetailModel? ownerProfile
});


$OwnerDetailModelCopyWith<$Res>? get ownerProfile;

}
/// @nodoc
class _$OwnerProfileModelCopyWithImpl<$Res>
    implements $OwnerProfileModelCopyWith<$Res> {
  _$OwnerProfileModelCopyWithImpl(this._self, this._then);

  final OwnerProfileModel _self;
  final $Res Function(OwnerProfileModel) _then;

/// Create a copy of OwnerProfileModel
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
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,ownerProfile: freezed == ownerProfile ? _self.ownerProfile : ownerProfile // ignore: cast_nullable_to_non_nullable
as OwnerDetailModel?,
  ));
}
/// Create a copy of OwnerProfileModel
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OwnerDetailModelCopyWith<$Res>? get ownerProfile {
    if (_self.ownerProfile == null) {
    return null;
  }

  return $OwnerDetailModelCopyWith<$Res>(_self.ownerProfile!, (value) {
    return _then(_self.copyWith(ownerProfile: value));
  });
}
}


/// Adds pattern-matching-related methods to [OwnerProfileModel].
extension OwnerProfileModelPatterns on OwnerProfileModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OwnerProfileModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OwnerProfileModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OwnerProfileModel value)  $default,){
final _that = this;
switch (_that) {
case _OwnerProfileModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OwnerProfileModel value)?  $default,){
final _that = this;
switch (_that) {
case _OwnerProfileModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'mobile_number')  String mobileNumber, @JsonKey(name: 'full_name')  String fullName,  String email, @JsonKey(name: 'mobile_verified')  bool mobileVerified, @JsonKey(name: 'email_verified')  bool emailVerified,  String role,  String status, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt, @JsonKey(name: 'owner_profile')  OwnerDetailModel? ownerProfile)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OwnerProfileModel() when $default != null:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'mobile_number')  String mobileNumber, @JsonKey(name: 'full_name')  String fullName,  String email, @JsonKey(name: 'mobile_verified')  bool mobileVerified, @JsonKey(name: 'email_verified')  bool emailVerified,  String role,  String status, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt, @JsonKey(name: 'owner_profile')  OwnerDetailModel? ownerProfile)  $default,) {final _that = this;
switch (_that) {
case _OwnerProfileModel():
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'mobile_number')  String mobileNumber, @JsonKey(name: 'full_name')  String fullName,  String email, @JsonKey(name: 'mobile_verified')  bool mobileVerified, @JsonKey(name: 'email_verified')  bool emailVerified,  String role,  String status, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt, @JsonKey(name: 'owner_profile')  OwnerDetailModel? ownerProfile)?  $default,) {final _that = this;
switch (_that) {
case _OwnerProfileModel() when $default != null:
return $default(_that.id,_that.mobileNumber,_that.fullName,_that.email,_that.mobileVerified,_that.emailVerified,_that.role,_that.status,_that.createdAt,_that.updatedAt,_that.ownerProfile);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OwnerProfileModel implements OwnerProfileModel {
  const _OwnerProfileModel({required this.id, @JsonKey(name: 'mobile_number') required this.mobileNumber, @JsonKey(name: 'full_name') required this.fullName, required this.email, @JsonKey(name: 'mobile_verified') required this.mobileVerified, @JsonKey(name: 'email_verified') required this.emailVerified, required this.role, required this.status, @JsonKey(name: 'created_at') required this.createdAt, @JsonKey(name: 'updated_at') required this.updatedAt, @JsonKey(name: 'owner_profile') this.ownerProfile});
  factory _OwnerProfileModel.fromJson(Map<String, dynamic> json) => _$OwnerProfileModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'mobile_number') final  String mobileNumber;
@override@JsonKey(name: 'full_name') final  String fullName;
@override final  String email;
@override@JsonKey(name: 'mobile_verified') final  bool mobileVerified;
@override@JsonKey(name: 'email_verified') final  bool emailVerified;
@override final  String role;
@override final  String status;
@override@JsonKey(name: 'created_at') final  DateTime createdAt;
@override@JsonKey(name: 'updated_at') final  DateTime updatedAt;
@override@JsonKey(name: 'owner_profile') final  OwnerDetailModel? ownerProfile;

/// Create a copy of OwnerProfileModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OwnerProfileModelCopyWith<_OwnerProfileModel> get copyWith => __$OwnerProfileModelCopyWithImpl<_OwnerProfileModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OwnerProfileModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _OwnerProfileModel&&(identical(other.id, id) || other.id == id)&&(identical(other.mobileNumber, mobileNumber) || other.mobileNumber == mobileNumber)&&(identical(other.fullName, fullName) || other.fullName == fullName)&&(identical(other.email, email) || other.email == email)&&(identical(other.mobileVerified, mobileVerified) || other.mobileVerified == mobileVerified)&&(identical(other.emailVerified, emailVerified) || other.emailVerified == emailVerified)&&(identical(other.role, role) || other.role == role)&&(identical(other.status, status) || other.status == status)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.ownerProfile, ownerProfile) || other.ownerProfile == ownerProfile));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,mobileNumber,fullName,email,mobileVerified,emailVerified,role,status,createdAt,updatedAt,ownerProfile);

@override
String toString() {
  return 'OwnerProfileModel(id: $id, mobileNumber: $mobileNumber, fullName: $fullName, email: $email, mobileVerified: $mobileVerified, emailVerified: $emailVerified, role: $role, status: $status, createdAt: $createdAt, updatedAt: $updatedAt, ownerProfile: $ownerProfile)';
}


}

/// @nodoc
abstract mixin class _$OwnerProfileModelCopyWith<$Res> implements $OwnerProfileModelCopyWith<$Res> {
  factory _$OwnerProfileModelCopyWith(_OwnerProfileModel value, $Res Function(_OwnerProfileModel) _then) = __$OwnerProfileModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'mobile_number') String mobileNumber,@JsonKey(name: 'full_name') String fullName, String email,@JsonKey(name: 'mobile_verified') bool mobileVerified,@JsonKey(name: 'email_verified') bool emailVerified, String role, String status,@JsonKey(name: 'created_at') DateTime createdAt,@JsonKey(name: 'updated_at') DateTime updatedAt,@JsonKey(name: 'owner_profile') OwnerDetailModel? ownerProfile
});


@override $OwnerDetailModelCopyWith<$Res>? get ownerProfile;

}
/// @nodoc
class __$OwnerProfileModelCopyWithImpl<$Res>
    implements _$OwnerProfileModelCopyWith<$Res> {
  __$OwnerProfileModelCopyWithImpl(this._self, this._then);

  final _OwnerProfileModel _self;
  final $Res Function(_OwnerProfileModel) _then;

/// Create a copy of OwnerProfileModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? mobileNumber = null,Object? fullName = null,Object? email = null,Object? mobileVerified = null,Object? emailVerified = null,Object? role = null,Object? status = null,Object? createdAt = null,Object? updatedAt = null,Object? ownerProfile = freezed,}) {
  return _then(_OwnerProfileModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,mobileNumber: null == mobileNumber ? _self.mobileNumber : mobileNumber // ignore: cast_nullable_to_non_nullable
as String,fullName: null == fullName ? _self.fullName : fullName // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,mobileVerified: null == mobileVerified ? _self.mobileVerified : mobileVerified // ignore: cast_nullable_to_non_nullable
as bool,emailVerified: null == emailVerified ? _self.emailVerified : emailVerified // ignore: cast_nullable_to_non_nullable
as bool,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,ownerProfile: freezed == ownerProfile ? _self.ownerProfile : ownerProfile // ignore: cast_nullable_to_non_nullable
as OwnerDetailModel?,
  ));
}

/// Create a copy of OwnerProfileModel
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$OwnerDetailModelCopyWith<$Res>? get ownerProfile {
    if (_self.ownerProfile == null) {
    return null;
  }

  return $OwnerDetailModelCopyWith<$Res>(_self.ownerProfile!, (value) {
    return _then(_self.copyWith(ownerProfile: value));
  });
}
}


/// @nodoc
mixin _$OwnerDetailModel {

 String get id;@JsonKey(name: 'user_id') String get userId;@JsonKey(name: 'business_name') String get businessName;@JsonKey(name: 'approval_status') String get approvalStatus;@JsonKey(name: 'created_at') DateTime get createdAt;@JsonKey(name: 'updated_at') DateTime get updatedAt;
/// Create a copy of OwnerDetailModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OwnerDetailModelCopyWith<OwnerDetailModel> get copyWith => _$OwnerDetailModelCopyWithImpl<OwnerDetailModel>(this as OwnerDetailModel, _$identity);

  /// Serializes this OwnerDetailModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OwnerDetailModel&&(identical(other.id, id) || other.id == id)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.businessName, businessName) || other.businessName == businessName)&&(identical(other.approvalStatus, approvalStatus) || other.approvalStatus == approvalStatus)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,userId,businessName,approvalStatus,createdAt,updatedAt);

@override
String toString() {
  return 'OwnerDetailModel(id: $id, userId: $userId, businessName: $businessName, approvalStatus: $approvalStatus, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $OwnerDetailModelCopyWith<$Res>  {
  factory $OwnerDetailModelCopyWith(OwnerDetailModel value, $Res Function(OwnerDetailModel) _then) = _$OwnerDetailModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'user_id') String userId,@JsonKey(name: 'business_name') String businessName,@JsonKey(name: 'approval_status') String approvalStatus,@JsonKey(name: 'created_at') DateTime createdAt,@JsonKey(name: 'updated_at') DateTime updatedAt
});




}
/// @nodoc
class _$OwnerDetailModelCopyWithImpl<$Res>
    implements $OwnerDetailModelCopyWith<$Res> {
  _$OwnerDetailModelCopyWithImpl(this._self, this._then);

  final OwnerDetailModel _self;
  final $Res Function(OwnerDetailModel) _then;

/// Create a copy of OwnerDetailModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? userId = null,Object? businessName = null,Object? approvalStatus = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,businessName: null == businessName ? _self.businessName : businessName // ignore: cast_nullable_to_non_nullable
as String,approvalStatus: null == approvalStatus ? _self.approvalStatus : approvalStatus // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [OwnerDetailModel].
extension OwnerDetailModelPatterns on OwnerDetailModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OwnerDetailModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OwnerDetailModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OwnerDetailModel value)  $default,){
final _that = this;
switch (_that) {
case _OwnerDetailModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OwnerDetailModel value)?  $default,){
final _that = this;
switch (_that) {
case _OwnerDetailModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'user_id')  String userId, @JsonKey(name: 'business_name')  String businessName, @JsonKey(name: 'approval_status')  String approvalStatus, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OwnerDetailModel() when $default != null:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'user_id')  String userId, @JsonKey(name: 'business_name')  String businessName, @JsonKey(name: 'approval_status')  String approvalStatus, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _OwnerDetailModel():
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'user_id')  String userId, @JsonKey(name: 'business_name')  String businessName, @JsonKey(name: 'approval_status')  String approvalStatus, @JsonKey(name: 'created_at')  DateTime createdAt, @JsonKey(name: 'updated_at')  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _OwnerDetailModel() when $default != null:
return $default(_that.id,_that.userId,_that.businessName,_that.approvalStatus,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OwnerDetailModel implements OwnerDetailModel {
  const _OwnerDetailModel({required this.id, @JsonKey(name: 'user_id') required this.userId, @JsonKey(name: 'business_name') required this.businessName, @JsonKey(name: 'approval_status') required this.approvalStatus, @JsonKey(name: 'created_at') required this.createdAt, @JsonKey(name: 'updated_at') required this.updatedAt});
  factory _OwnerDetailModel.fromJson(Map<String, dynamic> json) => _$OwnerDetailModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'user_id') final  String userId;
@override@JsonKey(name: 'business_name') final  String businessName;
@override@JsonKey(name: 'approval_status') final  String approvalStatus;
@override@JsonKey(name: 'created_at') final  DateTime createdAt;
@override@JsonKey(name: 'updated_at') final  DateTime updatedAt;

/// Create a copy of OwnerDetailModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OwnerDetailModelCopyWith<_OwnerDetailModel> get copyWith => __$OwnerDetailModelCopyWithImpl<_OwnerDetailModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OwnerDetailModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _OwnerDetailModel&&(identical(other.id, id) || other.id == id)&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.businessName, businessName) || other.businessName == businessName)&&(identical(other.approvalStatus, approvalStatus) || other.approvalStatus == approvalStatus)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,userId,businessName,approvalStatus,createdAt,updatedAt);

@override
String toString() {
  return 'OwnerDetailModel(id: $id, userId: $userId, businessName: $businessName, approvalStatus: $approvalStatus, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$OwnerDetailModelCopyWith<$Res> implements $OwnerDetailModelCopyWith<$Res> {
  factory _$OwnerDetailModelCopyWith(_OwnerDetailModel value, $Res Function(_OwnerDetailModel) _then) = __$OwnerDetailModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'user_id') String userId,@JsonKey(name: 'business_name') String businessName,@JsonKey(name: 'approval_status') String approvalStatus,@JsonKey(name: 'created_at') DateTime createdAt,@JsonKey(name: 'updated_at') DateTime updatedAt
});




}
/// @nodoc
class __$OwnerDetailModelCopyWithImpl<$Res>
    implements _$OwnerDetailModelCopyWith<$Res> {
  __$OwnerDetailModelCopyWithImpl(this._self, this._then);

  final _OwnerDetailModel _self;
  final $Res Function(_OwnerDetailModel) _then;

/// Create a copy of OwnerDetailModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? userId = null,Object? businessName = null,Object? approvalStatus = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_OwnerDetailModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as String,businessName: null == businessName ? _self.businessName : businessName // ignore: cast_nullable_to_non_nullable
as String,approvalStatus: null == approvalStatus ? _self.approvalStatus : approvalStatus // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
