import '../../../../core/utils/type_def.dart';
import '../../data/model/update_user_profile_request.dart';
import '../entity/user_profile_entity.dart';

abstract interface class IUserProfileRepository {
  ResultFuture<UserProfileResult> getUserProfile();
  ResultFuture<UserProfileResult> updateUserProfile({
    required UpdateUserProfileRequest request,
  });
  ResultFuture<void> logout();
}
