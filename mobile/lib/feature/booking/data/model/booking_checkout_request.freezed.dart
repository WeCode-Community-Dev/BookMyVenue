// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'booking_checkout_request.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$BookingCheckoutRequest {

@JsonKey(name: 'venue_id') String get venueId;@JsonKey(name: 'booking_date') String get bookingDate;@JsonKey(name: 'slot_ids') List<String> get slotIds;
/// Create a copy of BookingCheckoutRequest
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$BookingCheckoutRequestCopyWith<BookingCheckoutRequest> get copyWith => _$BookingCheckoutRequestCopyWithImpl<BookingCheckoutRequest>(this as BookingCheckoutRequest, _$identity);

  /// Serializes this BookingCheckoutRequest to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is BookingCheckoutRequest&&(identical(other.venueId, venueId) || other.venueId == venueId)&&(identical(other.bookingDate, bookingDate) || other.bookingDate == bookingDate)&&const DeepCollectionEquality().equals(other.slotIds, slotIds));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,venueId,bookingDate,const DeepCollectionEquality().hash(slotIds));

@override
String toString() {
  return 'BookingCheckoutRequest(venueId: $venueId, bookingDate: $bookingDate, slotIds: $slotIds)';
}


}

/// @nodoc
abstract mixin class $BookingCheckoutRequestCopyWith<$Res>  {
  factory $BookingCheckoutRequestCopyWith(BookingCheckoutRequest value, $Res Function(BookingCheckoutRequest) _then) = _$BookingCheckoutRequestCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'venue_id') String venueId,@JsonKey(name: 'booking_date') String bookingDate,@JsonKey(name: 'slot_ids') List<String> slotIds
});




}
/// @nodoc
class _$BookingCheckoutRequestCopyWithImpl<$Res>
    implements $BookingCheckoutRequestCopyWith<$Res> {
  _$BookingCheckoutRequestCopyWithImpl(this._self, this._then);

  final BookingCheckoutRequest _self;
  final $Res Function(BookingCheckoutRequest) _then;

/// Create a copy of BookingCheckoutRequest
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? venueId = null,Object? bookingDate = null,Object? slotIds = null,}) {
  return _then(_self.copyWith(
venueId: null == venueId ? _self.venueId : venueId // ignore: cast_nullable_to_non_nullable
as String,bookingDate: null == bookingDate ? _self.bookingDate : bookingDate // ignore: cast_nullable_to_non_nullable
as String,slotIds: null == slotIds ? _self.slotIds : slotIds // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}

}


/// Adds pattern-matching-related methods to [BookingCheckoutRequest].
extension BookingCheckoutRequestPatterns on BookingCheckoutRequest {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _BookingCheckoutRequest value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _BookingCheckoutRequest() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _BookingCheckoutRequest value)  $default,){
final _that = this;
switch (_that) {
case _BookingCheckoutRequest():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _BookingCheckoutRequest value)?  $default,){
final _that = this;
switch (_that) {
case _BookingCheckoutRequest() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'venue_id')  String venueId, @JsonKey(name: 'booking_date')  String bookingDate, @JsonKey(name: 'slot_ids')  List<String> slotIds)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _BookingCheckoutRequest() when $default != null:
return $default(_that.venueId,_that.bookingDate,_that.slotIds);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'venue_id')  String venueId, @JsonKey(name: 'booking_date')  String bookingDate, @JsonKey(name: 'slot_ids')  List<String> slotIds)  $default,) {final _that = this;
switch (_that) {
case _BookingCheckoutRequest():
return $default(_that.venueId,_that.bookingDate,_that.slotIds);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'venue_id')  String venueId, @JsonKey(name: 'booking_date')  String bookingDate, @JsonKey(name: 'slot_ids')  List<String> slotIds)?  $default,) {final _that = this;
switch (_that) {
case _BookingCheckoutRequest() when $default != null:
return $default(_that.venueId,_that.bookingDate,_that.slotIds);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _BookingCheckoutRequest implements BookingCheckoutRequest {
  const _BookingCheckoutRequest({@JsonKey(name: 'venue_id') required this.venueId, @JsonKey(name: 'booking_date') required this.bookingDate, @JsonKey(name: 'slot_ids') required final  List<String> slotIds}): _slotIds = slotIds;
  factory _BookingCheckoutRequest.fromJson(Map<String, dynamic> json) => _$BookingCheckoutRequestFromJson(json);

@override@JsonKey(name: 'venue_id') final  String venueId;
@override@JsonKey(name: 'booking_date') final  String bookingDate;
 final  List<String> _slotIds;
@override@JsonKey(name: 'slot_ids') List<String> get slotIds {
  if (_slotIds is EqualUnmodifiableListView) return _slotIds;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_slotIds);
}


/// Create a copy of BookingCheckoutRequest
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$BookingCheckoutRequestCopyWith<_BookingCheckoutRequest> get copyWith => __$BookingCheckoutRequestCopyWithImpl<_BookingCheckoutRequest>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$BookingCheckoutRequestToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _BookingCheckoutRequest&&(identical(other.venueId, venueId) || other.venueId == venueId)&&(identical(other.bookingDate, bookingDate) || other.bookingDate == bookingDate)&&const DeepCollectionEquality().equals(other._slotIds, _slotIds));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,venueId,bookingDate,const DeepCollectionEquality().hash(_slotIds));

@override
String toString() {
  return 'BookingCheckoutRequest(venueId: $venueId, bookingDate: $bookingDate, slotIds: $slotIds)';
}


}

/// @nodoc
abstract mixin class _$BookingCheckoutRequestCopyWith<$Res> implements $BookingCheckoutRequestCopyWith<$Res> {
  factory _$BookingCheckoutRequestCopyWith(_BookingCheckoutRequest value, $Res Function(_BookingCheckoutRequest) _then) = __$BookingCheckoutRequestCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'venue_id') String venueId,@JsonKey(name: 'booking_date') String bookingDate,@JsonKey(name: 'slot_ids') List<String> slotIds
});




}
/// @nodoc
class __$BookingCheckoutRequestCopyWithImpl<$Res>
    implements _$BookingCheckoutRequestCopyWith<$Res> {
  __$BookingCheckoutRequestCopyWithImpl(this._self, this._then);

  final _BookingCheckoutRequest _self;
  final $Res Function(_BookingCheckoutRequest) _then;

/// Create a copy of BookingCheckoutRequest
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? venueId = null,Object? bookingDate = null,Object? slotIds = null,}) {
  return _then(_BookingCheckoutRequest(
venueId: null == venueId ? _self.venueId : venueId // ignore: cast_nullable_to_non_nullable
as String,bookingDate: null == bookingDate ? _self.bookingDate : bookingDate // ignore: cast_nullable_to_non_nullable
as String,slotIds: null == slotIds ? _self._slotIds : slotIds // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}


}

// dart format on
