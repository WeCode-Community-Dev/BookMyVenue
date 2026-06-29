import '../../../../core/model/api_response.dart';
import '../../../../core/network/base_repository.dart';
import '../../../../core/utils/type_def.dart';
import '../../../add_new_venue/domain/params/get_venue_params.dart';
import '../../domain/entity/user_venue_entity.dart';
import '../../domain/repository/i_user_venue_repository.dart';
import '../datasource/i_user_venue_remote_datasource.dart';
import '../mapper/user_venue_mapper.dart';
import '../model/user_venue_model.dart';

class UserVenueRepositoryImpl extends BaseRepository
    implements IUserVenueRepository {
  UserVenueRepositoryImpl({required this.remoteDatasource});

  final IUserVenueRemoteDatasource remoteDatasource;

  @override
  ResultFuture<UserVenueResult> getUserVenues({
    required GetVenuesParams params,
  }) {
    return handleRequest(() async {
      final ApiResponse<List<UserVenueModel>> response = await remoteDatasource
          .getUserVenues(params: params);
      return UserVenueResult(
        message: response.message ?? '',
        venues: response.data!.map((UserVenueModel e) => e.toEntity()).toList(),
      );
    });
  }
}
