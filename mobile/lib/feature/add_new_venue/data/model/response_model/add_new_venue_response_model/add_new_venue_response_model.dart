import 'package:freezed_annotation/freezed_annotation.dart';

part 'add_new_venue_response_model.freezed.dart';
part 'add_new_venue_response_model.g.dart';

@freezed
sealed class AddNewVenueResponseModel with _$AddNewVenueResponseModel {
  const factory AddNewVenueResponseModel({
    required String id,
    @JsonKey(name: 'venue_name') required String venueName,
    required String slug,
    required String status,
    @JsonKey(name: 'verification_status') required String verificationStatus,
  }) = _AddNewVenueResponseModel;

  factory AddNewVenueResponseModel.fromJson(Map<String, dynamic> json) =>
      _$AddNewVenueResponseModelFromJson(json);
}
