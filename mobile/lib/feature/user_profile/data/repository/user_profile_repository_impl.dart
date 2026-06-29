import '../../../../core/model/api_response.dart';
import '../../../../core/network/base_repository.dart';
import '../../../../core/utils/type_def.dart';
import '../../domain/entity/user_profile_entity.dart';
import '../../domain/repository/i_user_profile_repository.dart';
import '../datasource/i_user_profile_remote_datasource.dart';
import '../mapper/user_profile_mapper.dart';
import '../model/user_profile_model.dart';

class UserProfileRepositoryImpl extends BaseRepository
    implements IUserProfileRepository {
  UserProfileRepositoryImpl({required this.remoteDatasource});

  final IUserProfileRemoteDatasource remoteDatasource;

  @override
  ResultFuture<UserProfileResult> getUserProfile() {
    return handleRequest(() async {
      final ApiResponse<UserProfileModel> response = await remoteDatasource
          .getUserProfile();
      return UserProfileResult(
        message: response.message ?? '',
        user: response.data!.toEntity(),
      );
    });
  }
}
