// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user_venue_bloc.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$UserVenueEvent {

 bool get isRefresh;
/// Create a copy of UserVenueEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserVenueEventCopyWith<UserVenueEvent> get copyWith => _$UserVenueEventCopyWithImpl<UserVenueEvent>(this as UserVenueEvent, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserVenueEvent&&(identical(other.isRefresh, isRefresh) || other.isRefresh == isRefresh));
}


@override
int get hashCode => Object.hash(runtimeType,isRefresh);

@override
String toString() {
  return 'UserVenueEvent(isRefresh: $isRefresh)';
}


}

/// @nodoc
abstract mixin class $UserVenueEventCopyWith<$Res>  {
  factory $UserVenueEventCopyWith(UserVenueEvent value, $Res Function(UserVenueEvent) _then) = _$UserVenueEventCopyWithImpl;
@useResult
$Res call({
 bool isRefresh
});




}
/// @nodoc
class _$UserVenueEventCopyWithImpl<$Res>
    implements $UserVenueEventCopyWith<$Res> {
  _$UserVenueEventCopyWithImpl(this._self, this._then);

  final UserVenueEvent _self;
  final $Res Function(UserVenueEvent) _then;

/// Create a copy of UserVenueEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? isRefresh = null,}) {
  return _then(_self.copyWith(
isRefresh: null == isRefresh ? _self.isRefresh : isRefresh // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [UserVenueEvent].
extension UserVenueEventPatterns on UserVenueEvent {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>({TResult Function( _GetUserVenues value)?  getUserVenues,required TResult orElse(),}){
final _that = this;
switch (_that) {
case _GetUserVenues() when getUserVenues != null:
return getUserVenues(_that);case _:
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

@optionalTypeArgs TResult map<TResult extends Object?>({required TResult Function( _GetUserVenues value)  getUserVenues,}){
final _that = this;
switch (_that) {
case _GetUserVenues():
return getUserVenues(_that);case _:
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>({TResult? Function( _GetUserVenues value)?  getUserVenues,}){
final _that = this;
switch (_that) {
case _GetUserVenues() when getUserVenues != null:
return getUserVenues(_that);case _:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>({TResult Function( bool isRefresh)?  getUserVenues,required TResult orElse(),}) {final _that = this;
switch (_that) {
case _GetUserVenues() when getUserVenues != null:
return getUserVenues(_that.isRefresh);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>({required TResult Function( bool isRefresh)  getUserVenues,}) {final _that = this;
switch (_that) {
case _GetUserVenues():
return getUserVenues(_that.isRefresh);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>({TResult? Function( bool isRefresh)?  getUserVenues,}) {final _that = this;
switch (_that) {
case _GetUserVenues() when getUserVenues != null:
return getUserVenues(_that.isRefresh);case _:
  return null;

}
}

}

/// @nodoc


class _GetUserVenues implements UserVenueEvent {
  const _GetUserVenues({this.isRefresh = false});
  

@override@JsonKey() final  bool isRefresh;

/// Create a copy of UserVenueEvent
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$GetUserVenuesCopyWith<_GetUserVenues> get copyWith => __$GetUserVenuesCopyWithImpl<_GetUserVenues>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _GetUserVenues&&(identical(other.isRefresh, isRefresh) || other.isRefresh == isRefresh));
}


@override
int get hashCode => Object.hash(runtimeType,isRefresh);

@override
String toString() {
  return 'UserVenueEvent.getUserVenues(isRefresh: $isRefresh)';
}


}

/// @nodoc
abstract mixin class _$GetUserVenuesCopyWith<$Res> implements $UserVenueEventCopyWith<$Res> {
  factory _$GetUserVenuesCopyWith(_GetUserVenues value, $Res Function(_GetUserVenues) _then) = __$GetUserVenuesCopyWithImpl;
@override @useResult
$Res call({
 bool isRefresh
});




}
/// @nodoc
class __$GetUserVenuesCopyWithImpl<$Res>
    implements _$GetUserVenuesCopyWith<$Res> {
  __$GetUserVenuesCopyWithImpl(this._self, this._then);

  final _GetUserVenues _self;
  final $Res Function(_GetUserVenues) _then;

/// Create a copy of UserVenueEvent
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? isRefresh = null,}) {
  return _then(_GetUserVenues(
isRefresh: null == isRefresh ? _self.isRefresh : isRefresh // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}

/// @nodoc
mixin _$UserVenueState {

 UserVenueStatus get status; List<UserVenueEntity> get venues; int get skip; bool get hasReachedMax; String? get successMessage; String? get errorMessage;
/// Create a copy of UserVenueState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserVenueStateCopyWith<UserVenueState> get copyWith => _$UserVenueStateCopyWithImpl<UserVenueState>(this as UserVenueState, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserVenueState&&(identical(other.status, status) || other.status == status)&&const DeepCollectionEquality().equals(other.venues, venues)&&(identical(other.skip, skip) || other.skip == skip)&&(identical(other.hasReachedMax, hasReachedMax) || other.hasReachedMax == hasReachedMax)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage));
}


@override
int get hashCode => Object.hash(runtimeType,status,const DeepCollectionEquality().hash(venues),skip,hasReachedMax,successMessage,errorMessage);

@override
String toString() {
  return 'UserVenueState(status: $status, venues: $venues, skip: $skip, hasReachedMax: $hasReachedMax, successMessage: $successMessage, errorMessage: $errorMessage)';
}


}

/// @nodoc
abstract mixin class $UserVenueStateCopyWith<$Res>  {
  factory $UserVenueStateCopyWith(UserVenueState value, $Res Function(UserVenueState) _then) = _$UserVenueStateCopyWithImpl;
@useResult
$Res call({
 UserVenueStatus status, List<UserVenueEntity> venues, int skip, bool hasReachedMax, String? successMessage, String? errorMessage
});




}
/// @nodoc
class _$UserVenueStateCopyWithImpl<$Res>
    implements $UserVenueStateCopyWith<$Res> {
  _$UserVenueStateCopyWithImpl(this._self, this._then);

  final UserVenueState _self;
  final $Res Function(UserVenueState) _then;

/// Create a copy of UserVenueState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? status = null,Object? venues = null,Object? skip = null,Object? hasReachedMax = null,Object? successMessage = freezed,Object? errorMessage = freezed,}) {
  return _then(_self.copyWith(
status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as UserVenueStatus,venues: null == venues ? _self.venues : venues // ignore: cast_nullable_to_non_nullable
as List<UserVenueEntity>,skip: null == skip ? _self.skip : skip // ignore: cast_nullable_to_non_nullable
as int,hasReachedMax: null == hasReachedMax ? _self.hasReachedMax : hasReachedMax // ignore: cast_nullable_to_non_nullable
as bool,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [UserVenueState].
extension UserVenueStatePatterns on UserVenueState {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UserVenueState value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UserVenueState() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UserVenueState value)  $default,){
final _that = this;
switch (_that) {
case _UserVenueState():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UserVenueState value)?  $default,){
final _that = this;
switch (_that) {
case _UserVenueState() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( UserVenueStatus status,  List<UserVenueEntity> venues,  int skip,  bool hasReachedMax,  String? successMessage,  String? errorMessage)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UserVenueState() when $default != null:
return $default(_that.status,_that.venues,_that.skip,_that.hasReachedMax,_that.successMessage,_that.errorMessage);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( UserVenueStatus status,  List<UserVenueEntity> venues,  int skip,  bool hasReachedMax,  String? successMessage,  String? errorMessage)  $default,) {final _that = this;
switch (_that) {
case _UserVenueState():
return $default(_that.status,_that.venues,_that.skip,_that.hasReachedMax,_that.successMessage,_that.errorMessage);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( UserVenueStatus status,  List<UserVenueEntity> venues,  int skip,  bool hasReachedMax,  String? successMessage,  String? errorMessage)?  $default,) {final _that = this;
switch (_that) {
case _UserVenueState() when $default != null:
return $default(_that.status,_that.venues,_that.skip,_that.hasReachedMax,_that.successMessage,_that.errorMessage);case _:
  return null;

}
}

}

/// @nodoc


class _UserVenueState implements UserVenueState {
  const _UserVenueState({this.status = UserVenueStatus.initial, final  List<UserVenueEntity> venues = const <UserVenueEntity>[], this.skip = 0, this.hasReachedMax = false, this.successMessage, this.errorMessage}): _venues = venues;
  

@override@JsonKey() final  UserVenueStatus status;
 final  List<UserVenueEntity> _venues;
@override@JsonKey() List<UserVenueEntity> get venues {
  if (_venues is EqualUnmodifiableListView) return _venues;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_venues);
}

@override@JsonKey() final  int skip;
@override@JsonKey() final  bool hasReachedMax;
@override final  String? successMessage;
@override final  String? errorMessage;

/// Create a copy of UserVenueState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UserVenueStateCopyWith<_UserVenueState> get copyWith => __$UserVenueStateCopyWithImpl<_UserVenueState>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _UserVenueState&&(identical(other.status, status) || other.status == status)&&const DeepCollectionEquality().equals(other._venues, _venues)&&(identical(other.skip, skip) || other.skip == skip)&&(identical(other.hasReachedMax, hasReachedMax) || other.hasReachedMax == hasReachedMax)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage));
}


@override
int get hashCode => Object.hash(runtimeType,status,const DeepCollectionEquality().hash(_venues),skip,hasReachedMax,successMessage,errorMessage);

@override
String toString() {
  return 'UserVenueState(status: $status, venues: $venues, skip: $skip, hasReachedMax: $hasReachedMax, successMessage: $successMessage, errorMessage: $errorMessage)';
}


}

/// @nodoc
abstract mixin class _$UserVenueStateCopyWith<$Res> implements $UserVenueStateCopyWith<$Res> {
  factory _$UserVenueStateCopyWith(_UserVenueState value, $Res Function(_UserVenueState) _then) = __$UserVenueStateCopyWithImpl;
@override @useResult
$Res call({
 UserVenueStatus status, List<UserVenueEntity> venues, int skip, bool hasReachedMax, String? successMessage, String? errorMessage
});




}
/// @nodoc
class __$UserVenueStateCopyWithImpl<$Res>
    implements _$UserVenueStateCopyWith<$Res> {
  __$UserVenueStateCopyWithImpl(this._self, this._then);

  final _UserVenueState _self;
  final $Res Function(_UserVenueState) _then;

/// Create a copy of UserVenueState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? status = null,Object? venues = null,Object? skip = null,Object? hasReachedMax = null,Object? successMessage = freezed,Object? errorMessage = freezed,}) {
  return _then(_UserVenueState(
status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as UserVenueStatus,venues: null == venues ? _self._venues : venues // ignore: cast_nullable_to_non_nullable
as List<UserVenueEntity>,skip: null == skip ? _self.skip : skip // ignore: cast_nullable_to_non_nullable
as int,hasReachedMax: null == hasReachedMax ? _self.hasReachedMax : hasReachedMax // ignore: cast_nullable_to_non_nullable
as bool,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
