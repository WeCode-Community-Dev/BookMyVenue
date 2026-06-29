import '../../../../core/model/api_response.dart';
import '../model/user_profile_model.dart';

abstract interface class IUserProfileRemoteDatasource {
  Future<ApiResponse<UserProfileModel>> getUserProfile();
}
