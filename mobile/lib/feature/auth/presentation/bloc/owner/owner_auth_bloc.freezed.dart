// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'owner_auth_bloc.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$OwnerAuthEvent {





@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OwnerAuthEvent);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'OwnerAuthEvent()';
}


}

/// @nodoc
class $OwnerAuthEventCopyWith<$Res>  {
$OwnerAuthEventCopyWith(OwnerAuthEvent _, $Res Function(OwnerAuthEvent) __);
}


/// Adds pattern-matching-related methods to [OwnerAuthEvent].
extension OwnerAuthEventPatterns on OwnerAuthEvent {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>({TResult Function( _RegisterAccountEvent value)?  registerAccount,TResult Function( _VerifyOwnerOtpEvent value)?  verifyOwnerOtp,TResult Function( _GetOwnerProfileStatus value)?  getOwnerProfileStatus,required TResult orElse(),}){
final _that = this;
switch (_that) {
case _RegisterAccountEvent() when registerAccount != null:
return registerAccount(_that);case _VerifyOwnerOtpEvent() when verifyOwnerOtp != null:
return verifyOwnerOtp(_that);case _GetOwnerProfileStatus() when getOwnerProfileStatus != null:
return getOwnerProfileStatus(_that);case _:
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

@optionalTypeArgs TResult map<TResult extends Object?>({required TResult Function( _RegisterAccountEvent value)  registerAccount,required TResult Function( _VerifyOwnerOtpEvent value)  verifyOwnerOtp,required TResult Function( _GetOwnerProfileStatus value)  getOwnerProfileStatus,}){
final _that = this;
switch (_that) {
case _RegisterAccountEvent():
return registerAccount(_that);case _VerifyOwnerOtpEvent():
return verifyOwnerOtp(_that);case _GetOwnerProfileStatus():
return getOwnerProfileStatus(_that);case _:
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>({TResult? Function( _RegisterAccountEvent value)?  registerAccount,TResult? Function( _VerifyOwnerOtpEvent value)?  verifyOwnerOtp,TResult? Function( _GetOwnerProfileStatus value)?  getOwnerProfileStatus,}){
final _that = this;
switch (_that) {
case _RegisterAccountEvent() when registerAccount != null:
return registerAccount(_that);case _VerifyOwnerOtpEvent() when verifyOwnerOtp != null:
return verifyOwnerOtp(_that);case _GetOwnerProfileStatus() when getOwnerProfileStatus != null:
return getOwnerProfileStatus(_that);case _:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>({TResult Function( OwnerRegisterParams requestParam)?  registerAccount,TResult Function( VerifyOwnerOtpParams requestParam)?  verifyOwnerOtp,TResult Function()?  getOwnerProfileStatus,required TResult orElse(),}) {final _that = this;
switch (_that) {
case _RegisterAccountEvent() when registerAccount != null:
return registerAccount(_that.requestParam);case _VerifyOwnerOtpEvent() when verifyOwnerOtp != null:
return verifyOwnerOtp(_that.requestParam);case _GetOwnerProfileStatus() when getOwnerProfileStatus != null:
return getOwnerProfileStatus();case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>({required TResult Function( OwnerRegisterParams requestParam)  registerAccount,required TResult Function( VerifyOwnerOtpParams requestParam)  verifyOwnerOtp,required TResult Function()  getOwnerProfileStatus,}) {final _that = this;
switch (_that) {
case _RegisterAccountEvent():
return registerAccount(_that.requestParam);case _VerifyOwnerOtpEvent():
return verifyOwnerOtp(_that.requestParam);case _GetOwnerProfileStatus():
return getOwnerProfileStatus();case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>({TResult? Function( OwnerRegisterParams requestParam)?  registerAccount,TResult? Function( VerifyOwnerOtpParams requestParam)?  verifyOwnerOtp,TResult? Function()?  getOwnerProfileStatus,}) {final _that = this;
switch (_that) {
case _RegisterAccountEvent() when registerAccount != null:
return registerAccount(_that.requestParam);case _VerifyOwnerOtpEvent() when verifyOwnerOtp != null:
return verifyOwnerOtp(_that.requestParam);case _GetOwnerProfileStatus() when getOwnerProfileStatus != null:
return getOwnerProfileStatus();case _:
  return null;

}
}

}

/// @nodoc


class _RegisterAccountEvent implements OwnerAuthEvent {
  const _RegisterAccountEvent({required this.requestParam});
  

 final  OwnerRegisterParams requestParam;

/// Create a copy of OwnerAuthEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$RegisterAccountEventCopyWith<_RegisterAccountEvent> get copyWith => __$RegisterAccountEventCopyWithImpl<_RegisterAccountEvent>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _RegisterAccountEvent&&(identical(other.requestParam, requestParam) || other.requestParam == requestParam));
}


@override
int get hashCode => Object.hash(runtimeType,requestParam);

@override
String toString() {
  return 'OwnerAuthEvent.registerAccount(requestParam: $requestParam)';
}


}

/// @nodoc
abstract mixin class _$RegisterAccountEventCopyWith<$Res> implements $OwnerAuthEventCopyWith<$Res> {
  factory _$RegisterAccountEventCopyWith(_RegisterAccountEvent value, $Res Function(_RegisterAccountEvent) _then) = __$RegisterAccountEventCopyWithImpl;
@useResult
$Res call({
 OwnerRegisterParams requestParam
});




}
/// @nodoc
class __$RegisterAccountEventCopyWithImpl<$Res>
    implements _$RegisterAccountEventCopyWith<$Res> {
  __$RegisterAccountEventCopyWithImpl(this._self, this._then);

  final _RegisterAccountEvent _self;
  final $Res Function(_RegisterAccountEvent) _then;

/// Create a copy of OwnerAuthEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? requestParam = null,}) {
  return _then(_RegisterAccountEvent(
requestParam: null == requestParam ? _self.requestParam : requestParam // ignore: cast_nullable_to_non_nullable
as OwnerRegisterParams,
  ));
}


}

/// @nodoc


class _VerifyOwnerOtpEvent implements OwnerAuthEvent {
  const _VerifyOwnerOtpEvent({required this.requestParam});
  

 final  VerifyOwnerOtpParams requestParam;

/// Create a copy of OwnerAuthEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$VerifyOwnerOtpEventCopyWith<_VerifyOwnerOtpEvent> get copyWith => __$VerifyOwnerOtpEventCopyWithImpl<_VerifyOwnerOtpEvent>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _VerifyOwnerOtpEvent&&(identical(other.requestParam, requestParam) || other.requestParam == requestParam));
}


@override
int get hashCode => Object.hash(runtimeType,requestParam);

@override
String toString() {
  return 'OwnerAuthEvent.verifyOwnerOtp(requestParam: $requestParam)';
}


}

/// @nodoc
abstract mixin class _$VerifyOwnerOtpEventCopyWith<$Res> implements $OwnerAuthEventCopyWith<$Res> {
  factory _$VerifyOwnerOtpEventCopyWith(_VerifyOwnerOtpEvent value, $Res Function(_VerifyOwnerOtpEvent) _then) = __$VerifyOwnerOtpEventCopyWithImpl;
@useResult
$Res call({
 VerifyOwnerOtpParams requestParam
});




}
/// @nodoc
class __$VerifyOwnerOtpEventCopyWithImpl<$Res>
    implements _$VerifyOwnerOtpEventCopyWith<$Res> {
  __$VerifyOwnerOtpEventCopyWithImpl(this._self, this._then);

  final _VerifyOwnerOtpEvent _self;
  final $Res Function(_VerifyOwnerOtpEvent) _then;

/// Create a copy of OwnerAuthEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? requestParam = null,}) {
  return _then(_VerifyOwnerOtpEvent(
requestParam: null == requestParam ? _self.requestParam : requestParam // ignore: cast_nullable_to_non_nullable
as VerifyOwnerOtpParams,
  ));
}


}

/// @nodoc


class _GetOwnerProfileStatus implements OwnerAuthEvent {
  const _GetOwnerProfileStatus();
  






@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _GetOwnerProfileStatus);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'OwnerAuthEvent.getOwnerProfileStatus()';
}


}




/// @nodoc
mixin _$OwnerAuthState {

 bool get isLoading; RegisterDataEntity? get otpResponse; VerifyOtpDataEntity? get verifyOtpResponse; String? get successMessage; bool get isError; String? get errorMessage;/// Owner verification
 bool get isVerificationRequestLoading; String? get verificationSuccessMessage; bool get isVerificationError; String? get verificationErrorMessage; ApprovalStatus get approvalStatus; int get verificationStatusCode;
/// Create a copy of OwnerAuthState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$OwnerAuthStateCopyWith<OwnerAuthState> get copyWith => _$OwnerAuthStateCopyWithImpl<OwnerAuthState>(this as OwnerAuthState, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is OwnerAuthState&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.otpResponse, otpResponse) || other.otpResponse == otpResponse)&&(identical(other.verifyOtpResponse, verifyOtpResponse) || other.verifyOtpResponse == verifyOtpResponse)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.isError, isError) || other.isError == isError)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage)&&(identical(other.isVerificationRequestLoading, isVerificationRequestLoading) || other.isVerificationRequestLoading == isVerificationRequestLoading)&&(identical(other.verificationSuccessMessage, verificationSuccessMessage) || other.verificationSuccessMessage == verificationSuccessMessage)&&(identical(other.isVerificationError, isVerificationError) || other.isVerificationError == isVerificationError)&&(identical(other.verificationErrorMessage, verificationErrorMessage) || other.verificationErrorMessage == verificationErrorMessage)&&(identical(other.approvalStatus, approvalStatus) || other.approvalStatus == approvalStatus)&&(identical(other.verificationStatusCode, verificationStatusCode) || other.verificationStatusCode == verificationStatusCode));
}


@override
int get hashCode => Object.hash(runtimeType,isLoading,otpResponse,verifyOtpResponse,successMessage,isError,errorMessage,isVerificationRequestLoading,verificationSuccessMessage,isVerificationError,verificationErrorMessage,approvalStatus,verificationStatusCode);

@override
String toString() {
  return 'OwnerAuthState(isLoading: $isLoading, otpResponse: $otpResponse, verifyOtpResponse: $verifyOtpResponse, successMessage: $successMessage, isError: $isError, errorMessage: $errorMessage, isVerificationRequestLoading: $isVerificationRequestLoading, verificationSuccessMessage: $verificationSuccessMessage, isVerificationError: $isVerificationError, verificationErrorMessage: $verificationErrorMessage, approvalStatus: $approvalStatus, verificationStatusCode: $verificationStatusCode)';
}


}

/// @nodoc
abstract mixin class $OwnerAuthStateCopyWith<$Res>  {
  factory $OwnerAuthStateCopyWith(OwnerAuthState value, $Res Function(OwnerAuthState) _then) = _$OwnerAuthStateCopyWithImpl;
@useResult
$Res call({
 bool isLoading, RegisterDataEntity? otpResponse, VerifyOtpDataEntity? verifyOtpResponse, String? successMessage, bool isError, String? errorMessage, bool isVerificationRequestLoading, String? verificationSuccessMessage, bool isVerificationError, String? verificationErrorMessage, ApprovalStatus approvalStatus, int verificationStatusCode
});




}
/// @nodoc
class _$OwnerAuthStateCopyWithImpl<$Res>
    implements $OwnerAuthStateCopyWith<$Res> {
  _$OwnerAuthStateCopyWithImpl(this._self, this._then);

  final OwnerAuthState _self;
  final $Res Function(OwnerAuthState) _then;

/// Create a copy of OwnerAuthState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? isLoading = null,Object? otpResponse = freezed,Object? verifyOtpResponse = freezed,Object? successMessage = freezed,Object? isError = null,Object? errorMessage = freezed,Object? isVerificationRequestLoading = null,Object? verificationSuccessMessage = freezed,Object? isVerificationError = null,Object? verificationErrorMessage = freezed,Object? approvalStatus = null,Object? verificationStatusCode = null,}) {
  return _then(_self.copyWith(
isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,otpResponse: freezed == otpResponse ? _self.otpResponse : otpResponse // ignore: cast_nullable_to_non_nullable
as RegisterDataEntity?,verifyOtpResponse: freezed == verifyOtpResponse ? _self.verifyOtpResponse : verifyOtpResponse // ignore: cast_nullable_to_non_nullable
as VerifyOtpDataEntity?,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,isError: null == isError ? _self.isError : isError // ignore: cast_nullable_to_non_nullable
as bool,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,isVerificationRequestLoading: null == isVerificationRequestLoading ? _self.isVerificationRequestLoading : isVerificationRequestLoading // ignore: cast_nullable_to_non_nullable
as bool,verificationSuccessMessage: freezed == verificationSuccessMessage ? _self.verificationSuccessMessage : verificationSuccessMessage // ignore: cast_nullable_to_non_nullable
as String?,isVerificationError: null == isVerificationError ? _self.isVerificationError : isVerificationError // ignore: cast_nullable_to_non_nullable
as bool,verificationErrorMessage: freezed == verificationErrorMessage ? _self.verificationErrorMessage : verificationErrorMessage // ignore: cast_nullable_to_non_nullable
as String?,approvalStatus: null == approvalStatus ? _self.approvalStatus : approvalStatus // ignore: cast_nullable_to_non_nullable
as ApprovalStatus,verificationStatusCode: null == verificationStatusCode ? _self.verificationStatusCode : verificationStatusCode // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [OwnerAuthState].
extension OwnerAuthStatePatterns on OwnerAuthState {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _OwnerAuthState value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _OwnerAuthState() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _OwnerAuthState value)  $default,){
final _that = this;
switch (_that) {
case _OwnerAuthState():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _OwnerAuthState value)?  $default,){
final _that = this;
switch (_that) {
case _OwnerAuthState() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool isLoading,  RegisterDataEntity? otpResponse,  VerifyOtpDataEntity? verifyOtpResponse,  String? successMessage,  bool isError,  String? errorMessage,  bool isVerificationRequestLoading,  String? verificationSuccessMessage,  bool isVerificationError,  String? verificationErrorMessage,  ApprovalStatus approvalStatus,  int verificationStatusCode)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _OwnerAuthState() when $default != null:
return $default(_that.isLoading,_that.otpResponse,_that.verifyOtpResponse,_that.successMessage,_that.isError,_that.errorMessage,_that.isVerificationRequestLoading,_that.verificationSuccessMessage,_that.isVerificationError,_that.verificationErrorMessage,_that.approvalStatus,_that.verificationStatusCode);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool isLoading,  RegisterDataEntity? otpResponse,  VerifyOtpDataEntity? verifyOtpResponse,  String? successMessage,  bool isError,  String? errorMessage,  bool isVerificationRequestLoading,  String? verificationSuccessMessage,  bool isVerificationError,  String? verificationErrorMessage,  ApprovalStatus approvalStatus,  int verificationStatusCode)  $default,) {final _that = this;
switch (_that) {
case _OwnerAuthState():
return $default(_that.isLoading,_that.otpResponse,_that.verifyOtpResponse,_that.successMessage,_that.isError,_that.errorMessage,_that.isVerificationRequestLoading,_that.verificationSuccessMessage,_that.isVerificationError,_that.verificationErrorMessage,_that.approvalStatus,_that.verificationStatusCode);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool isLoading,  RegisterDataEntity? otpResponse,  VerifyOtpDataEntity? verifyOtpResponse,  String? successMessage,  bool isError,  String? errorMessage,  bool isVerificationRequestLoading,  String? verificationSuccessMessage,  bool isVerificationError,  String? verificationErrorMessage,  ApprovalStatus approvalStatus,  int verificationStatusCode)?  $default,) {final _that = this;
switch (_that) {
case _OwnerAuthState() when $default != null:
return $default(_that.isLoading,_that.otpResponse,_that.verifyOtpResponse,_that.successMessage,_that.isError,_that.errorMessage,_that.isVerificationRequestLoading,_that.verificationSuccessMessage,_that.isVerificationError,_that.verificationErrorMessage,_that.approvalStatus,_that.verificationStatusCode);case _:
  return null;

}
}

}

/// @nodoc


class _OwnerAuthState implements OwnerAuthState {
  const _OwnerAuthState({this.isLoading = false, this.otpResponse, this.verifyOtpResponse, this.successMessage, this.isError = false, this.errorMessage, this.isVerificationRequestLoading = false, this.verificationSuccessMessage, this.isVerificationError = false, this.verificationErrorMessage, this.approvalStatus = ApprovalStatus.pending, this.verificationStatusCode = 3});
  

@override@JsonKey() final  bool isLoading;
@override final  RegisterDataEntity? otpResponse;
@override final  VerifyOtpDataEntity? verifyOtpResponse;
@override final  String? successMessage;
@override@JsonKey() final  bool isError;
@override final  String? errorMessage;
/// Owner verification
@override@JsonKey() final  bool isVerificationRequestLoading;
@override final  String? verificationSuccessMessage;
@override@JsonKey() final  bool isVerificationError;
@override final  String? verificationErrorMessage;
@override@JsonKey() final  ApprovalStatus approvalStatus;
@override@JsonKey() final  int verificationStatusCode;

/// Create a copy of OwnerAuthState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$OwnerAuthStateCopyWith<_OwnerAuthState> get copyWith => __$OwnerAuthStateCopyWithImpl<_OwnerAuthState>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _OwnerAuthState&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.otpResponse, otpResponse) || other.otpResponse == otpResponse)&&(identical(other.verifyOtpResponse, verifyOtpResponse) || other.verifyOtpResponse == verifyOtpResponse)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.isError, isError) || other.isError == isError)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage)&&(identical(other.isVerificationRequestLoading, isVerificationRequestLoading) || other.isVerificationRequestLoading == isVerificationRequestLoading)&&(identical(other.verificationSuccessMessage, verificationSuccessMessage) || other.verificationSuccessMessage == verificationSuccessMessage)&&(identical(other.isVerificationError, isVerificationError) || other.isVerificationError == isVerificationError)&&(identical(other.verificationErrorMessage, verificationErrorMessage) || other.verificationErrorMessage == verificationErrorMessage)&&(identical(other.approvalStatus, approvalStatus) || other.approvalStatus == approvalStatus)&&(identical(other.verificationStatusCode, verificationStatusCode) || other.verificationStatusCode == verificationStatusCode));
}


@override
int get hashCode => Object.hash(runtimeType,isLoading,otpResponse,verifyOtpResponse,successMessage,isError,errorMessage,isVerificationRequestLoading,verificationSuccessMessage,isVerificationError,verificationErrorMessage,approvalStatus,verificationStatusCode);

@override
String toString() {
  return 'OwnerAuthState(isLoading: $isLoading, otpResponse: $otpResponse, verifyOtpResponse: $verifyOtpResponse, successMessage: $successMessage, isError: $isError, errorMessage: $errorMessage, isVerificationRequestLoading: $isVerificationRequestLoading, verificationSuccessMessage: $verificationSuccessMessage, isVerificationError: $isVerificationError, verificationErrorMessage: $verificationErrorMessage, approvalStatus: $approvalStatus, verificationStatusCode: $verificationStatusCode)';
}


}

/// @nodoc
abstract mixin class _$OwnerAuthStateCopyWith<$Res> implements $OwnerAuthStateCopyWith<$Res> {
  factory _$OwnerAuthStateCopyWith(_OwnerAuthState value, $Res Function(_OwnerAuthState) _then) = __$OwnerAuthStateCopyWithImpl;
@override @useResult
$Res call({
 bool isLoading, RegisterDataEntity? otpResponse, VerifyOtpDataEntity? verifyOtpResponse, String? successMessage, bool isError, String? errorMessage, bool isVerificationRequestLoading, String? verificationSuccessMessage, bool isVerificationError, String? verificationErrorMessage, ApprovalStatus approvalStatus, int verificationStatusCode
});




}
/// @nodoc
class __$OwnerAuthStateCopyWithImpl<$Res>
    implements _$OwnerAuthStateCopyWith<$Res> {
  __$OwnerAuthStateCopyWithImpl(this._self, this._then);

  final _OwnerAuthState _self;
  final $Res Function(_OwnerAuthState) _then;

/// Create a copy of OwnerAuthState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? isLoading = null,Object? otpResponse = freezed,Object? verifyOtpResponse = freezed,Object? successMessage = freezed,Object? isError = null,Object? errorMessage = freezed,Object? isVerificationRequestLoading = null,Object? verificationSuccessMessage = freezed,Object? isVerificationError = null,Object? verificationErrorMessage = freezed,Object? approvalStatus = null,Object? verificationStatusCode = null,}) {
  return _then(_OwnerAuthState(
isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,otpResponse: freezed == otpResponse ? _self.otpResponse : otpResponse // ignore: cast_nullable_to_non_nullable
as RegisterDataEntity?,verifyOtpResponse: freezed == verifyOtpResponse ? _self.verifyOtpResponse : verifyOtpResponse // ignore: cast_nullable_to_non_nullable
as VerifyOtpDataEntity?,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,isError: null == isError ? _self.isError : isError // ignore: cast_nullable_to_non_nullable
as bool,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,isVerificationRequestLoading: null == isVerificationRequestLoading ? _self.isVerificationRequestLoading : isVerificationRequestLoading // ignore: cast_nullable_to_non_nullable
as bool,verificationSuccessMessage: freezed == verificationSuccessMessage ? _self.verificationSuccessMessage : verificationSuccessMessage // ignore: cast_nullable_to_non_nullable
as String?,isVerificationError: null == isVerificationError ? _self.isVerificationError : isVerificationError // ignore: cast_nullable_to_non_nullable
as bool,verificationErrorMessage: freezed == verificationErrorMessage ? _self.verificationErrorMessage : verificationErrorMessage // ignore: cast_nullable_to_non_nullable
as String?,approvalStatus: null == approvalStatus ? _self.approvalStatus : approvalStatus // ignore: cast_nullable_to_non_nullable
as ApprovalStatus,verificationStatusCode: null == verificationStatusCode ? _self.verificationStatusCode : verificationStatusCode // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
