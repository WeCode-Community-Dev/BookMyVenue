// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'booking_bloc.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$BookingEvent {





@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is BookingEvent);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'BookingEvent()';
}


}

/// @nodoc
class $BookingEventCopyWith<$Res>  {
$BookingEventCopyWith(BookingEvent _, $Res Function(BookingEvent) __);
}


/// Adds pattern-matching-related methods to [BookingEvent].
extension BookingEventPatterns on BookingEvent {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>({TResult Function( _CheckoutEvent value)?  checkout,TResult Function( _VerifyPaymentEvent value)?  verifyPayment,TResult Function( _CancelEvent value)?  cancel,TResult Function( _FetchMyBookingsEvent value)?  fetchMyBookings,TResult Function( _FetchOwnerBookingsEvent value)?  fetchOwnerBookings,required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CheckoutEvent() when checkout != null:
return checkout(_that);case _VerifyPaymentEvent() when verifyPayment != null:
return verifyPayment(_that);case _CancelEvent() when cancel != null:
return cancel(_that);case _FetchMyBookingsEvent() when fetchMyBookings != null:
return fetchMyBookings(_that);case _FetchOwnerBookingsEvent() when fetchOwnerBookings != null:
return fetchOwnerBookings(_that);case _:
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

@optionalTypeArgs TResult map<TResult extends Object?>({required TResult Function( _CheckoutEvent value)  checkout,required TResult Function( _VerifyPaymentEvent value)  verifyPayment,required TResult Function( _CancelEvent value)  cancel,required TResult Function( _FetchMyBookingsEvent value)  fetchMyBookings,required TResult Function( _FetchOwnerBookingsEvent value)  fetchOwnerBookings,}){
final _that = this;
switch (_that) {
case _CheckoutEvent():
return checkout(_that);case _VerifyPaymentEvent():
return verifyPayment(_that);case _CancelEvent():
return cancel(_that);case _FetchMyBookingsEvent():
return fetchMyBookings(_that);case _FetchOwnerBookingsEvent():
return fetchOwnerBookings(_that);case _:
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>({TResult? Function( _CheckoutEvent value)?  checkout,TResult? Function( _VerifyPaymentEvent value)?  verifyPayment,TResult? Function( _CancelEvent value)?  cancel,TResult? Function( _FetchMyBookingsEvent value)?  fetchMyBookings,TResult? Function( _FetchOwnerBookingsEvent value)?  fetchOwnerBookings,}){
final _that = this;
switch (_that) {
case _CheckoutEvent() when checkout != null:
return checkout(_that);case _VerifyPaymentEvent() when verifyPayment != null:
return verifyPayment(_that);case _CancelEvent() when cancel != null:
return cancel(_that);case _FetchMyBookingsEvent() when fetchMyBookings != null:
return fetchMyBookings(_that);case _FetchOwnerBookingsEvent() when fetchOwnerBookings != null:
return fetchOwnerBookings(_that);case _:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>({TResult Function( String venueId,  String bookingDate,  List<String> slotIds)?  checkout,TResult Function( String bookingId,  String razorpayOrderId,  String razorpayPaymentId,  String razorpaySignature)?  verifyPayment,TResult Function( String bookingId)?  cancel,TResult Function()?  fetchMyBookings,TResult Function()?  fetchOwnerBookings,required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CheckoutEvent() when checkout != null:
return checkout(_that.venueId,_that.bookingDate,_that.slotIds);case _VerifyPaymentEvent() when verifyPayment != null:
return verifyPayment(_that.bookingId,_that.razorpayOrderId,_that.razorpayPaymentId,_that.razorpaySignature);case _CancelEvent() when cancel != null:
return cancel(_that.bookingId);case _FetchMyBookingsEvent() when fetchMyBookings != null:
return fetchMyBookings();case _FetchOwnerBookingsEvent() when fetchOwnerBookings != null:
return fetchOwnerBookings();case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>({required TResult Function( String venueId,  String bookingDate,  List<String> slotIds)  checkout,required TResult Function( String bookingId,  String razorpayOrderId,  String razorpayPaymentId,  String razorpaySignature)  verifyPayment,required TResult Function( String bookingId)  cancel,required TResult Function()  fetchMyBookings,required TResult Function()  fetchOwnerBookings,}) {final _that = this;
switch (_that) {
case _CheckoutEvent():
return checkout(_that.venueId,_that.bookingDate,_that.slotIds);case _VerifyPaymentEvent():
return verifyPayment(_that.bookingId,_that.razorpayOrderId,_that.razorpayPaymentId,_that.razorpaySignature);case _CancelEvent():
return cancel(_that.bookingId);case _FetchMyBookingsEvent():
return fetchMyBookings();case _FetchOwnerBookingsEvent():
return fetchOwnerBookings();case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>({TResult? Function( String venueId,  String bookingDate,  List<String> slotIds)?  checkout,TResult? Function( String bookingId,  String razorpayOrderId,  String razorpayPaymentId,  String razorpaySignature)?  verifyPayment,TResult? Function( String bookingId)?  cancel,TResult? Function()?  fetchMyBookings,TResult? Function()?  fetchOwnerBookings,}) {final _that = this;
switch (_that) {
case _CheckoutEvent() when checkout != null:
return checkout(_that.venueId,_that.bookingDate,_that.slotIds);case _VerifyPaymentEvent() when verifyPayment != null:
return verifyPayment(_that.bookingId,_that.razorpayOrderId,_that.razorpayPaymentId,_that.razorpaySignature);case _CancelEvent() when cancel != null:
return cancel(_that.bookingId);case _FetchMyBookingsEvent() when fetchMyBookings != null:
return fetchMyBookings();case _FetchOwnerBookingsEvent() when fetchOwnerBookings != null:
return fetchOwnerBookings();case _:
  return null;

}
}

}

/// @nodoc


class _CheckoutEvent implements BookingEvent {
  const _CheckoutEvent({required this.venueId, required this.bookingDate, required final  List<String> slotIds}): _slotIds = slotIds;
  

 final  String venueId;
 final  String bookingDate;
 final  List<String> _slotIds;
 List<String> get slotIds {
  if (_slotIds is EqualUnmodifiableListView) return _slotIds;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_slotIds);
}


/// Create a copy of BookingEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CheckoutEventCopyWith<_CheckoutEvent> get copyWith => __$CheckoutEventCopyWithImpl<_CheckoutEvent>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CheckoutEvent&&(identical(other.venueId, venueId) || other.venueId == venueId)&&(identical(other.bookingDate, bookingDate) || other.bookingDate == bookingDate)&&const DeepCollectionEquality().equals(other._slotIds, _slotIds));
}


@override
int get hashCode => Object.hash(runtimeType,venueId,bookingDate,const DeepCollectionEquality().hash(_slotIds));

@override
String toString() {
  return 'BookingEvent.checkout(venueId: $venueId, bookingDate: $bookingDate, slotIds: $slotIds)';
}


}

/// @nodoc
abstract mixin class _$CheckoutEventCopyWith<$Res> implements $BookingEventCopyWith<$Res> {
  factory _$CheckoutEventCopyWith(_CheckoutEvent value, $Res Function(_CheckoutEvent) _then) = __$CheckoutEventCopyWithImpl;
@useResult
$Res call({
 String venueId, String bookingDate, List<String> slotIds
});




}
/// @nodoc
class __$CheckoutEventCopyWithImpl<$Res>
    implements _$CheckoutEventCopyWith<$Res> {
  __$CheckoutEventCopyWithImpl(this._self, this._then);

  final _CheckoutEvent _self;
  final $Res Function(_CheckoutEvent) _then;

/// Create a copy of BookingEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? venueId = null,Object? bookingDate = null,Object? slotIds = null,}) {
  return _then(_CheckoutEvent(
venueId: null == venueId ? _self.venueId : venueId // ignore: cast_nullable_to_non_nullable
as String,bookingDate: null == bookingDate ? _self.bookingDate : bookingDate // ignore: cast_nullable_to_non_nullable
as String,slotIds: null == slotIds ? _self._slotIds : slotIds // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}


}

/// @nodoc


class _VerifyPaymentEvent implements BookingEvent {
  const _VerifyPaymentEvent({required this.bookingId, required this.razorpayOrderId, required this.razorpayPaymentId, required this.razorpaySignature});
  

 final  String bookingId;
 final  String razorpayOrderId;
 final  String razorpayPaymentId;
 final  String razorpaySignature;

/// Create a copy of BookingEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VerifyPaymentEventCopyWith<_VerifyPaymentEvent> get copyWith => __$VerifyPaymentEventCopyWithImpl<_VerifyPaymentEvent>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VerifyPaymentEvent&&(identical(other.bookingId, bookingId) || other.bookingId == bookingId)&&(identical(other.razorpayOrderId, razorpayOrderId) || other.razorpayOrderId == razorpayOrderId)&&(identical(other.razorpayPaymentId, razorpayPaymentId) || other.razorpayPaymentId == razorpayPaymentId)&&(identical(other.razorpaySignature, razorpaySignature) || other.razorpaySignature == razorpaySignature));
}


@override
int get hashCode => Object.hash(runtimeType,bookingId,razorpayOrderId,razorpayPaymentId,razorpaySignature);

@override
String toString() {
  return 'BookingEvent.verifyPayment(bookingId: $bookingId, razorpayOrderId: $razorpayOrderId, razorpayPaymentId: $razorpayPaymentId, razorpaySignature: $razorpaySignature)';
}


}

/// @nodoc
abstract mixin class _$VerifyPaymentEventCopyWith<$Res> implements $BookingEventCopyWith<$Res> {
  factory _$VerifyPaymentEventCopyWith(_VerifyPaymentEvent value, $Res Function(_VerifyPaymentEvent) _then) = __$VerifyPaymentEventCopyWithImpl;
@useResult
$Res call({
 String bookingId, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature
});




}
/// @nodoc
class __$VerifyPaymentEventCopyWithImpl<$Res>
    implements _$VerifyPaymentEventCopyWith<$Res> {
  __$VerifyPaymentEventCopyWithImpl(this._self, this._then);

  final _VerifyPaymentEvent _self;
  final $Res Function(_VerifyPaymentEvent) _then;

/// Create a copy of BookingEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? bookingId = null,Object? razorpayOrderId = null,Object? razorpayPaymentId = null,Object? razorpaySignature = null,}) {
  return _then(_VerifyPaymentEvent(
bookingId: null == bookingId ? _self.bookingId : bookingId // ignore: cast_nullable_to_non_nullable
as String,razorpayOrderId: null == razorpayOrderId ? _self.razorpayOrderId : razorpayOrderId // ignore: cast_nullable_to_non_nullable
as String,razorpayPaymentId: null == razorpayPaymentId ? _self.razorpayPaymentId : razorpayPaymentId // ignore: cast_nullable_to_non_nullable
as String,razorpaySignature: null == razorpaySignature ? _self.razorpaySignature : razorpaySignature // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

/// @nodoc


class _CancelEvent implements BookingEvent {
  const _CancelEvent({required this.bookingId});
  

 final  String bookingId;

/// Create a copy of BookingEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CancelEventCopyWith<_CancelEvent> get copyWith => __$CancelEventCopyWithImpl<_CancelEvent>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CancelEvent&&(identical(other.bookingId, bookingId) || other.bookingId == bookingId));
}


@override
int get hashCode => Object.hash(runtimeType,bookingId);

@override
String toString() {
  return 'BookingEvent.cancel(bookingId: $bookingId)';
}


}

/// @nodoc
abstract mixin class _$CancelEventCopyWith<$Res> implements $BookingEventCopyWith<$Res> {
  factory _$CancelEventCopyWith(_CancelEvent value, $Res Function(_CancelEvent) _then) = __$CancelEventCopyWithImpl;
@useResult
$Res call({
 String bookingId
});




}
/// @nodoc
class __$CancelEventCopyWithImpl<$Res>
    implements _$CancelEventCopyWith<$Res> {
  __$CancelEventCopyWithImpl(this._self, this._then);

  final _CancelEvent _self;
  final $Res Function(_CancelEvent) _then;

/// Create a copy of BookingEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? bookingId = null,}) {
  return _then(_CancelEvent(
bookingId: null == bookingId ? _self.bookingId : bookingId // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

/// @nodoc


class _FetchMyBookingsEvent implements BookingEvent {
  const _FetchMyBookingsEvent();
  






@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _FetchMyBookingsEvent);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'BookingEvent.fetchMyBookings()';
}


}




/// @nodoc


class _FetchOwnerBookingsEvent implements BookingEvent {
  const _FetchOwnerBookingsEvent();
  






@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _FetchOwnerBookingsEvent);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'BookingEvent.fetchOwnerBookings()';
}


}




/// @nodoc
mixin _$BookingState {





@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is BookingState);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'BookingState()';
}


}

/// @nodoc
class $BookingStateCopyWith<$Res>  {
$BookingStateCopyWith(BookingState _, $Res Function(BookingState) __);
}


/// Adds pattern-matching-related methods to [BookingState].
extension BookingStatePatterns on BookingState {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>({TResult Function( _Initial value)?  initial,TResult Function( _Loading value)?  loading,TResult Function( _CheckoutSuccess value)?  checkoutSuccess,TResult Function( _VerifySuccess value)?  verifySuccess,TResult Function( _CancelSuccess value)?  cancelSuccess,TResult Function( _MyBookingsSuccess value)?  myBookingsSuccess,TResult Function( _OwnerBookingsSuccess value)?  ownerBookingsSuccess,TResult Function( _Failure value)?  failure,required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Initial() when initial != null:
return initial(_that);case _Loading() when loading != null:
return loading(_that);case _CheckoutSuccess() when checkoutSuccess != null:
return checkoutSuccess(_that);case _VerifySuccess() when verifySuccess != null:
return verifySuccess(_that);case _CancelSuccess() when cancelSuccess != null:
return cancelSuccess(_that);case _MyBookingsSuccess() when myBookingsSuccess != null:
return myBookingsSuccess(_that);case _OwnerBookingsSuccess() when ownerBookingsSuccess != null:
return ownerBookingsSuccess(_that);case _Failure() when failure != null:
return failure(_that);case _:
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

@optionalTypeArgs TResult map<TResult extends Object?>({required TResult Function( _Initial value)  initial,required TResult Function( _Loading value)  loading,required TResult Function( _CheckoutSuccess value)  checkoutSuccess,required TResult Function( _VerifySuccess value)  verifySuccess,required TResult Function( _CancelSuccess value)  cancelSuccess,required TResult Function( _MyBookingsSuccess value)  myBookingsSuccess,required TResult Function( _OwnerBookingsSuccess value)  ownerBookingsSuccess,required TResult Function( _Failure value)  failure,}){
final _that = this;
switch (_that) {
case _Initial():
return initial(_that);case _Loading():
return loading(_that);case _CheckoutSuccess():
return checkoutSuccess(_that);case _VerifySuccess():
return verifySuccess(_that);case _CancelSuccess():
return cancelSuccess(_that);case _MyBookingsSuccess():
return myBookingsSuccess(_that);case _OwnerBookingsSuccess():
return ownerBookingsSuccess(_that);case _Failure():
return failure(_that);case _:
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>({TResult? Function( _Initial value)?  initial,TResult? Function( _Loading value)?  loading,TResult? Function( _CheckoutSuccess value)?  checkoutSuccess,TResult? Function( _VerifySuccess value)?  verifySuccess,TResult? Function( _CancelSuccess value)?  cancelSuccess,TResult? Function( _MyBookingsSuccess value)?  myBookingsSuccess,TResult? Function( _OwnerBookingsSuccess value)?  ownerBookingsSuccess,TResult? Function( _Failure value)?  failure,}){
final _that = this;
switch (_that) {
case _Initial() when initial != null:
return initial(_that);case _Loading() when loading != null:
return loading(_that);case _CheckoutSuccess() when checkoutSuccess != null:
return checkoutSuccess(_that);case _VerifySuccess() when verifySuccess != null:
return verifySuccess(_that);case _CancelSuccess() when cancelSuccess != null:
return cancelSuccess(_that);case _MyBookingsSuccess() when myBookingsSuccess != null:
return myBookingsSuccess(_that);case _OwnerBookingsSuccess() when ownerBookingsSuccess != null:
return ownerBookingsSuccess(_that);case _Failure() when failure != null:
return failure(_that);case _:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>({TResult Function()?  initial,TResult Function()?  loading,TResult Function( BookingCheckoutResult result)?  checkoutSuccess,TResult Function( BookingDetailsEntity details,  String message)?  verifySuccess,TResult Function( BookingDetailsEntity details,  String message)?  cancelSuccess,TResult Function( List<BookingDetailsEntity> bookings)?  myBookingsSuccess,TResult Function( List<OwnerBookingDetailsEntity> bookings)?  ownerBookingsSuccess,TResult Function( String message)?  failure,required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Initial() when initial != null:
return initial();case _Loading() when loading != null:
return loading();case _CheckoutSuccess() when checkoutSuccess != null:
return checkoutSuccess(_that.result);case _VerifySuccess() when verifySuccess != null:
return verifySuccess(_that.details,_that.message);case _CancelSuccess() when cancelSuccess != null:
return cancelSuccess(_that.details,_that.message);case _MyBookingsSuccess() when myBookingsSuccess != null:
return myBookingsSuccess(_that.bookings);case _OwnerBookingsSuccess() when ownerBookingsSuccess != null:
return ownerBookingsSuccess(_that.bookings);case _Failure() when failure != null:
return failure(_that.message);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>({required TResult Function()  initial,required TResult Function()  loading,required TResult Function( BookingCheckoutResult result)  checkoutSuccess,required TResult Function( BookingDetailsEntity details,  String message)  verifySuccess,required TResult Function( BookingDetailsEntity details,  String message)  cancelSuccess,required TResult Function( List<BookingDetailsEntity> bookings)  myBookingsSuccess,required TResult Function( List<OwnerBookingDetailsEntity> bookings)  ownerBookingsSuccess,required TResult Function( String message)  failure,}) {final _that = this;
switch (_that) {
case _Initial():
return initial();case _Loading():
return loading();case _CheckoutSuccess():
return checkoutSuccess(_that.result);case _VerifySuccess():
return verifySuccess(_that.details,_that.message);case _CancelSuccess():
return cancelSuccess(_that.details,_that.message);case _MyBookingsSuccess():
return myBookingsSuccess(_that.bookings);case _OwnerBookingsSuccess():
return ownerBookingsSuccess(_that.bookings);case _Failure():
return failure(_that.message);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>({TResult? Function()?  initial,TResult? Function()?  loading,TResult? Function( BookingCheckoutResult result)?  checkoutSuccess,TResult? Function( BookingDetailsEntity details,  String message)?  verifySuccess,TResult? Function( BookingDetailsEntity details,  String message)?  cancelSuccess,TResult? Function( List<BookingDetailsEntity> bookings)?  myBookingsSuccess,TResult? Function( List<OwnerBookingDetailsEntity> bookings)?  ownerBookingsSuccess,TResult? Function( String message)?  failure,}) {final _that = this;
switch (_that) {
case _Initial() when initial != null:
return initial();case _Loading() when loading != null:
return loading();case _CheckoutSuccess() when checkoutSuccess != null:
return checkoutSuccess(_that.result);case _VerifySuccess() when verifySuccess != null:
return verifySuccess(_that.details,_that.message);case _CancelSuccess() when cancelSuccess != null:
return cancelSuccess(_that.details,_that.message);case _MyBookingsSuccess() when myBookingsSuccess != null:
return myBookingsSuccess(_that.bookings);case _OwnerBookingsSuccess() when ownerBookingsSuccess != null:
return ownerBookingsSuccess(_that.bookings);case _Failure() when failure != null:
return failure(_that.message);case _:
  return null;

}
}

}

/// @nodoc


class _Initial implements BookingState {
  const _Initial();
  






@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _Initial);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'BookingState.initial()';
}


}




/// @nodoc


class _Loading implements BookingState {
  const _Loading();
  






@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _Loading);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'BookingState.loading()';
}


}




/// @nodoc


class _CheckoutSuccess implements BookingState {
  const _CheckoutSuccess({required this.result});
  

 final  BookingCheckoutResult result;

/// Create a copy of BookingState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CheckoutSuccessCopyWith<_CheckoutSuccess> get copyWith => __$CheckoutSuccessCopyWithImpl<_CheckoutSuccess>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CheckoutSuccess&&(identical(other.result, result) || other.result == result));
}


@override
int get hashCode => Object.hash(runtimeType,result);

@override
String toString() {
  return 'BookingState.checkoutSuccess(result: $result)';
}


}

/// @nodoc
abstract mixin class _$CheckoutSuccessCopyWith<$Res> implements $BookingStateCopyWith<$Res> {
  factory _$CheckoutSuccessCopyWith(_CheckoutSuccess value, $Res Function(_CheckoutSuccess) _then) = __$CheckoutSuccessCopyWithImpl;
@useResult
$Res call({
 BookingCheckoutResult result
});




}
/// @nodoc
class __$CheckoutSuccessCopyWithImpl<$Res>
    implements _$CheckoutSuccessCopyWith<$Res> {
  __$CheckoutSuccessCopyWithImpl(this._self, this._then);

  final _CheckoutSuccess _self;
  final $Res Function(_CheckoutSuccess) _then;

/// Create a copy of BookingState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? result = null,}) {
  return _then(_CheckoutSuccess(
result: null == result ? _self.result : result // ignore: cast_nullable_to_non_nullable
as BookingCheckoutResult,
  ));
}


}

/// @nodoc


class _VerifySuccess implements BookingState {
  const _VerifySuccess({required this.details, required this.message});
  

 final  BookingDetailsEntity details;
 final  String message;

/// Create a copy of BookingState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VerifySuccessCopyWith<_VerifySuccess> get copyWith => __$VerifySuccessCopyWithImpl<_VerifySuccess>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VerifySuccess&&(identical(other.details, details) || other.details == details)&&(identical(other.message, message) || other.message == message));
}


@override
int get hashCode => Object.hash(runtimeType,details,message);

@override
String toString() {
  return 'BookingState.verifySuccess(details: $details, message: $message)';
}


}

/// @nodoc
abstract mixin class _$VerifySuccessCopyWith<$Res> implements $BookingStateCopyWith<$Res> {
  factory _$VerifySuccessCopyWith(_VerifySuccess value, $Res Function(_VerifySuccess) _then) = __$VerifySuccessCopyWithImpl;
@useResult
$Res call({
 BookingDetailsEntity details, String message
});




}
/// @nodoc
class __$VerifySuccessCopyWithImpl<$Res>
    implements _$VerifySuccessCopyWith<$Res> {
  __$VerifySuccessCopyWithImpl(this._self, this._then);

  final _VerifySuccess _self;
  final $Res Function(_VerifySuccess) _then;

/// Create a copy of BookingState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? details = null,Object? message = null,}) {
  return _then(_VerifySuccess(
details: null == details ? _self.details : details // ignore: cast_nullable_to_non_nullable
as BookingDetailsEntity,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

/// @nodoc


class _CancelSuccess implements BookingState {
  const _CancelSuccess({required this.details, required this.message});
  

 final  BookingDetailsEntity details;
 final  String message;

/// Create a copy of BookingState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CancelSuccessCopyWith<_CancelSuccess> get copyWith => __$CancelSuccessCopyWithImpl<_CancelSuccess>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CancelSuccess&&(identical(other.details, details) || other.details == details)&&(identical(other.message, message) || other.message == message));
}


@override
int get hashCode => Object.hash(runtimeType,details,message);

@override
String toString() {
  return 'BookingState.cancelSuccess(details: $details, message: $message)';
}


}

/// @nodoc
abstract mixin class _$CancelSuccessCopyWith<$Res> implements $BookingStateCopyWith<$Res> {
  factory _$CancelSuccessCopyWith(_CancelSuccess value, $Res Function(_CancelSuccess) _then) = __$CancelSuccessCopyWithImpl;
@useResult
$Res call({
 BookingDetailsEntity details, String message
});




}
/// @nodoc
class __$CancelSuccessCopyWithImpl<$Res>
    implements _$CancelSuccessCopyWith<$Res> {
  __$CancelSuccessCopyWithImpl(this._self, this._then);

  final _CancelSuccess _self;
  final $Res Function(_CancelSuccess) _then;

/// Create a copy of BookingState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? details = null,Object? message = null,}) {
  return _then(_CancelSuccess(
details: null == details ? _self.details : details // ignore: cast_nullable_to_non_nullable
as BookingDetailsEntity,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

/// @nodoc


class _MyBookingsSuccess implements BookingState {
  const _MyBookingsSuccess({required final  List<BookingDetailsEntity> bookings}): _bookings = bookings;
  

 final  List<BookingDetailsEntity> _bookings;
 List<BookingDetailsEntity> get bookings {
  if (_bookings is EqualUnmodifiableListView) return _bookings;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_bookings);
}


/// Create a copy of BookingState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$MyBookingsSuccessCopyWith<_MyBookingsSuccess> get copyWith => __$MyBookingsSuccessCopyWithImpl<_MyBookingsSuccess>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _MyBookingsSuccess&&const DeepCollectionEquality().equals(other._bookings, _bookings));
}


@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(_bookings));

@override
String toString() {
  return 'BookingState.myBookingsSuccess(bookings: $bookings)';
}


}

/// @nodoc
abstract mixin class _$MyBookingsSuccessCopyWith<$Res> implements $BookingStateCopyWith<$Res> {
  factory _$MyBookingsSuccessCopyWith(_MyBookingsSuccess value, $Res Function(_MyBookingsSuccess) _then) = __$MyBookingsSuccessCopyWithImpl;
@useResult
$Res call({
 List<BookingDetailsEntity> bookings
});




}
/// @nodoc
class __$MyBookingsSuccessCopyWithImpl<$Res>
    implements _$MyBookingsSuccessCopyWith<$Res> {
  __$MyBookingsSuccessCopyWithImpl(this._self, this._then);

  final _MyBookingsSuccess _self;
  final $Res Function(_MyBookingsSuccess) _then;

/// Create a copy of BookingState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? bookings = null,}) {
  return _then(_MyBookingsSuccess(
bookings: null == bookings ? _self._bookings : bookings // ignore: cast_nullable_to_non_nullable
as List<BookingDetailsEntity>,
  ));
}


}

/// @nodoc


class _OwnerBookingsSuccess implements BookingState {
  const _OwnerBookingsSuccess({required final  List<OwnerBookingDetailsEntity> bookings}): _bookings = bookings;
  

 final  List<OwnerBookingDetailsEntity> _bookings;
 List<OwnerBookingDetailsEntity> get bookings {
  if (_bookings is EqualUnmodifiableListView) return _bookings;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_bookings);
}


/// Create a copy of BookingState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OwnerBookingsSuccessCopyWith<_OwnerBookingsSuccess> get copyWith => __$OwnerBookingsSuccessCopyWithImpl<_OwnerBookingsSuccess>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _OwnerBookingsSuccess&&const DeepCollectionEquality().equals(other._bookings, _bookings));
}


@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(_bookings));

@override
String toString() {
  return 'BookingState.ownerBookingsSuccess(bookings: $bookings)';
}


}

/// @nodoc
abstract mixin class _$OwnerBookingsSuccessCopyWith<$Res> implements $BookingStateCopyWith<$Res> {
  factory _$OwnerBookingsSuccessCopyWith(_OwnerBookingsSuccess value, $Res Function(_OwnerBookingsSuccess) _then) = __$OwnerBookingsSuccessCopyWithImpl;
@useResult
$Res call({
 List<OwnerBookingDetailsEntity> bookings
});




}
/// @nodoc
class __$OwnerBookingsSuccessCopyWithImpl<$Res>
    implements _$OwnerBookingsSuccessCopyWith<$Res> {
  __$OwnerBookingsSuccessCopyWithImpl(this._self, this._then);

  final _OwnerBookingsSuccess _self;
  final $Res Function(_OwnerBookingsSuccess) _then;

/// Create a copy of BookingState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? bookings = null,}) {
  return _then(_OwnerBookingsSuccess(
bookings: null == bookings ? _self._bookings : bookings // ignore: cast_nullable_to_non_nullable
as List<OwnerBookingDetailsEntity>,
  ));
}


}

/// @nodoc


class _Failure implements BookingState {
  const _Failure({required this.message});
  

 final  String message;

/// Create a copy of BookingState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FailureCopyWith<_Failure> get copyWith => __$FailureCopyWithImpl<_Failure>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _Failure&&(identical(other.message, message) || other.message == message));
}


@override
int get hashCode => Object.hash(runtimeType,message);

@override
String toString() {
  return 'BookingState.failure(message: $message)';
}


}

/// @nodoc
abstract mixin class _$FailureCopyWith<$Res> implements $BookingStateCopyWith<$Res> {
  factory _$FailureCopyWith(_Failure value, $Res Function(_Failure) _then) = __$FailureCopyWithImpl;
@useResult
$Res call({
 String message
});




}
/// @nodoc
class __$FailureCopyWithImpl<$Res>
    implements _$FailureCopyWith<$Res> {
  __$FailureCopyWithImpl(this._self, this._then);

  final _Failure _self;
  final $Res Function(_Failure) _then;

/// Create a copy of BookingState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? message = null,}) {
  return _then(_Failure(
message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
