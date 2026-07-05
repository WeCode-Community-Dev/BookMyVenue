// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'booking_verify_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$BookingVerifyRequest {

@JsonKey(name: 'booking_id') String get bookingId;@JsonKey(name: 'razorpay_order_id') String get razorpayOrderId;@JsonKey(name: 'razorpay_payment_id') String get razorpayPaymentId;@JsonKey(name: 'razorpay_signature') String get razorpaySignature;
/// Create a copy of BookingVerifyRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$BookingVerifyRequestCopyWith<BookingVerifyRequest> get copyWith => _$BookingVerifyRequestCopyWithImpl<BookingVerifyRequest>(this as BookingVerifyRequest, _$identity);

  /// Serializes this BookingVerifyRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is BookingVerifyRequest&&(identical(other.bookingId, bookingId) || other.bookingId == bookingId)&&(identical(other.razorpayOrderId, razorpayOrderId) || other.razorpayOrderId == razorpayOrderId)&&(identical(other.razorpayPaymentId, razorpayPaymentId) || other.razorpayPaymentId == razorpayPaymentId)&&(identical(other.razorpaySignature, razorpaySignature) || other.razorpaySignature == razorpaySignature));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,bookingId,razorpayOrderId,razorpayPaymentId,razorpaySignature);

@override
String toString() {
  return 'BookingVerifyRequest(bookingId: $bookingId, razorpayOrderId: $razorpayOrderId, razorpayPaymentId: $razorpayPaymentId, razorpaySignature: $razorpaySignature)';
}


}

