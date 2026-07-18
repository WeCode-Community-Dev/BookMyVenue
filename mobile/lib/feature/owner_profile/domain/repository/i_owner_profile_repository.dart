import '../../../../core/utils/type_def.dart';
import '../entity/owner_profile_entity.dart';

abstract interface class IOwnerProfileRepository {
  ResultFuture<OwnerProfileResult> getOwnerProfile();
  ResultFuture<void> logout();
}
