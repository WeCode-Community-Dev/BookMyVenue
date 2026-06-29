import '../../../../core/model/api_response.dart';
import '../../../add_new_venue/domain/params/get_venue_params.dart';
import '../model/user_venue_model.dart';

abstract interface class IUserVenueRemoteDatasource {
  Future<ApiResponse<List<UserVenueModel>>> getUserVenues({
    required GetVenuesParams params,
  });
}
