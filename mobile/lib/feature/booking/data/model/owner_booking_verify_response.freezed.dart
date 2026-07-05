// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'owner_booking_verify_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$OwnerBookingVerifyResponse {

 String get id;@JsonKey(name: 'venue_id') String get venueId;@JsonKey(name: 'venue_name') String get venueName;@JsonKey(name: 'booking_date') String get bookingDate; String get status; double get amount;@JsonKey(name: 'venue_amount') double get venueAmount;@JsonKey(name: 'cleaning_fee') double get cleaningFee;@JsonKey(name: 'commission_percent') double get commissionPercent;@JsonKey(name: 'commission_amount') double get commissionAmount;@JsonKey(name: 'security_amount') double get securityAmount;@JsonKey(name: 'total_amount') double get totalAmount;@JsonKey(name: 'lock_expires_at') String get lockExpiresAt;@JsonKey(name: 'created_at') String get createdAt; List<BookingVerifySlotResponse> get slots;
/// Create a copy of OwnerBookingVerifyResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OwnerBookingVerifyResponseCopyWith<OwnerBookingVerifyResponse> get copyWith => _$OwnerBookingVerifyResponseCopyWithImpl<OwnerBookingVerifyResponse>(this as OwnerBookingVerifyResponse, _$identity);

  /// Serializes this OwnerBookingVerifyResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OwnerBookingVerifyResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.venueId, venueId) || other.venueId == venueId)&&(identical(other.venueName, venueName) || other.venueName == venueName)&&(identical(other.bookingDate, bookingDate) || other.bookingDate == bookingDate)&&(identical(other.status, status) || other.status == status)&&(identical(other.amount, amount) || other.amount == amount)&&(identical(other.venueAmount, venueAmount) || other.venueAmount == venueAmount)&&(identical(other.cleaningFee, cleaningFee) || other.cleaningFee == cleaningFee)&&(identical(other.commissionPercent, commissionPercent) || other.commissionPercent == commissionPercent)&&(identical(other.commissionAmount, commissionAmount) || other.commissionAmount == commissionAmount)&&(identical(other.securityAmount, securityAmount) || other.securityAmount == securityAmount)&&(identical(other.totalAmount, totalAmount) || other.totalAmount == totalAmount)&&(identical(other.lockExpiresAt, lockExpiresAt) || other.lockExpiresAt == lockExpiresAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&const DeepCollectionEquality().equals(other.slots, slots));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,venueId,venueName,bookingDate,status,amount,venueAmount,cleaningFee,commissionPercent,commissionAmount,securityAmount,totalAmount,lockExpiresAt,createdAt,const DeepCollectionEquality().hash(slots));

@override
String toString() {
  return 'OwnerBookingVerifyResponse(id: $id, venueId: $venueId, venueName: $venueName, bookingDate: $bookingDate, status: $status, amount: $amount, venueAmount: $venueAmount, cleaningFee: $cleaningFee, commissionPercent: $commissionPercent, commissionAmount: $commissionAmount, securityAmount: $securityAmount, totalAmount: $totalAmount, lockExpiresAt: $lockExpiresAt, createdAt: $createdAt, slots: $slots)';
}


}

