// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'booking_checkout_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$BookingCheckoutResponse {

@JsonKey(name: 'booking_id') String get bookingId; double get amount;@JsonKey(name: 'razorpay_order_id') String get razorpayOrderId;@JsonKey(name: 'razorpay_key_id') String get razorpayKeyId;@JsonKey(name: 'lock_expires_at') String get lockExpiresAt;
/// Create a copy of BookingCheckoutResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$BookingCheckoutResponseCopyWith<BookingCheckoutResponse> get copyWith => _$BookingCheckoutResponseCopyWithImpl<BookingCheckoutResponse>(this as BookingCheckoutResponse, _$identity);

  /// Serializes this BookingCheckoutResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is BookingCheckoutResponse&&(identical(other.bookingId, bookingId) || other.bookingId == bookingId)&&(identical(other.amount, amount) || other.amount == amount)&&(identical(other.razorpayOrderId, razorpayOrderId) || other.razorpayOrderId == razorpayOrderId)&&(identical(other.razorpayKeyId, razorpayKeyId) || other.razorpayKeyId == razorpayKeyId)&&(identical(other.lockExpiresAt, lockExpiresAt) || other.lockExpiresAt == lockExpiresAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,bookingId,amount,razorpayOrderId,razorpayKeyId,lockExpiresAt);

@override
String toString() {
  return 'BookingCheckoutResponse(bookingId: $bookingId, amount: $amount, razorpayOrderId: $razorpayOrderId, razorpayKeyId: $razorpayKeyId, lockExpiresAt: $lockExpiresAt)';
}


}

