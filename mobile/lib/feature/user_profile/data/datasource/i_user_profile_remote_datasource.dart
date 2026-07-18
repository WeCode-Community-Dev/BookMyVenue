import '../../../../core/model/api_response.dart';
import '../model/update_user_profile_request.dart';
import '../model/user_profile_model.dart';

abstract interface class IUserProfileRemoteDatasource {
  Future<ApiResponse<UserProfileModel>> getUserProfile();
  Future<ApiResponse<UserProfileModel>> updateUserProfile({
    required UpdateUserProfileRequest request,
  });
}
