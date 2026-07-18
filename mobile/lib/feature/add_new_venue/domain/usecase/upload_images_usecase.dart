import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/image_upload_entity.dart';
import '../repository/i_venue_repository.dart';

class UploadImagesUseCase
    extends UseCase<ResultFuture<List<UploadedImageEntity>>, List<String>> {
  UploadImagesUseCase({required this.repository});

  final IVenueRepository repository;

  @override
  ResultFuture<List<UploadedImageEntity>> call(List<String> params) async {
    return repository.uploadImages(imagePaths: params);
  }
}