/// @nodoc
abstract mixin class $OwnerBookingVerifyResponseCopyWith<$Res>  {
  factory $OwnerBookingVerifyResponseCopyWith(OwnerBookingVerifyResponse value, $Res Function(OwnerBookingVerifyResponse) _then) = _$OwnerBookingVerifyResponseCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'venue_id') String venueId,@JsonKey(name: 'venue_name') String venueName,@JsonKey(name: 'booking_date') String bookingDate, String status, double amount,@JsonKey(name: 'venue_amount') double venueAmount,@JsonKey(name: 'cleaning_fee') double cleaningFee,@JsonKey(name: 'commission_percent') double commissionPercent,@JsonKey(name: 'commission_amount') double commissionAmount,@JsonKey(name: 'security_amount') double securityAmount,@JsonKey(name: 'total_amount') double totalAmount,@JsonKey(name: 'lock_expires_at') String lockExpiresAt,@JsonKey(name: 'created_at') String createdAt, List<BookingVerifySlotResponse> slots
});




}
/// @nodoc
class _$OwnerBookingVerifyResponseCopyWithImpl<$Res>
    implements $OwnerBookingVerifyResponseCopyWith<$Res> {
  _$OwnerBookingVerifyResponseCopyWithImpl(this._self, this._then);

  final OwnerBookingVerifyResponse _self;
  final $Res Function(OwnerBookingVerifyResponse) _then;

/// Create a copy of OwnerBookingVerifyResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? venueId = null,Object? venueName = null,Object? bookingDate = null,Object? status = null,Object? amount = null,Object? venueAmount = null,Object? cleaningFee = null,Object? commissionPercent = null,Object? commissionAmount = null,Object? securityAmount = null,Object? totalAmount = null,Object? lockExpiresAt = null,Object? createdAt = null,Object? slots = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,venueId: null == venueId ? _self.venueId : venueId // ignore: cast_nullable_to_non_nullable
as String,venueName: null == venueName ? _self.venueName : venueName // ignore: cast_nullable_to_non_nullable
as String,bookingDate: null == bookingDate ? _self.bookingDate : bookingDate // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,amount: null == amount ? _self.amount : amount // ignore: cast_nullable_to_non_nullable
as double,venueAmount: null == venueAmount ? _self.venueAmount : venueAmount // ignore: cast_nullable_to_non_nullable
as double,cleaningFee: null == cleaningFee ? _self.cleaningFee : cleaningFee // ignore: cast_nullable_to_non_nullable
as double,commissionPercent: null == commissionPercent ? _self.commissionPercent : commissionPercent // ignore: cast_nullable_to_non_nullable
as double,commissionAmount: null == commissionAmount ? _self.commissionAmount : commissionAmount // ignore: cast_nullable_to_non_nullable
as double,securityAmount: null == securityAmount ? _self.securityAmount : securityAmount // ignore: cast_nullable_to_non_nullable
as double,totalAmount: null == totalAmount ? _self.totalAmount : totalAmount // ignore: cast_nullable_to_non_nullable
as double,lockExpiresAt: null == lockExpiresAt ? _self.lockExpiresAt : lockExpiresAt // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,slots: null == slots ? _self.slots : slots // ignore: cast_nullable_to_non_nullable
as List<BookingVerifySlotResponse>,
  ));
}

}


