import '../../../../core/model/api_response.dart';
import '../model/owner_profile_model.dart';

abstract interface class IOwnerProfileRemoteDatasource {
  Future<ApiResponse<OwnerProfileModel>> getOwnerProfile();
}
