// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'booking_verify_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$BookingVerifyResponse {

 String get id;@JsonKey(name: 'venue_id') String get venueId;@JsonKey(name: 'venue_name') String get venueName;@JsonKey(name: 'booking_date') String get bookingDate; String get status; double get amount;@JsonKey(name: 'lock_expires_at') String get lockExpiresAt;@JsonKey(name: 'created_at') String get createdAt; List<BookingVerifySlotResponse> get slots;
/// Create a copy of BookingVerifyResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$BookingVerifyResponseCopyWith<BookingVerifyResponse> get copyWith => _$BookingVerifyResponseCopyWithImpl<BookingVerifyResponse>(this as BookingVerifyResponse, _$identity);

  /// Serializes this BookingVerifyResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is BookingVerifyResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.venueId, venueId) || other.venueId == venueId)&&(identical(other.venueName, venueName) || other.venueName == venueName)&&(identical(other.bookingDate, bookingDate) || other.bookingDate == bookingDate)&&(identical(other.status, status) || other.status == status)&&(identical(other.amount, amount) || other.amount == amount)&&(identical(other.lockExpiresAt, lockExpiresAt) || other.lockExpiresAt == lockExpiresAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&const DeepCollectionEquality().equals(other.slots, slots));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,venueId,venueName,bookingDate,status,amount,lockExpiresAt,createdAt,const DeepCollectionEquality().hash(slots));

@override
String toString() {
  return 'BookingVerifyResponse(id: $id, venueId: $venueId, venueName: $venueName, bookingDate: $bookingDate, status: $status, amount: $amount, lockExpiresAt: $lockExpiresAt, createdAt: $createdAt, slots: $slots)';
}


}

/// @nodoc
abstract mixin class $BookingVerifyResponseCopyWith<$Res>  {
  factory $BookingVerifyResponseCopyWith(BookingVerifyResponse value, $Res Function(BookingVerifyResponse) _then) = _$BookingVerifyResponseCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'venue_id') String venueId,@JsonKey(name: 'venue_name') String venueName,@JsonKey(name: 'booking_date') String bookingDate, String status, double amount,@JsonKey(name: 'lock_expires_at') String lockExpiresAt,@JsonKey(name: 'created_at') String createdAt, List<BookingVerifySlotResponse> slots
});




}
/// @nodoc
class _$BookingVerifyResponseCopyWithImpl<$Res>
    implements $BookingVerifyResponseCopyWith<$Res> {
  _$BookingVerifyResponseCopyWithImpl(this._self, this._then);

  final BookingVerifyResponse _self;
  final $Res Function(BookingVerifyResponse) _then;

/// Create a copy of BookingVerifyResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? venueId = null,Object? venueName = null,Object? bookingDate = null,Object? status = null,Object? amount = null,Object? lockExpiresAt = null,Object? createdAt = null,Object? slots = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,venueId: null == venueId ? _self.venueId : venueId // ignore: cast_nullable_to_non_nullable
as String,venueName: null == venueName ? _self.venueName : venueName // ignore: cast_nullable_to_non_nullable
as String,bookingDate: null == bookingDate ? _self.bookingDate : bookingDate // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,amount: null == amount ? _self.amount : amount // ignore: cast_nullable_to_non_nullable
as double,lockExpiresAt: null == lockExpiresAt ? _self.lockExpiresAt : lockExpiresAt // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,slots: null == slots ? _self.slots : slots // ignore: cast_nullable_to_non_nullable
as List<BookingVerifySlotResponse>,
  ));
}

}


