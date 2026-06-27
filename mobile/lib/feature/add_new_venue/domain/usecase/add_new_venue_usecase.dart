import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/add_new_venue_entity.dart';
import '../params/add_venue_params.dart';
import '../repository/i_venue_repository.dart';

class AddNewVenueUseCase
    extends UseCase<ResultFuture<AddNewVenueResult>, AddNewVenueRequestParams> {
  AddNewVenueUseCase({required this.repository});

  final IVenueRepository repository;
  @override
  ResultFuture<AddNewVenueResult> call(AddNewVenueRequestParams params) async {
    return repository.addNewVenue(requestModel: params);
  }
}
