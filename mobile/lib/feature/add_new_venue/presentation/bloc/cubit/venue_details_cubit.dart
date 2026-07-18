import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../domain/enum/venue_category_enum.dart';
import '../../../domain/entity/venue_response_entity.dart';

part 'venue_details_state.dart';

part 'venue_details_cubit.freezed.dart';

class VenueDetailsCubit extends Cubit<VenueDetailsState> {
  VenueDetailsCubit() : super(const VenueDetailsState(step: 1));

  void updateBasicInfo({
    required int step,
    required VenueBasicInfoState basicInfo,
  }) {
    emit(state.copyWith(basicInfo: basicInfo, step: step));
  }

  void updateMedia({required int step, required VenueMediaState media}) {
    emit(state.copyWith(media: media, step: step));
  }

  void updateLocation({
    required int step,
    required VenueLocationState location,
  }) {
    emit(state.copyWith(location: location, step: step));
  }

  void updatePricing({
    required int step,
    required List<VenuePricingState> pricing,
    required List<VenueServiceState> service,
  }) {
    emit(state.copyWith(pricing: pricing, service: service, step: step));
  }
}
