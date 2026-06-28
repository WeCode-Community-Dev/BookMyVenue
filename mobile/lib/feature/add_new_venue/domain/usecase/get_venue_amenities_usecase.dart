import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/venue_response_entity.dart';
import '../repository/i_venue_repository.dart';

class GetVenueAmenitiesUseCase
    extends UseCase<ResultFuture<VenueAmenityResult>, NoParams> {
  GetVenueAmenitiesUseCase({required this.repository});

  final IVenueRepository repository;

  @override
  ResultFuture<VenueAmenityResult> call(NoParams params) async {
    return repository.getAmenities();
  }
}
