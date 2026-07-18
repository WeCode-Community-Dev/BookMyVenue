import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../../../add_new_venue/domain/params/get_venue_params.dart';
import '../entity/user_venue_entity.dart';
import '../repository/i_user_venue_repository.dart';

class GetUserVenuesUseCase
    extends UseCase<ResultFuture<UserVenueResult>, GetVenuesParams> {
  GetUserVenuesUseCase({required this.repository});

  final IUserVenueRepository repository;

  @override
  ResultFuture<UserVenueResult> call(GetVenuesParams params) async {
    return repository.getUserVenues(params: params);
  }
}
