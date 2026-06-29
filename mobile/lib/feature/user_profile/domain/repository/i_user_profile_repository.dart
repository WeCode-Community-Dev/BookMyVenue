import '../../../../core/utils/type_def.dart';
import '../entity/user_profile_entity.dart';

abstract interface class IUserProfileRepository {
  ResultFuture<UserProfileResult> getUserProfile();
}
