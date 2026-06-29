import '../../../../core/utils/type_def.dart';
import '../../../add_new_venue/domain/params/get_venue_params.dart';
import '../entity/user_venue_entity.dart';

abstract interface class IUserVenueRepository {
  ResultFuture<UserVenueResult> getUserVenues({
    required GetVenuesParams params,
  });
}