/// Adds pattern-matching-related methods to [BookingVerifyResponse].
extension BookingVerifyResponsePatterns on BookingVerifyResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _BookingVerifyResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _BookingVerifyResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _BookingVerifyResponse value)  $default,){
final _that = this;
switch (_that) {
case _BookingVerifyResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _BookingVerifyResponse value)?  $default,){
final _that = this;
switch (_that) {
case _BookingVerifyResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'venue_id')  String venueId, @JsonKey(name: 'venue_name')  String venueName, @JsonKey(name: 'booking_date')  String bookingDate,  String status,  double amount, @JsonKey(name: 'lock_expires_at')  String lockExpiresAt, @JsonKey(name: 'created_at')  String createdAt,  List<BookingVerifySlotResponse> slots)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _BookingVerifyResponse() when $default != null:
return $default(_that.id,_that.venueId,_that.venueName,_that.bookingDate,_that.status,_that.amount,_that.lockExpiresAt,_that.createdAt,_that.slots);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'venue_id')  String venueId, @JsonKey(name: 'venue_name')  String venueName, @JsonKey(name: 'booking_date')  String bookingDate,  String status,  double amount, @JsonKey(name: 'lock_expires_at')  String lockExpiresAt, @JsonKey(name: 'created_at')  String createdAt,  List<BookingVerifySlotResponse> slots)  $default,) {final _that = this;
switch (_that) {
case _BookingVerifyResponse():
return $default(_that.id,_that.venueId,_that.venueName,_that.bookingDate,_that.status,_that.amount,_that.lockExpiresAt,_that.createdAt,_that.slots);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'venue_id')  String venueId, @JsonKey(name: 'venue_name')  String venueName, @JsonKey(name: 'booking_date')  String bookingDate,  String status,  double amount, @JsonKey(name: 'lock_expires_at')  String lockExpiresAt, @JsonKey(name: 'created_at')  String createdAt,  List<BookingVerifySlotResponse> slots)?  $default,) {final _that = this;
switch (_that) {
case _BookingVerifyResponse() when $default != null:
return $default(_that.id,_that.venueId,_that.venueName,_that.bookingDate,_that.status,_that.amount,_that.lockExpiresAt,_that.createdAt,_that.slots);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _BookingVerifyResponse implements BookingVerifyResponse {
  const _BookingVerifyResponse({required this.id, @JsonKey(name: 'venue_id') required this.venueId, @JsonKey(name: 'venue_name') required this.venueName, @JsonKey(name: 'booking_date') required this.bookingDate, required this.status, required this.amount, @JsonKey(name: 'lock_expires_at') required this.lockExpiresAt, @JsonKey(name: 'created_at') required this.createdAt, required final  List<BookingVerifySlotResponse> slots}): _slots = slots;
  factory _BookingVerifyResponse.fromJson(Map<String, dynamic> json) => _$BookingVerifyResponseFromJson(json);

@override final  String id;
@override@JsonKey(name: 'venue_id') final  String venueId;
@override@JsonKey(name: 'venue_name') final  String venueName;
@override@JsonKey(name: 'booking_date') final  String bookingDate;
@override final  String status;
@override final  double amount;
@override@JsonKey(name: 'lock_expires_at') final  String lockExpiresAt;
@override@JsonKey(name: 'created_at') final  String createdAt;
 final  List<BookingVerifySlotResponse> _slots;
@override List<BookingVerifySlotResponse> get slots {
  if (_slots is EqualUnmodifiableListView) return _slots;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_slots);
}


/// Create a copy of BookingVerifyResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$BookingVerifyResponseCopyWith<_BookingVerifyResponse> get copyWith => __$BookingVerifyResponseCopyWithImpl<_BookingVerifyResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$BookingVerifyResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _BookingVerifyResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.venueId, venueId) || other.venueId == venueId)&&(identical(other.venueName, venueName) || other.venueName == venueName)&&(identical(other.bookingDate, bookingDate) || other.bookingDate == bookingDate)&&(identical(other.status, status) || other.status == status)&&(identical(other.amount, amount) || other.amount == amount)&&(identical(other.lockExpiresAt, lockExpiresAt) || other.lockExpiresAt == lockExpiresAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&const DeepCollectionEquality().equals(other._slots, _slots));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,venueId,venueName,bookingDate,status,amount,lockExpiresAt,createdAt,const DeepCollectionEquality().hash(_slots));

@override
String toString() {
  return 'BookingVerifyResponse(id: $id, venueId: $venueId, venueName: $venueName, bookingDate: $bookingDate, status: $status, amount: $amount, lockExpiresAt: $lockExpiresAt, createdAt: $createdAt, slots: $slots)';
}


}

/// @nodoc
abstract mixin class _$BookingVerifyResponseCopyWith<$Res> implements $BookingVerifyResponseCopyWith<$Res> {
  factory _$BookingVerifyResponseCopyWith(_BookingVerifyResponse value, $Res Function(_BookingVerifyResponse) _then) = __$BookingVerifyResponseCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'venue_id') String venueId,@JsonKey(name: 'venue_name') String venueName,@JsonKey(name: 'booking_date') String bookingDate, String status, double amount,@JsonKey(name: 'lock_expires_at') String lockExpiresAt,@JsonKey(name: 'created_at') String createdAt, List<BookingVerifySlotResponse> slots
});




}
/// @nodoc
class __$BookingVerifyResponseCopyWithImpl<$Res>
    implements _$BookingVerifyResponseCopyWith<$Res> {
  __$BookingVerifyResponseCopyWithImpl(this._self, this._then);

  final _BookingVerifyResponse _self;
  final $Res Function(_BookingVerifyResponse) _then;

/// Create a copy of BookingVerifyResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? venueId = null,Object? venueName = null,Object? bookingDate = null,Object? status = null,Object? amount = null,Object? lockExpiresAt = null,Object? createdAt = null,Object? slots = null,}) {
  return _then(_BookingVerifyResponse(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,venueId: null == venueId ? _self.venueId : venueId // ignore: cast_nullable_to_non_nullable
as String,venueName: null == venueName ? _self.venueName : venueName // ignore: cast_nullable_to_non_nullable
as String,bookingDate: null == bookingDate ? _self.bookingDate : bookingDate // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,amount: null == amount ? _self.amount : amount // ignore: cast_nullable_to_non_nullable
as double,lockExpiresAt: null == lockExpiresAt ? _self.lockExpiresAt : lockExpiresAt // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,slots: null == slots ? _self._slots : slots // ignore: cast_nullable_to_non_nullable
as List<BookingVerifySlotResponse>,
  ));
}


}


