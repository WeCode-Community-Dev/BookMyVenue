import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/venue_response_entity.dart';
import '../repository/i_venue_repository.dart';

class GetVenueByIdUseCase
    extends UseCase<ResultFuture<VenueResponseByIdResult>, String> {
  GetVenueByIdUseCase({required this.repository});

  final IVenueRepository repository;
  @override
  ResultFuture<VenueResponseByIdResult> call(String params) async {
    return repository.getVenuesById(venueId: params);
  }
}
