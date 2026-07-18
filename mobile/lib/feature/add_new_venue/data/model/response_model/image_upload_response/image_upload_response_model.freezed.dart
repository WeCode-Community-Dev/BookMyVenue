// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'image_upload_response_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ImageUploadResponseModel {

@JsonKey(name: 'public_id') String get publicId; String get url;@JsonKey(name: 'original_filename') String get originalFilename; int get width; int get height; String get format; int get bytes;
/// Create a copy of ImageUploadResponseModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ImageUploadResponseModelCopyWith<ImageUploadResponseModel> get copyWith => _$ImageUploadResponseModelCopyWithImpl<ImageUploadResponseModel>(this as ImageUploadResponseModel, _$identity);

  /// Serializes this ImageUploadResponseModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ImageUploadResponseModel&&(identical(other.publicId, publicId) || other.publicId == publicId)&&(identical(other.url, url) || other.url == url)&&(identical(other.originalFilename, originalFilename) || other.originalFilename == originalFilename)&&(identical(other.width, width) || other.width == width)&&(identical(other.height, height) || other.height == height)&&(identical(other.format, format) || other.format == format)&&(identical(other.bytes, bytes) || other.bytes == bytes));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,publicId,url,originalFilename,width,height,format,bytes);

@override
String toString() {
  return 'ImageUploadResponseModel(publicId: $publicId, url: $url, originalFilename: $originalFilename, width: $width, height: $height, format: $format, bytes: $bytes)';
}


}