/// Adds pattern-matching-related methods to [OwnerBookingVerifyResponse].
extension OwnerBookingVerifyResponsePatterns on OwnerBookingVerifyResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OwnerBookingVerifyResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OwnerBookingVerifyResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OwnerBookingVerifyResponse value)  $default,){
final _that = this;
switch (_that) {
case _OwnerBookingVerifyResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OwnerBookingVerifyResponse value)?  $default,){
final _that = this;
switch (_that) {
case _OwnerBookingVerifyResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'venue_id')  String venueId, @JsonKey(name: 'venue_name')  String venueName, @JsonKey(name: 'booking_date')  String bookingDate,  String status,  double amount, @JsonKey(name: 'venue_amount')  double venueAmount, @JsonKey(name: 'cleaning_fee')  double cleaningFee, @JsonKey(name: 'commission_percent')  double commissionPercent, @JsonKey(name: 'commission_amount')  double commissionAmount, @JsonKey(name: 'security_amount')  double securityAmount, @JsonKey(name: 'total_amount')  double totalAmount, @JsonKey(name: 'lock_expires_at')  String lockExpiresAt, @JsonKey(name: 'created_at')  String createdAt,  List<BookingVerifySlotResponse> slots)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OwnerBookingVerifyResponse() when $default != null:
return $default(_that.id,_that.venueId,_that.venueName,_that.bookingDate,_that.status,_that.amount,_that.venueAmount,_that.cleaningFee,_that.commissionPercent,_that.commissionAmount,_that.securityAmount,_that.totalAmount,_that.lockExpiresAt,_that.createdAt,_that.slots);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'venue_id')  String venueId, @JsonKey(name: 'venue_name')  String venueName, @JsonKey(name: 'booking_date')  String bookingDate,  String status,  double amount, @JsonKey(name: 'venue_amount')  double venueAmount, @JsonKey(name: 'cleaning_fee')  double cleaningFee, @JsonKey(name: 'commission_percent')  double commissionPercent, @JsonKey(name: 'commission_amount')  double commissionAmount, @JsonKey(name: 'security_amount')  double securityAmount, @JsonKey(name: 'total_amount')  double totalAmount, @JsonKey(name: 'lock_expires_at')  String lockExpiresAt, @JsonKey(name: 'created_at')  String createdAt,  List<BookingVerifySlotResponse> slots)  $default,) {final _that = this;
switch (_that) {
case _OwnerBookingVerifyResponse():
return $default(_that.id,_that.venueId,_that.venueName,_that.bookingDate,_that.status,_that.amount,_that.venueAmount,_that.cleaningFee,_that.commissionPercent,_that.commissionAmount,_that.securityAmount,_that.totalAmount,_that.lockExpiresAt,_that.createdAt,_that.slots);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'venue_id')  String venueId, @JsonKey(name: 'venue_name')  String venueName, @JsonKey(name: 'booking_date')  String bookingDate,  String status,  double amount, @JsonKey(name: 'venue_amount')  double venueAmount, @JsonKey(name: 'cleaning_fee')  double cleaningFee, @JsonKey(name: 'commission_percent')  double commissionPercent, @JsonKey(name: 'commission_amount')  double commissionAmount, @JsonKey(name: 'security_amount')  double securityAmount, @JsonKey(name: 'total_amount')  double totalAmount, @JsonKey(name: 'lock_expires_at')  String lockExpiresAt, @JsonKey(name: 'created_at')  String createdAt,  List<BookingVerifySlotResponse> slots)?  $default,) {final _that = this;
switch (_that) {
case _OwnerBookingVerifyResponse() when $default != null:
return $default(_that.id,_that.venueId,_that.venueName,_that.bookingDate,_that.status,_that.amount,_that.venueAmount,_that.cleaningFee,_that.commissionPercent,_that.commissionAmount,_that.securityAmount,_that.totalAmount,_that.lockExpiresAt,_that.createdAt,_that.slots);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _OwnerBookingVerifyResponse implements OwnerBookingVerifyResponse {
  const _OwnerBookingVerifyResponse({required this.id, @JsonKey(name: 'venue_id') required this.venueId, @JsonKey(name: 'venue_name') required this.venueName, @JsonKey(name: 'booking_date') required this.bookingDate, required this.status, required this.amount, @JsonKey(name: 'venue_amount') required this.venueAmount, @JsonKey(name: 'cleaning_fee') required this.cleaningFee, @JsonKey(name: 'commission_percent') required this.commissionPercent, @JsonKey(name: 'commission_amount') required this.commissionAmount, @JsonKey(name: 'security_amount') required this.securityAmount, @JsonKey(name: 'total_amount') required this.totalAmount, @JsonKey(name: 'lock_expires_at') required this.lockExpiresAt, @JsonKey(name: 'created_at') required this.createdAt, required final  List<BookingVerifySlotResponse> slots}): _slots = slots;
  factory _OwnerBookingVerifyResponse.fromJson(Map<String, dynamic> json) => _$OwnerBookingVerifyResponseFromJson(json);

@override final  String id;
@override@JsonKey(name: 'venue_id') final  String venueId;
@override@JsonKey(name: 'venue_name') final  String venueName;
@override@JsonKey(name: 'booking_date') final  String bookingDate;
@override final  String status;
@override final  double amount;
@override@JsonKey(name: 'venue_amount') final  double venueAmount;
@override@JsonKey(name: 'cleaning_fee') final  double cleaningFee;
@override@JsonKey(name: 'commission_percent') final  double commissionPercent;
@override@JsonKey(name: 'commission_amount') final  double commissionAmount;
@override@JsonKey(name: 'security_amount') final  double securityAmount;
@override@JsonKey(name: 'total_amount') final  double totalAmount;
@override@JsonKey(name: 'lock_expires_at') final  String lockExpiresAt;
@override@JsonKey(name: 'created_at') final  String createdAt;
 final  List<BookingVerifySlotResponse> _slots;
@override List<BookingVerifySlotResponse> get slots {
  if (_slots is EqualUnmodifiableListView) return _slots;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_slots);
}


/// Create a copy of OwnerBookingVerifyResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OwnerBookingVerifyResponseCopyWith<_OwnerBookingVerifyResponse> get copyWith => __$OwnerBookingVerifyResponseCopyWithImpl<_OwnerBookingVerifyResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$OwnerBookingVerifyResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _OwnerBookingVerifyResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.venueId, venueId) || other.venueId == venueId)&&(identical(other.venueName, venueName) || other.venueName == venueName)&&(identical(other.bookingDate, bookingDate) || other.bookingDate == bookingDate)&&(identical(other.status, status) || other.status == status)&&(identical(other.amount, amount) || other.amount == amount)&&(identical(other.venueAmount, venueAmount) || other.venueAmount == venueAmount)&&(identical(other.cleaningFee, cleaningFee) || other.cleaningFee == cleaningFee)&&(identical(other.commissionPercent, commissionPercent) || other.commissionPercent == commissionPercent)&&(identical(other.commissionAmount, commissionAmount) || other.commissionAmount == commissionAmount)&&(identical(other.securityAmount, securityAmount) || other.securityAmount == securityAmount)&&(identical(other.totalAmount, totalAmount) || other.totalAmount == totalAmount)&&(identical(other.lockExpiresAt, lockExpiresAt) || other.lockExpiresAt == lockExpiresAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&const DeepCollectionEquality().equals(other._slots, _slots));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,venueId,venueName,bookingDate,status,amount,venueAmount,cleaningFee,commissionPercent,commissionAmount,securityAmount,totalAmount,lockExpiresAt,createdAt,const DeepCollectionEquality().hash(_slots));

@override
String toString() {
  return 'OwnerBookingVerifyResponse(id: $id, venueId: $venueId, venueName: $venueName, bookingDate: $bookingDate, status: $status, amount: $amount, venueAmount: $venueAmount, cleaningFee: $cleaningFee, commissionPercent: $commissionPercent, commissionAmount: $commissionAmount, securityAmount: $securityAmount, totalAmount: $totalAmount, lockExpiresAt: $lockExpiresAt, createdAt: $createdAt, slots: $slots)';
}


}

/// @nodoc
abstract mixin class _$OwnerBookingVerifyResponseCopyWith<$Res> implements $OwnerBookingVerifyResponseCopyWith<$Res> {
  factory _$OwnerBookingVerifyResponseCopyWith(_OwnerBookingVerifyResponse value, $Res Function(_OwnerBookingVerifyResponse) _then) = __$OwnerBookingVerifyResponseCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'venue_id') String venueId,@JsonKey(name: 'venue_name') String venueName,@JsonKey(name: 'booking_date') String bookingDate, String status, double amount,@JsonKey(name: 'venue_amount') double venueAmount,@JsonKey(name: 'cleaning_fee') double cleaningFee,@JsonKey(name: 'commission_percent') double commissionPercent,@JsonKey(name: 'commission_amount') double commissionAmount,@JsonKey(name: 'security_amount') double securityAmount,@JsonKey(name: 'total_amount') double totalAmount,@JsonKey(name: 'lock_expires_at') String lockExpiresAt,@JsonKey(name: 'created_at') String createdAt, List<BookingVerifySlotResponse> slots
});




}
/// @nodoc
class __$OwnerBookingVerifyResponseCopyWithImpl<$Res>
    implements _$OwnerBookingVerifyResponseCopyWith<$Res> {
  __$OwnerBookingVerifyResponseCopyWithImpl(this._self, this._then);

  final _OwnerBookingVerifyResponse _self;
  final $Res Function(_OwnerBookingVerifyResponse) _then;

/// Create a copy of OwnerBookingVerifyResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? venueId = null,Object? venueName = null,Object? bookingDate = null,Object? status = null,Object? amount = null,Object? venueAmount = null,Object? cleaningFee = null,Object? commissionPercent = null,Object? commissionAmount = null,Object? securityAmount = null,Object? totalAmount = null,Object? lockExpiresAt = null,Object? createdAt = null,Object? slots = null,}) {
  return _then(_OwnerBookingVerifyResponse(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,venueId: null == venueId ? _self.venueId : venueId // ignore: cast_nullable_to_non_nullable
as String,venueName: null == venueName ? _self.venueName : venueName // ignore: cast_nullable_to_non_nullable
as String,bookingDate: null == bookingDate ? _self.bookingDate : bookingDate // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,amount: null == amount ? _self.amount : amount // ignore: cast_nullable_to_non_nullable
as double,venueAmount: null == venueAmount ? _self.venueAmount : venueAmount // ignore: cast_nullable_to_non_nullable
as double,cleaningFee: null == cleaningFee ? _self.cleaningFee : cleaningFee // ignore: cast_nullable_to_non_nullable
as double,commissionPercent: null == commissionPercent ? _self.commissionPercent : commissionPercent // ignore: cast_nullable_to_non_nullable
as double,commissionAmount: null == commissionAmount ? _self.commissionAmount : commissionAmount // ignore: cast_nullable_to_non_nullable
as double,securityAmount: null == securityAmount ? _self.securityAmount : securityAmount // ignore: cast_nullable_to_non_nullable
as double,totalAmount: null == totalAmount ? _self.totalAmount : totalAmount // ignore: cast_nullable_to_non_nullable
as double,lockExpiresAt: null == lockExpiresAt ? _self.lockExpiresAt : lockExpiresAt // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,slots: null == slots ? _self._slots : slots // ignore: cast_nullable_to_non_nullable
as List<BookingVerifySlotResponse>,
  ));
}


}

// dart format on
