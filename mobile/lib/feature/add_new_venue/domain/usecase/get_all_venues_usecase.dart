import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';

import '../entity/venue_response_entity.dart';
import '../params/get_venue_params.dart';
import '../repository/i_venue_repository.dart';

class GetAllVenuesUseCase
    extends UseCase<ResultFuture<VenueResponseResult>, GetVenuesParams> {
  GetAllVenuesUseCase({required this.repository});

  final IVenueRepository repository;
  @override
  ResultFuture<VenueResponseResult> call(GetVenuesParams params) async {
    return repository.getAllVenues(requestParams: params);
  }
}
