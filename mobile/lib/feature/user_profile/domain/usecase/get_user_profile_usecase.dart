import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/user_profile_entity.dart';
import '../repository/i_user_profile_repository.dart';

class GetUserProfileUseCase
    extends UseCase<ResultFuture<UserProfileResult>, NoParams> {
  GetUserProfileUseCase({required this.repository});

  final IUserProfileRepository repository;

  @override
  ResultFuture<UserProfileResult> call(NoParams params) async {
    return repository.getUserProfile();
  }
}