/// @nodoc
abstract mixin class $BookingVerifyRequestCopyWith<$Res>  {
  factory $BookingVerifyRequestCopyWith(BookingVerifyRequest value, $Res Function(BookingVerifyRequest) _then) = _$BookingVerifyRequestCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'booking_id') String bookingId,@JsonKey(name: 'razorpay_order_id') String razorpayOrderId,@JsonKey(name: 'razorpay_payment_id') String razorpayPaymentId,@JsonKey(name: 'razorpay_signature') String razorpaySignature
});




}
/// @nodoc
class _$BookingVerifyRequestCopyWithImpl<$Res>
    implements $BookingVerifyRequestCopyWith<$Res> {
  _$BookingVerifyRequestCopyWithImpl(this._self, this._then);

  final BookingVerifyRequest _self;
  final $Res Function(BookingVerifyRequest) _then;

/// Create a copy of BookingVerifyRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? bookingId = null,Object? razorpayOrderId = null,Object? razorpayPaymentId = null,Object? razorpaySignature = null,}) {
  return _then(_self.copyWith(
bookingId: null == bookingId ? _self.bookingId : bookingId // ignore: cast_nullable_to_non_nullable
as String,razorpayOrderId: null == razorpayOrderId ? _self.razorpayOrderId : razorpayOrderId // ignore: cast_nullable_to_non_nullable
as String,razorpayPaymentId: null == razorpayPaymentId ? _self.razorpayPaymentId : razorpayPaymentId // ignore: cast_nullable_to_non_nullable
as String,razorpaySignature: null == razorpaySignature ? _self.razorpaySignature : razorpaySignature // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [BookingVerifyRequest].
extension BookingVerifyRequestPatterns on BookingVerifyRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _BookingVerifyRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _BookingVerifyRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _BookingVerifyRequest value)  $default,){
final _that = this;
switch (_that) {
case _BookingVerifyRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _BookingVerifyRequest value)?  $default,){
final _that = this;
switch (_that) {
case _BookingVerifyRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'booking_id')  String bookingId, @JsonKey(name: 'razorpay_order_id')  String razorpayOrderId, @JsonKey(name: 'razorpay_payment_id')  String razorpayPaymentId, @JsonKey(name: 'razorpay_signature')  String razorpaySignature)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _BookingVerifyRequest() when $default != null:
return $default(_that.bookingId,_that.razorpayOrderId,_that.razorpayPaymentId,_that.razorpaySignature);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'booking_id')  String bookingId, @JsonKey(name: 'razorpay_order_id')  String razorpayOrderId, @JsonKey(name: 'razorpay_payment_id')  String razorpayPaymentId, @JsonKey(name: 'razorpay_signature')  String razorpaySignature)  $default,) {final _that = this;
switch (_that) {
case _BookingVerifyRequest():
return $default(_that.bookingId,_that.razorpayOrderId,_that.razorpayPaymentId,_that.razorpaySignature);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'booking_id')  String bookingId, @JsonKey(name: 'razorpay_order_id')  String razorpayOrderId, @JsonKey(name: 'razorpay_payment_id')  String razorpayPaymentId, @JsonKey(name: 'razorpay_signature')  String razorpaySignature)?  $default,) {final _that = this;
switch (_that) {
case _BookingVerifyRequest() when $default != null:
return $default(_that.bookingId,_that.razorpayOrderId,_that.razorpayPaymentId,_that.razorpaySignature);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _BookingVerifyRequest implements BookingVerifyRequest {
  const _BookingVerifyRequest({@JsonKey(name: 'booking_id') required this.bookingId, @JsonKey(name: 'razorpay_order_id') required this.razorpayOrderId, @JsonKey(name: 'razorpay_payment_id') required this.razorpayPaymentId, @JsonKey(name: 'razorpay_signature') required this.razorpaySignature});
  factory _BookingVerifyRequest.fromJson(Map<String, dynamic> json) => _$BookingVerifyRequestFromJson(json);

@override@JsonKey(name: 'booking_id') final  String bookingId;
@override@JsonKey(name: 'razorpay_order_id') final  String razorpayOrderId;
@override@JsonKey(name: 'razorpay_payment_id') final  String razorpayPaymentId;
@override@JsonKey(name: 'razorpay_signature') final  String razorpaySignature;

/// Create a copy of BookingVerifyRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$BookingVerifyRequestCopyWith<_BookingVerifyRequest> get copyWith => __$BookingVerifyRequestCopyWithImpl<_BookingVerifyRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$BookingVerifyRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _BookingVerifyRequest&&(identical(other.bookingId, bookingId) || other.bookingId == bookingId)&&(identical(other.razorpayOrderId, razorpayOrderId) || other.razorpayOrderId == razorpayOrderId)&&(identical(other.razorpayPaymentId, razorpayPaymentId) || other.razorpayPaymentId == razorpayPaymentId)&&(identical(other.razorpaySignature, razorpaySignature) || other.razorpaySignature == razorpaySignature));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,bookingId,razorpayOrderId,razorpayPaymentId,razorpaySignature);

@override
String toString() {
  return 'BookingVerifyRequest(bookingId: $bookingId, razorpayOrderId: $razorpayOrderId, razorpayPaymentId: $razorpayPaymentId, razorpaySignature: $razorpaySignature)';
}


}

/// @nodoc
abstract mixin class _$BookingVerifyRequestCopyWith<$Res> implements $BookingVerifyRequestCopyWith<$Res> {
  factory _$BookingVerifyRequestCopyWith(_BookingVerifyRequest value, $Res Function(_BookingVerifyRequest) _then) = __$BookingVerifyRequestCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'booking_id') String bookingId,@JsonKey(name: 'razorpay_order_id') String razorpayOrderId,@JsonKey(name: 'razorpay_payment_id') String razorpayPaymentId,@JsonKey(name: 'razorpay_signature') String razorpaySignature
});




}
/// @nodoc
class __$BookingVerifyRequestCopyWithImpl<$Res>
    implements _$BookingVerifyRequestCopyWith<$Res> {
  __$BookingVerifyRequestCopyWithImpl(this._self, this._then);

  final _BookingVerifyRequest _self;
  final $Res Function(_BookingVerifyRequest) _then;

/// Create a copy of BookingVerifyRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? bookingId = null,Object? razorpayOrderId = null,Object? razorpayPaymentId = null,Object? razorpaySignature = null,}) {
  return _then(_BookingVerifyRequest(
bookingId: null == bookingId ? _self.bookingId : bookingId // ignore: cast_nullable_to_non_nullable
as String,razorpayOrderId: null == razorpayOrderId ? _self.razorpayOrderId : razorpayOrderId // ignore: cast_nullable_to_non_nullable
as String,razorpayPaymentId: null == razorpayPaymentId ? _self.razorpayPaymentId : razorpayPaymentId // ignore: cast_nullable_to_non_nullable
as String,razorpaySignature: null == razorpaySignature ? _self.razorpaySignature : razorpaySignature // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
