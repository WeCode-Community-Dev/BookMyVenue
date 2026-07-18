import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../../data/model/update_user_profile_request.dart';
import '../entity/user_profile_entity.dart';
import '../repository/i_user_profile_repository.dart';

class UpdateUserProfileUseCase
    extends UseCase<ResultFuture<UserProfileResult>, UpdateUserProfileRequest> {
  UpdateUserProfileUseCase({required this.repository});

  final IUserProfileRepository repository;

  @override
  ResultFuture<UserProfileResult> call(UpdateUserProfileRequest params) async {
    return repository.updateUserProfile(request: params);
  }
}