/// @nodoc
mixin _$BookingVerifySlotResponse {

 String get id;@JsonKey(name: 'slot_name') String get slotName;@JsonKey(name: 'start_time') String get startTime;@JsonKey(name: 'end_time') String get endTime; double get price;
/// Create a copy of BookingVerifySlotResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$BookingVerifySlotResponseCopyWith<BookingVerifySlotResponse> get copyWith => _$BookingVerifySlotResponseCopyWithImpl<BookingVerifySlotResponse>(this as BookingVerifySlotResponse, _$identity);

  /// Serializes this BookingVerifySlotResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is BookingVerifySlotResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.slotName, slotName) || other.slotName == slotName)&&(identical(other.startTime, startTime) || other.startTime == startTime)&&(identical(other.endTime, endTime) || other.endTime == endTime)&&(identical(other.price, price) || other.price == price));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,slotName,startTime,endTime,price);

@override
String toString() {
  return 'BookingVerifySlotResponse(id: $id, slotName: $slotName, startTime: $startTime, endTime: $endTime, price: $price)';
}


}

/// @nodoc
abstract mixin class $BookingVerifySlotResponseCopyWith<$Res>  {
  factory $BookingVerifySlotResponseCopyWith(BookingVerifySlotResponse value, $Res Function(BookingVerifySlotResponse) _then) = _$BookingVerifySlotResponseCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'slot_name') String slotName,@JsonKey(name: 'start_time') String startTime,@JsonKey(name: 'end_time') String endTime, double price
});




}
/// @nodoc
class _$BookingVerifySlotResponseCopyWithImpl<$Res>
    implements $BookingVerifySlotResponseCopyWith<$Res> {
  _$BookingVerifySlotResponseCopyWithImpl(this._self, this._then);

  final BookingVerifySlotResponse _self;
  final $Res Function(BookingVerifySlotResponse) _then;

/// Create a copy of BookingVerifySlotResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? slotName = null,Object? startTime = null,Object? endTime = null,Object? price = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,slotName: null == slotName ? _self.slotName : slotName // ignore: cast_nullable_to_non_nullable
as String,startTime: null == startTime ? _self.startTime : startTime // ignore: cast_nullable_to_non_nullable
as String,endTime: null == endTime ? _self.endTime : endTime // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [BookingVerifySlotResponse].
extension BookingVerifySlotResponsePatterns on BookingVerifySlotResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _BookingVerifySlotResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _BookingVerifySlotResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _BookingVerifySlotResponse value)  $default,){
final _that = this;
switch (_that) {
case _BookingVerifySlotResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _BookingVerifySlotResponse value)?  $default,){
final _that = this;
switch (_that) {
case _BookingVerifySlotResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'slot_name')  String slotName, @JsonKey(name: 'start_time')  String startTime, @JsonKey(name: 'end_time')  String endTime,  double price)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _BookingVerifySlotResponse() when $default != null:
return $default(_that.id,_that.slotName,_that.startTime,_that.endTime,_that.price);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'slot_name')  String slotName, @JsonKey(name: 'start_time')  String startTime, @JsonKey(name: 'end_time')  String endTime,  double price)  $default,) {final _that = this;
switch (_that) {
case _BookingVerifySlotResponse():
return $default(_that.id,_that.slotName,_that.startTime,_that.endTime,_that.price);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'slot_name')  String slotName, @JsonKey(name: 'start_time')  String startTime, @JsonKey(name: 'end_time')  String endTime,  double price)?  $default,) {final _that = this;
switch (_that) {
case _BookingVerifySlotResponse() when $default != null:
return $default(_that.id,_that.slotName,_that.startTime,_that.endTime,_that.price);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _BookingVerifySlotResponse implements BookingVerifySlotResponse {
  const _BookingVerifySlotResponse({required this.id, @JsonKey(name: 'slot_name') required this.slotName, @JsonKey(name: 'start_time') required this.startTime, @JsonKey(name: 'end_time') required this.endTime, required this.price});
  factory _BookingVerifySlotResponse.fromJson(Map<String, dynamic> json) => _$BookingVerifySlotResponseFromJson(json);

@override final  String id;
@override@JsonKey(name: 'slot_name') final  String slotName;
@override@JsonKey(name: 'start_time') final  String startTime;
@override@JsonKey(name: 'end_time') final  String endTime;
@override final  double price;

/// Create a copy of BookingVerifySlotResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$BookingVerifySlotResponseCopyWith<_BookingVerifySlotResponse> get copyWith => __$BookingVerifySlotResponseCopyWithImpl<_BookingVerifySlotResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$BookingVerifySlotResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _BookingVerifySlotResponse&&(identical(other.id, id) || other.id == id)&&(identical(other.slotName, slotName) || other.slotName == slotName)&&(identical(other.startTime, startTime) || other.startTime == startTime)&&(identical(other.endTime, endTime) || other.endTime == endTime)&&(identical(other.price, price) || other.price == price));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,slotName,startTime,endTime,price);

@override
String toString() {
  return 'BookingVerifySlotResponse(id: $id, slotName: $slotName, startTime: $startTime, endTime: $endTime, price: $price)';
}


}

/// @nodoc
abstract mixin class _$BookingVerifySlotResponseCopyWith<$Res> implements $BookingVerifySlotResponseCopyWith<$Res> {
  factory _$BookingVerifySlotResponseCopyWith(_BookingVerifySlotResponse value, $Res Function(_BookingVerifySlotResponse) _then) = __$BookingVerifySlotResponseCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'slot_name') String slotName,@JsonKey(name: 'start_time') String startTime,@JsonKey(name: 'end_time') String endTime, double price
});




}
/// @nodoc
class __$BookingVerifySlotResponseCopyWithImpl<$Res>
    implements _$BookingVerifySlotResponseCopyWith<$Res> {
  __$BookingVerifySlotResponseCopyWithImpl(this._self, this._then);

  final _BookingVerifySlotResponse _self;
  final $Res Function(_BookingVerifySlotResponse) _then;

/// Create a copy of BookingVerifySlotResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? slotName = null,Object? startTime = null,Object? endTime = null,Object? price = null,}) {
  return _then(_BookingVerifySlotResponse(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,slotName: null == slotName ? _self.slotName : slotName // ignore: cast_nullable_to_non_nullable
as String,startTime: null == startTime ? _self.startTime : startTime // ignore: cast_nullable_to_non_nullable
as String,endTime: null == endTime ? _self.endTime : endTime // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}

// dart format on