/// @nodoc
abstract mixin class $ImageUploadResponseModelCopyWith<$Res>  {
  factory $ImageUploadResponseModelCopyWith(ImageUploadResponseModel value, $Res Function(ImageUploadResponseModel) _then) = _$ImageUploadResponseModelCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'public_id') String publicId, String url,@JsonKey(name: 'original_filename') String originalFilename, int width, int height, String format, int bytes
});




}
/// @nodoc
class _$ImageUploadResponseModelCopyWithImpl<$Res>
    implements $ImageUploadResponseModelCopyWith<$Res> {
  _$ImageUploadResponseModelCopyWithImpl(this._self, this._then);

  final ImageUploadResponseModel _self;
  final $Res Function(ImageUploadResponseModel) _then;

/// Create a copy of ImageUploadResponseModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? publicId = null,Object? url = null,Object? originalFilename = null,Object? width = null,Object? height = null,Object? format = null,Object? bytes = null,}) {
  return _then(_self.copyWith(
publicId: null == publicId ? _self.publicId : publicId // ignore: cast_nullable_to_non_nullable
as String,url: null == url ? _self.url : url // ignore: cast_nullable_to_non_nullable
as String,originalFilename: null == originalFilename ? _self.originalFilename : originalFilename // ignore: cast_nullable_to_non_nullable
as String,width: null == width ? _self.width : width // ignore: cast_nullable_to_non_nullable
as int,height: null == height ? _self.height : height // ignore: cast_nullable_to_non_nullable
as int,format: null == format ? _self.format : format // ignore: cast_nullable_to_non_nullable
as String,bytes: null == bytes ? _self.bytes : bytes // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [ImageUploadResponseModel].
extension ImageUploadResponseModelPatterns on ImageUploadResponseModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ImageUploadResponseModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ImageUploadResponseModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ImageUploadResponseModel value)  $default,){
final _that = this;
switch (_that) {
case _ImageUploadResponseModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ImageUploadResponseModel value)?  $default,){
final _that = this;
switch (_that) {
case _ImageUploadResponseModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'public_id')  String publicId,  String url, @JsonKey(name: 'original_filename')  String originalFilename,  int width,  int height,  String format,  int bytes)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ImageUploadResponseModel() when $default != null:
return $default(_that.publicId,_that.url,_that.originalFilename,_that.width,_that.height,_that.format,_that.bytes);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'public_id')  String publicId,  String url, @JsonKey(name: 'original_filename')  String originalFilename,  int width,  int height,  String format,  int bytes)  $default,) {final _that = this;
switch (_that) {
case _ImageUploadResponseModel():
return $default(_that.publicId,_that.url,_that.originalFilename,_that.width,_that.height,_that.format,_that.bytes);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'public_id')  String publicId,  String url, @JsonKey(name: 'original_filename')  String originalFilename,  int width,  int height,  String format,  int bytes)?  $default,) {final _that = this;
switch (_that) {
case _ImageUploadResponseModel() when $default != null:
return $default(_that.publicId,_that.url,_that.originalFilename,_that.width,_that.height,_that.format,_that.bytes);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ImageUploadResponseModel implements ImageUploadResponseModel {
  const _ImageUploadResponseModel({@JsonKey(name: 'public_id') required this.publicId, required this.url, @JsonKey(name: 'original_filename') required this.originalFilename, required this.width, required this.height, required this.format, required this.bytes});
  factory _ImageUploadResponseModel.fromJson(Map<String, dynamic> json) => _$ImageUploadResponseModelFromJson(json);

@override@JsonKey(name: 'public_id') final  String publicId;
@override final  String url;
@override@JsonKey(name: 'original_filename') final  String originalFilename;
@override final  int width;
@override final  int height;
@override final  String format;
@override final  int bytes;

/// Create a copy of ImageUploadResponseModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ImageUploadResponseModelCopyWith<_ImageUploadResponseModel> get copyWith => __$ImageUploadResponseModelCopyWithImpl<_ImageUploadResponseModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ImageUploadResponseModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ImageUploadResponseModel&&(identical(other.publicId, publicId) || other.publicId == publicId)&&(identical(other.url, url) || other.url == url)&&(identical(other.originalFilename, originalFilename) || other.originalFilename == originalFilename)&&(identical(other.width, width) || other.width == width)&&(identical(other.height, height) || other.height == height)&&(identical(other.format, format) || other.format == format)&&(identical(other.bytes, bytes) || other.bytes == bytes));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,publicId,url,originalFilename,width,height,format,bytes);

@override
String toString() {
  return 'ImageUploadResponseModel(publicId: $publicId, url: $url, originalFilename: $originalFilename, width: $width, height: $height, format: $format, bytes: $bytes)';
}


}

/// @nodoc
abstract mixin class _$ImageUploadResponseModelCopyWith<$Res> implements $ImageUploadResponseModelCopyWith<$Res> {
  factory _$ImageUploadResponseModelCopyWith(_ImageUploadResponseModel value, $Res Function(_ImageUploadResponseModel) _then) = __$ImageUploadResponseModelCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'public_id') String publicId, String url,@JsonKey(name: 'original_filename') String originalFilename, int width, int height, String format, int bytes
});




}
/// @nodoc
class __$ImageUploadResponseModelCopyWithImpl<$Res>
    implements _$ImageUploadResponseModelCopyWith<$Res> {
  __$ImageUploadResponseModelCopyWithImpl(this._self, this._then);

  final _ImageUploadResponseModel _self;
  final $Res Function(_ImageUploadResponseModel) _then;

/// Create a copy of ImageUploadResponseModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? publicId = null,Object? url = null,Object? originalFilename = null,Object? width = null,Object? height = null,Object? format = null,Object? bytes = null,}) {
  return _then(_ImageUploadResponseModel(
publicId: null == publicId ? _self.publicId : publicId // ignore: cast_nullable_to_non_nullable
as String,url: null == url ? _self.url : url // ignore: cast_nullable_to_non_nullable
as String,originalFilename: null == originalFilename ? _self.originalFilename : originalFilename // ignore: cast_nullable_to_non_nullable
as String,width: null == width ? _self.width : width // ignore: cast_nullable_to_non_nullable
as int,height: null == height ? _self.height : height // ignore: cast_nullable_to_non_nullable
as int,format: null == format ? _self.format : format // ignore: cast_nullable_to_non_nullable
as String,bytes: null == bytes ? _self.bytes : bytes // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
