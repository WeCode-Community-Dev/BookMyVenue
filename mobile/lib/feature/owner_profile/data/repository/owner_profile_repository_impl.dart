import '../../../../core/auth/auth_session.dart';
import '../../../../core/model/api_response.dart';
import '../../../../core/network/base_repository.dart';
import '../../../../core/utils/type_def.dart';
import '../../../auth/data/datasource/auth_local_datasource.dart';
import '../../domain/entity/owner_profile_entity.dart';
import '../../domain/repository/i_owner_profile_repository.dart';
import '../datasource/i_owner_profile_remote_datasource.dart';
import '../mapper/owner_profile_mapper.dart';
import '../model/owner_profile_model.dart';

class OwnerProfileRepositoryImpl extends BaseRepository
    implements IOwnerProfileRepository {
  OwnerProfileRepositoryImpl({
    required this.remoteDatasource,
    required this.localDatasource,
  });

  final IOwnerProfileRemoteDatasource remoteDatasource;
  final IAuthLocalDatasource localDatasource;

  @override
  ResultFuture<OwnerProfileResult> getOwnerProfile() {
    return handleRequest(() async {
      final ApiResponse<OwnerProfileModel> response =
          await remoteDatasource.getOwnerProfile();

      return OwnerProfileResult(
        message: response.message ?? '',
        ownerProfile: response.data!.toEntity(),
      );
    });
  }

  @override
  ResultFuture<void> logout() {
    return handleRequest(() async {
      await localDatasource.deleteToken();
      await AuthSession.init();
    });
  }
}
