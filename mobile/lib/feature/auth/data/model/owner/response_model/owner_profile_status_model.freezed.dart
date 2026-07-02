// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'owner_profile_status_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OwnerProfileStatusModel {

@JsonKey(name: 'owner_id') String get ownerId;@JsonKey(name: 'status_message') String get statusMessage;@JsonKey(name: 'status_code') int get statusCode;@JsonKey(name: 'reject_reason') String? get rejectReason;@JsonKey(name: 'approval_status') ApprovalStatus get approvalStatus;
/// Create a copy of OwnerProfileStatusModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OwnerProfileStatusModelCopyWith<OwnerProfileStatusModel> get copyWith => _$OwnerProfileStatusModelCopyWithImpl<OwnerProfileStatusModel>(this as OwnerProfileStatusModel, _$identity);

  /// Serializes this OwnerProfileStatusModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OwnerProfileStatusModel&&(identical(other.ownerId, ownerId) || other.ownerId == ownerId)&&(identical(other.statusMessage, statusMessage) || other.statusMessage == statusMessage)&&(identical(other.statusCode, statusCode) || other.statusCode == statusCode)&&(identical(other.rejectReason, rejectReason) || other.rejectReason == rejectReason)&&(identical(other.approvalStatus, approvalStatus) || other.approvalStatus == approvalStatus));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,ownerId,statusMessage,statusCode,rejectReason,approvalStatus);

@override
String toString() {
  return 'OwnerProfileStatusModel(ownerId: $ownerId, statusMessage: $statusMessage, statusCode: $statusCode, rejectReason: $rejectReason, approvalStatus: $approvalStatus)';
}


}

/// @nodoc
abstract mixin class $OwnerProfileStatusModelCopyWith<$Res>  {
  factory $OwnerProfileStatusModelCopyWith(OwnerProfileStatusModel value, $Res Function(OwnerProfileStatusModel) _then) = _$OwnerProfileStatusModelCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'owner_id') String ownerId,@JsonKey(name: 'status_message') String statusMessage,@JsonKey(name: 'status_code') int statusCode,@JsonKey(name: 'reject_reason') String? rejectReason,@JsonKey(name: 'approval_status') ApprovalStatus approvalStatus
});




}
/// @nodoc
class _$OwnerProfileStatusModelCopyWithImpl<$Res>
    implements $OwnerProfileStatusModelCopyWith<$Res> {
  _$OwnerProfileStatusModelCopyWithImpl(this._self, this._then);

  final OwnerProfileStatusModel _self;
  final $Res Function(OwnerProfileStatusModel) _then;

/// Create a copy of OwnerProfileStatusModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? ownerId = null,Object? statusMessage = null,Object? statusCode = null,Object? rejectReason = freezed,Object? approvalStatus = null,}) {
  return _then(_self.copyWith(
ownerId: null == ownerId ? _self.ownerId : ownerId // ignore: cast_nullable_to_non_nullable
as String,statusMessage: null == statusMessage ? _self.statusMessage : statusMessage // ignore: cast_nullable_to_non_nullable
as String,statusCode: null == statusCode ? _self.statusCode : statusCode // ignore: cast_nullable_to_non_nullable
as int,rejectReason: freezed == rejectReason ? _self.rejectReason : rejectReason // ignore: cast_nullable_to_non_nullable
as String?,approvalStatus: null == approvalStatus ? _self.approvalStatus : approvalStatus // ignore: cast_nullable_to_non_nullable
as ApprovalStatus,
  ));
}

}


