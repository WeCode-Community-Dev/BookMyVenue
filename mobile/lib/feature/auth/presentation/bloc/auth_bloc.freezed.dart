// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'auth_bloc.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$AuthEvent {

 Object get requestParam;



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AuthEvent&&const DeepCollectionEquality().equals(other.requestParam, requestParam));
}


@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(requestParam));

@override
String toString() {
  return 'AuthEvent(requestParam: $requestParam)';
}


}

/// @nodoc
class $AuthEventCopyWith<$Res>  {
$AuthEventCopyWith(AuthEvent _, $Res Function(AuthEvent) __);
}


/// Adds pattern-matching-related methods to [AuthEvent].
extension AuthEventPatterns on AuthEvent {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>({TResult Function( _RequestOtpEvent value)?  requestOtp,TResult Function( _VerifyOtpEvent value)?  verifyOtp,required TResult orElse(),}){
final _that = this;
switch (_that) {
case _RequestOtpEvent() when requestOtp != null:
return requestOtp(_that);case _VerifyOtpEvent() when verifyOtp != null:
return verifyOtp(_that);case _:
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

@optionalTypeArgs TResult map<TResult extends Object?>({required TResult Function( _RequestOtpEvent value)  requestOtp,required TResult Function( _VerifyOtpEvent value)  verifyOtp,}){
final _that = this;
switch (_that) {
case _RequestOtpEvent():
return requestOtp(_that);case _VerifyOtpEvent():
return verifyOtp(_that);case _:
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>({TResult? Function( _RequestOtpEvent value)?  requestOtp,TResult? Function( _VerifyOtpEvent value)?  verifyOtp,}){
final _that = this;
switch (_that) {
case _RequestOtpEvent() when requestOtp != null:
return requestOtp(_that);case _VerifyOtpEvent() when verifyOtp != null:
return verifyOtp(_that);case _:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>({TResult Function( OtpRequestParams requestParam)?  requestOtp,TResult Function( VerifyOtpRequestParams requestParam)?  verifyOtp,required TResult orElse(),}) {final _that = this;
switch (_that) {
case _RequestOtpEvent() when requestOtp != null:
return requestOtp(_that.requestParam);case _VerifyOtpEvent() when verifyOtp != null:
return verifyOtp(_that.requestParam);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>({required TResult Function( OtpRequestParams requestParam)  requestOtp,required TResult Function( VerifyOtpRequestParams requestParam)  verifyOtp,}) {final _that = this;
switch (_that) {
case _RequestOtpEvent():
return requestOtp(_that.requestParam);case _VerifyOtpEvent():
return verifyOtp(_that.requestParam);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>({TResult? Function( OtpRequestParams requestParam)?  requestOtp,TResult? Function( VerifyOtpRequestParams requestParam)?  verifyOtp,}) {final _that = this;
switch (_that) {
case _RequestOtpEvent() when requestOtp != null:
return requestOtp(_that.requestParam);case _VerifyOtpEvent() when verifyOtp != null:
return verifyOtp(_that.requestParam);case _:
  return null;

}
}

}

/// @nodoc


class _RequestOtpEvent implements AuthEvent {
  const _RequestOtpEvent({required this.requestParam});
  

@override final  OtpRequestParams requestParam;

/// Create a copy of AuthEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$RequestOtpEventCopyWith<_RequestOtpEvent> get copyWith => __$RequestOtpEventCopyWithImpl<_RequestOtpEvent>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _RequestOtpEvent&&(identical(other.requestParam, requestParam) || other.requestParam == requestParam));
}


@override
int get hashCode => Object.hash(runtimeType,requestParam);

@override
String toString() {
  return 'AuthEvent.requestOtp(requestParam: $requestParam)';
}


}

/// @nodoc
abstract mixin class _$RequestOtpEventCopyWith<$Res> implements $AuthEventCopyWith<$Res> {
  factory _$RequestOtpEventCopyWith(_RequestOtpEvent value, $Res Function(_RequestOtpEvent) _then) = __$RequestOtpEventCopyWithImpl;
@useResult
$Res call({
 OtpRequestParams requestParam
});




}
/// @nodoc
class __$RequestOtpEventCopyWithImpl<$Res>
    implements _$RequestOtpEventCopyWith<$Res> {
  __$RequestOtpEventCopyWithImpl(this._self, this._then);

  final _RequestOtpEvent _self;
  final $Res Function(_RequestOtpEvent) _then;

/// Create a copy of AuthEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? requestParam = null,}) {
  return _then(_RequestOtpEvent(
requestParam: null == requestParam ? _self.requestParam : requestParam // ignore: cast_nullable_to_non_nullable
as OtpRequestParams,
  ));
}


}

/// @nodoc


class _VerifyOtpEvent implements AuthEvent {
  const _VerifyOtpEvent({required this.requestParam});
  

@override final  VerifyOtpRequestParams requestParam;

/// Create a copy of AuthEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VerifyOtpEventCopyWith<_VerifyOtpEvent> get copyWith => __$VerifyOtpEventCopyWithImpl<_VerifyOtpEvent>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VerifyOtpEvent&&(identical(other.requestParam, requestParam) || other.requestParam == requestParam));
}


@override
int get hashCode => Object.hash(runtimeType,requestParam);

@override
String toString() {
  return 'AuthEvent.verifyOtp(requestParam: $requestParam)';
}


}

/// @nodoc
abstract mixin class _$VerifyOtpEventCopyWith<$Res> implements $AuthEventCopyWith<$Res> {
  factory _$VerifyOtpEventCopyWith(_VerifyOtpEvent value, $Res Function(_VerifyOtpEvent) _then) = __$VerifyOtpEventCopyWithImpl;
@useResult
$Res call({
 VerifyOtpRequestParams requestParam
});




}
/// @nodoc
class __$VerifyOtpEventCopyWithImpl<$Res>
    implements _$VerifyOtpEventCopyWith<$Res> {
  __$VerifyOtpEventCopyWithImpl(this._self, this._then);

  final _VerifyOtpEvent _self;
  final $Res Function(_VerifyOtpEvent) _then;

/// Create a copy of AuthEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? requestParam = null,}) {
  return _then(_VerifyOtpEvent(
requestParam: null == requestParam ? _self.requestParam : requestParam // ignore: cast_nullable_to_non_nullable
as VerifyOtpRequestParams,
  ));
}


}

/// @nodoc
mixin _$AuthState {

 bool get isLoading; bool get isOtpRequesting; OtpResponseEntity? get otpResponse; VerifyOtpResponseEntity? get verifyOtpResponse; String? get successMessage; bool get isError; String? get errorMessage;
/// Create a copy of AuthState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AuthStateCopyWith<AuthState> get copyWith => _$AuthStateCopyWithImpl<AuthState>(this as AuthState, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AuthState&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.isOtpRequesting, isOtpRequesting) || other.isOtpRequesting == isOtpRequesting)&&(identical(other.otpResponse, otpResponse) || other.otpResponse == otpResponse)&&(identical(other.verifyOtpResponse, verifyOtpResponse) || other.verifyOtpResponse == verifyOtpResponse)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.isError, isError) || other.isError == isError)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage));
}


@override
int get hashCode => Object.hash(runtimeType,isLoading,isOtpRequesting,otpResponse,verifyOtpResponse,successMessage,isError,errorMessage);

@override
String toString() {
  return 'AuthState(isLoading: $isLoading, isOtpRequesting: $isOtpRequesting, otpResponse: $otpResponse, verifyOtpResponse: $verifyOtpResponse, successMessage: $successMessage, isError: $isError, errorMessage: $errorMessage)';
}


}

/// @nodoc
abstract mixin class $AuthStateCopyWith<$Res>  {
  factory $AuthStateCopyWith(AuthState value, $Res Function(AuthState) _then) = _$AuthStateCopyWithImpl;
@useResult
$Res call({
 bool isLoading, bool isOtpRequesting, OtpResponseEntity? otpResponse, VerifyOtpResponseEntity? verifyOtpResponse, String? successMessage, bool isError, String? errorMessage
});




}
/// @nodoc
class _$AuthStateCopyWithImpl<$Res>
    implements $AuthStateCopyWith<$Res> {
  _$AuthStateCopyWithImpl(this._self, this._then);

  final AuthState _self;
  final $Res Function(AuthState) _then;

/// Create a copy of AuthState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? isLoading = null,Object? isOtpRequesting = null,Object? otpResponse = freezed,Object? verifyOtpResponse = freezed,Object? successMessage = freezed,Object? isError = null,Object? errorMessage = freezed,}) {
  return _then(_self.copyWith(
isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,isOtpRequesting: null == isOtpRequesting ? _self.isOtpRequesting : isOtpRequesting // ignore: cast_nullable_to_non_nullable
as bool,otpResponse: freezed == otpResponse ? _self.otpResponse : otpResponse // ignore: cast_nullable_to_non_nullable
as OtpResponseEntity?,verifyOtpResponse: freezed == verifyOtpResponse ? _self.verifyOtpResponse : verifyOtpResponse // ignore: cast_nullable_to_non_nullable
as VerifyOtpResponseEntity?,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,isError: null == isError ? _self.isError : isError // ignore: cast_nullable_to_non_nullable
as bool,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [AuthState].
extension AuthStatePatterns on AuthState {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AuthState value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AuthState() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AuthState value)  $default,){
final _that = this;
switch (_that) {
case _AuthState():
return $default(_that);case _:
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AuthState value)?  $default,){
final _that = this;
switch (_that) {
case _AuthState() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool isLoading,  bool isOtpRequesting,  OtpResponseEntity? otpResponse,  VerifyOtpResponseEntity? verifyOtpResponse,  String? successMessage,  bool isError,  String? errorMessage)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AuthState() when $default != null:
return $default(_that.isLoading,_that.isOtpRequesting,_that.otpResponse,_that.verifyOtpResponse,_that.successMessage,_that.isError,_that.errorMessage);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool isLoading,  bool isOtpRequesting,  OtpResponseEntity? otpResponse,  VerifyOtpResponseEntity? verifyOtpResponse,  String? successMessage,  bool isError,  String? errorMessage)  $default,) {final _that = this;
switch (_that) {
case _AuthState():
return $default(_that.isLoading,_that.isOtpRequesting,_that.otpResponse,_that.verifyOtpResponse,_that.successMessage,_that.isError,_that.errorMessage);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool isLoading,  bool isOtpRequesting,  OtpResponseEntity? otpResponse,  VerifyOtpResponseEntity? verifyOtpResponse,  String? successMessage,  bool isError,  String? errorMessage)?  $default,) {final _that = this;
switch (_that) {
case _AuthState() when $default != null:
return $default(_that.isLoading,_that.isOtpRequesting,_that.otpResponse,_that.verifyOtpResponse,_that.successMessage,_that.isError,_that.errorMessage);case _:
  return null;

}
}

}

/// @nodoc


class _AuthState implements AuthState {
  const _AuthState({this.isLoading = false, this.isOtpRequesting = false, this.otpResponse, this.verifyOtpResponse, this.successMessage, this.isError = false, this.errorMessage});
  

@override@JsonKey() final  bool isLoading;
@override@JsonKey() final  bool isOtpRequesting;
@override final  OtpResponseEntity? otpResponse;
@override final  VerifyOtpResponseEntity? verifyOtpResponse;
@override final  String? successMessage;
@override@JsonKey() final  bool isError;
@override final  String? errorMessage;

/// Create a copy of AuthState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AuthStateCopyWith<_AuthState> get copyWith => __$AuthStateCopyWithImpl<_AuthState>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _AuthState&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.isOtpRequesting, isOtpRequesting) || other.isOtpRequesting == isOtpRequesting)&&(identical(other.otpResponse, otpResponse) || other.otpResponse == otpResponse)&&(identical(other.verifyOtpResponse, verifyOtpResponse) || other.verifyOtpResponse == verifyOtpResponse)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.isError, isError) || other.isError == isError)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage));
}


@override
int get hashCode => Object.hash(runtimeType,isLoading,isOtpRequesting,otpResponse,verifyOtpResponse,successMessage,isError,errorMessage);

@override
String toString() {
  return 'AuthState(isLoading: $isLoading, isOtpRequesting: $isOtpRequesting, otpResponse: $otpResponse, verifyOtpResponse: $verifyOtpResponse, successMessage: $successMessage, isError: $isError, errorMessage: $errorMessage)';
}


}

/// @nodoc
abstract mixin class _$AuthStateCopyWith<$Res> implements $AuthStateCopyWith<$Res> {
  factory _$AuthStateCopyWith(_AuthState value, $Res Function(_AuthState) _then) = __$AuthStateCopyWithImpl;
@override @useResult
$Res call({
 bool isLoading, bool isOtpRequesting, OtpResponseEntity? otpResponse, VerifyOtpResponseEntity? verifyOtpResponse, String? successMessage, bool isError, String? errorMessage
});




}
/// @nodoc
class __$AuthStateCopyWithImpl<$Res>
    implements _$AuthStateCopyWith<$Res> {
  __$AuthStateCopyWithImpl(this._self, this._then);

  final _AuthState _self;
  final $Res Function(_AuthState) _then;

/// Create a copy of AuthState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? isLoading = null,Object? isOtpRequesting = null,Object? otpResponse = freezed,Object? verifyOtpResponse = freezed,Object? successMessage = freezed,Object? isError = null,Object? errorMessage = freezed,}) {
  return _then(_AuthState(
isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,isOtpRequesting: null == isOtpRequesting ? _self.isOtpRequesting : isOtpRequesting // ignore: cast_nullable_to_non_nullable
as bool,otpResponse: freezed == otpResponse ? _self.otpResponse : otpResponse // ignore: cast_nullable_to_non_nullable
as OtpResponseEntity?,verifyOtpResponse: freezed == verifyOtpResponse ? _self.verifyOtpResponse : verifyOtpResponse // ignore: cast_nullable_to_non_nullable
as VerifyOtpResponseEntity?,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,isError: null == isError ? _self.isError : isError // ignore: cast_nullable_to_non_nullable
as bool,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