/// @nodoc
abstract mixin class $BookingCheckoutResponseCopyWith<$Res>  {
  factory $BookingCheckoutResponseCopyWith(BookingCheckoutResponse value, $Res Function(BookingCheckoutResponse) _then) = _$BookingCheckoutResponseCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'booking_id') String bookingId, double amount,@JsonKey(name: 'razorpay_order_id') String razorpayOrderId,@JsonKey(name: 'razorpay_key_id') String razorpayKeyId,@JsonKey(name: 'lock_expires_at') String lockExpiresAt
});




}
/// @nodoc
class _$BookingCheckoutResponseCopyWithImpl<$Res>
    implements $BookingCheckoutResponseCopyWith<$Res> {
  _$BookingCheckoutResponseCopyWithImpl(this._self, this._then);

  final BookingCheckoutResponse _self;
  final $Res Function(BookingCheckoutResponse) _then;

/// Create a copy of BookingCheckoutResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? bookingId = null,Object? amount = null,Object? razorpayOrderId = null,Object? razorpayKeyId = null,Object? lockExpiresAt = null,}) {
  return _then(_self.copyWith(
bookingId: null == bookingId ? _self.bookingId : bookingId // ignore: cast_nullable_to_non_nullable
as String,amount: null == amount ? _self.amount : amount // ignore: cast_nullable_to_non_nullable
as double,razorpayOrderId: null == razorpayOrderId ? _self.razorpayOrderId : razorpayOrderId // ignore: cast_nullable_to_non_nullable
as String,razorpayKeyId: null == razorpayKeyId ? _self.razorpayKeyId : razorpayKeyId // ignore: cast_nullable_to_non_nullable
as String,lockExpiresAt: null == lockExpiresAt ? _self.lockExpiresAt : lockExpiresAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [BookingCheckoutResponse].
extension BookingCheckoutResponsePatterns on BookingCheckoutResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _BookingCheckoutResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _BookingCheckoutResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _BookingCheckoutResponse value)  $default,){
final _that = this;
switch (_that) {
case _BookingCheckoutResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _BookingCheckoutResponse value)?  $default,){
final _that = this;
switch (_that) {
case _BookingCheckoutResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'booking_id')  String bookingId,  double amount, @JsonKey(name: 'razorpay_order_id')  String razorpayOrderId, @JsonKey(name: 'razorpay_key_id')  String razorpayKeyId, @JsonKey(name: 'lock_expires_at')  String lockExpiresAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _BookingCheckoutResponse() when $default != null:
return $default(_that.bookingId,_that.amount,_that.razorpayOrderId,_that.razorpayKeyId,_that.lockExpiresAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'booking_id')  String bookingId,  double amount, @JsonKey(name: 'razorpay_order_id')  String razorpayOrderId, @JsonKey(name: 'razorpay_key_id')  String razorpayKeyId, @JsonKey(name: 'lock_expires_at')  String lockExpiresAt)  $default,) {final _that = this;
switch (_that) {
case _BookingCheckoutResponse():
return $default(_that.bookingId,_that.amount,_that.razorpayOrderId,_that.razorpayKeyId,_that.lockExpiresAt);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'booking_id')  String bookingId,  double amount, @JsonKey(name: 'razorpay_order_id')  String razorpayOrderId, @JsonKey(name: 'razorpay_key_id')  String razorpayKeyId, @JsonKey(name: 'lock_expires_at')  String lockExpiresAt)?  $default,) {final _that = this;
switch (_that) {
case _BookingCheckoutResponse() when $default != null:
return $default(_that.bookingId,_that.amount,_that.razorpayOrderId,_that.razorpayKeyId,_that.lockExpiresAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _BookingCheckoutResponse implements BookingCheckoutResponse {
  const _BookingCheckoutResponse({@JsonKey(name: 'booking_id') required this.bookingId, required this.amount, @JsonKey(name: 'razorpay_order_id') required this.razorpayOrderId, @JsonKey(name: 'razorpay_key_id') required this.razorpayKeyId, @JsonKey(name: 'lock_expires_at') required this.lockExpiresAt});
  factory _BookingCheckoutResponse.fromJson(Map<String, dynamic> json) => _$BookingCheckoutResponseFromJson(json);

@override@JsonKey(name: 'booking_id') final  String bookingId;
@override final  double amount;
@override@JsonKey(name: 'razorpay_order_id') final  String razorpayOrderId;
@override@JsonKey(name: 'razorpay_key_id') final  String razorpayKeyId;
@override@JsonKey(name: 'lock_expires_at') final  String lockExpiresAt;

/// Create a copy of BookingCheckoutResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$BookingCheckoutResponseCopyWith<_BookingCheckoutResponse> get copyWith => __$BookingCheckoutResponseCopyWithImpl<_BookingCheckoutResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$BookingCheckoutResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _BookingCheckoutResponse&&(identical(other.bookingId, bookingId) || other.bookingId == bookingId)&&(identical(other.amount, amount) || other.amount == amount)&&(identical(other.razorpayOrderId, razorpayOrderId) || other.razorpayOrderId == razorpayOrderId)&&(identical(other.razorpayKeyId, razorpayKeyId) || other.razorpayKeyId == razorpayKeyId)&&(identical(other.lockExpiresAt, lockExpiresAt) || other.lockExpiresAt == lockExpiresAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,bookingId,amount,razorpayOrderId,razorpayKeyId,lockExpiresAt);

@override
String toString() {
  return 'BookingCheckoutResponse(bookingId: $bookingId, amount: $amount, razorpayOrderId: $razorpayOrderId, razorpayKeyId: $razorpayKeyId, lockExpiresAt: $lockExpiresAt)';
}


}

/// @nodoc
abstract mixin class _$BookingCheckoutResponseCopyWith<$Res> implements $BookingCheckoutResponseCopyWith<$Res> {
  factory _$BookingCheckoutResponseCopyWith(_BookingCheckoutResponse value, $Res Function(_BookingCheckoutResponse) _then) = __$BookingCheckoutResponseCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'booking_id') String bookingId, double amount,@JsonKey(name: 'razorpay_order_id') String razorpayOrderId,@JsonKey(name: 'razorpay_key_id') String razorpayKeyId,@JsonKey(name: 'lock_expires_at') String lockExpiresAt
});




}
/// @nodoc
class __$BookingCheckoutResponseCopyWithImpl<$Res>
    implements _$BookingCheckoutResponseCopyWith<$Res> {
  __$BookingCheckoutResponseCopyWithImpl(this._self, this._then);

  final _BookingCheckoutResponse _self;
  final $Res Function(_BookingCheckoutResponse) _then;

/// Create a copy of BookingCheckoutResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? bookingId = null,Object? amount = null,Object? razorpayOrderId = null,Object? razorpayKeyId = null,Object? lockExpiresAt = null,}) {
  return _then(_BookingCheckoutResponse(
bookingId: null == bookingId ? _self.bookingId : bookingId // ignore: cast_nullable_to_non_nullable
as String,amount: null == amount ? _self.amount : amount // ignore: cast_nullable_to_non_nullable
as double,razorpayOrderId: null == razorpayOrderId ? _self.razorpayOrderId : razorpayOrderId // ignore: cast_nullable_to_non_nullable
as String,razorpayKeyId: null == razorpayKeyId ? _self.razorpayKeyId : razorpayKeyId // ignore: cast_nullable_to_non_nullable
as String,lockExpiresAt: null == lockExpiresAt ? _self.lockExpiresAt : lockExpiresAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