/// Adds pattern-matching-related methods to [OwnerProfileStatusModel].
extension OwnerProfileStatusModelPatterns on OwnerProfileStatusModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OwnerProfileStatusModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OwnerProfileStatusModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OwnerProfileStatusModel value)  $default,){
final _that = this;
switch (_that) {
case _OwnerProfileStatusModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OwnerProfileStatusModel value)?  $default,){
final _that = this;
switch (_that) {
case _OwnerProfileStatusModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'owner_id')  String ownerId, @JsonKey(name: 'status_message')  String statusMessage, @JsonKey(name: 'status_code')  int statusCode, @JsonKey(name: 'reject_reason')  String? rejectReason, @JsonKey(name: 'approval_status')  ApprovalStatus approvalStatus)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OwnerProfileStatusModel() when $default != null:
return $default(_that.ownerId,_that.statusMessage,_that.statusCode,_that.rejectReason,_that.approvalStatus);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'owner_id')  String ownerId, @JsonKey(name: 'status_message')  String statusMessage, @JsonKey(name: 'status_code')  int statusCode, @JsonKey(name: 'reject_reason')  String? rejectReason, @JsonKey(name: 'approval_status')  ApprovalStatus approvalStatus)  $default,) {final _that = this;
switch (_that) {
case _OwnerProfileStatusModel():
return $default(_that.ownerId,_that.statusMessage,_that.statusCode,_that.rejectReason,_that.approvalStatus);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'owner_id')  String ownerId, @JsonKey(name: 'status_message')  String statusMessage, @JsonKey(name: 'status_code')  int statusCode, @JsonKey(name: 'reject_reason')  String? rejectReason, @JsonKey(name: 'approval_status')  ApprovalStatus approvalStatus)?  $default,) {final _that = this;
switch (_that) {
case _OwnerProfileStatusModel() when $default != null:
return $default(_that.ownerId,_that.statusMessage,_that.statusCode,_that.rejectReason,_that.approvalStatus);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OwnerProfileStatusModel implements OwnerProfileStatusModel {
  const _OwnerProfileStatusModel({@JsonKey(name: 'owner_id') required this.ownerId, @JsonKey(name: 'status_message') required this.statusMessage, @JsonKey(name: 'status_code') required this.statusCode, @JsonKey(name: 'reject_reason') this.rejectReason, @JsonKey(name: 'approval_status') required this.approvalStatus});
  factory _OwnerProfileStatusModel.fromJson(Map<String, dynamic> json) => _$OwnerProfileStatusModelFromJson(json);

@override@JsonKey(name: 'owner_id') final  String ownerId;
@override@JsonKey(name: 'status_message') final  String statusMessage;
@override@JsonKey(name: 'status_code') final  int statusCode;
@override@JsonKey(name: 'reject_reason') final  String? rejectReason;
@override@JsonKey(name: 'approval_status') final  ApprovalStatus approvalStatus;

/// Create a copy of OwnerProfileStatusModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OwnerProfileStatusModelCopyWith<_OwnerProfileStatusModel> get copyWith => __$OwnerProfileStatusModelCopyWithImpl<_OwnerProfileStatusModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OwnerProfileStatusModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _OwnerProfileStatusModel&&(identical(other.ownerId, ownerId) || other.ownerId == ownerId)&&(identical(other.statusMessage, statusMessage) || other.statusMessage == statusMessage)&&(identical(other.statusCode, statusCode) || other.statusCode == statusCode)&&(identical(other.rejectReason, rejectReason) || other.rejectReason == rejectReason)&&(identical(other.approvalStatus, approvalStatus) || other.approvalStatus == approvalStatus));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,ownerId,statusMessage,statusCode,rejectReason,approvalStatus);

@override
String toString() {
  return 'OwnerProfileStatusModel(ownerId: $ownerId, statusMessage: $statusMessage, statusCode: $statusCode, rejectReason: $rejectReason, approvalStatus: $approvalStatus)';
}


}

/// @nodoc
abstract mixin class _$OwnerProfileStatusModelCopyWith<$Res> implements $OwnerProfileStatusModelCopyWith<$Res> {
  factory _$OwnerProfileStatusModelCopyWith(_OwnerProfileStatusModel value, $Res Function(_OwnerProfileStatusModel) _then) = __$OwnerProfileStatusModelCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'owner_id') String ownerId,@JsonKey(name: 'status_message') String statusMessage,@JsonKey(name: 'status_code') int statusCode,@JsonKey(name: 'reject_reason') String? rejectReason,@JsonKey(name: 'approval_status') ApprovalStatus approvalStatus
});




}
/// @nodoc
class __$OwnerProfileStatusModelCopyWithImpl<$Res>
    implements _$OwnerProfileStatusModelCopyWith<$Res> {
  __$OwnerProfileStatusModelCopyWithImpl(this._self, this._then);

  final _OwnerProfileStatusModel _self;
  final $Res Function(_OwnerProfileStatusModel) _then;

/// Create a copy of OwnerProfileStatusModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? ownerId = null,Object? statusMessage = null,Object? statusCode = null,Object? rejectReason = freezed,Object? approvalStatus = null,}) {
  return _then(_OwnerProfileStatusModel(
ownerId: null == ownerId ? _self.ownerId : ownerId // ignore: cast_nullable_to_non_nullable
as String,statusMessage: null == statusMessage ? _self.statusMessage : statusMessage // ignore: cast_nullable_to_non_nullable
as String,statusCode: null == statusCode ? _self.statusCode : statusCode // ignore: cast_nullable_to_non_nullable
as int,rejectReason: freezed == rejectReason ? _self.rejectReason : rejectReason // ignore: cast_nullable_to_non_nullable
as String?,approvalStatus: null == approvalStatus ? _self.approvalStatus : approvalStatus // ignore: cast_nullable_to_non_nullable
as ApprovalStatus,
  ));
}


}

// dart format on
