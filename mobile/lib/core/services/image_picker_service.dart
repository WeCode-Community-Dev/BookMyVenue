import 'dart:io';

import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';

class ImagePickerService {
  ImagePickerService({this.cropAspectRatio, this.imageQuality = 90});

  final CropAspectRatio? cropAspectRatio;
  final int imageQuality;

  final ImagePicker _picker = ImagePicker();

  Future<File?> pickImage({
    ImageSource source = ImageSource.gallery,
    bool enableCrop = true,
  }) async {
    final XFile? image = await _picker.pickImage(
      source: source,
      imageQuality: imageQuality,
    );

    if (image == null) {
      return null;
    }

    if (!enableCrop) {
      return File(image.path);
    }

    return _cropImage(image.path);
  }

  Future<List<File>> pickMultiImage({
    bool enableCrop = false,
    int maxImages = 6,
  }) async {
    final List<XFile> images = await _picker.pickMultiImage(
      imageQuality: imageQuality,
    );

    if (images.isEmpty) {
      return <File>[];
    }

    final List<XFile> selected = images.take(maxImages).toList();

    if (!enableCrop) {
      return selected.map((XFile e) => File(e.path)).toList();
    }

    final List<File> cropped = <File>[];

    for (final XFile image in selected) {
      final File? file = await _cropImage(image.path);

      if (file != null) {
        cropped.add(file);
      }
    }

    return cropped;
  }

  Future<File?> _cropImage(String path) async {
    final CroppedFile? cropped = await ImageCropper().cropImage(
      sourcePath: path,
      compressQuality: imageQuality,
      aspectRatio: cropAspectRatio,
      uiSettings: <PlatformUiSettings>[
        AndroidUiSettings(
          toolbarTitle: 'Crop Image',
          lockAspectRatio: cropAspectRatio != null,
          hideBottomControls: false,
        ),
        IOSUiSettings(
          title: 'Crop Image',
          aspectRatioLockEnabled: cropAspectRatio != null,
        ),
      ],
    );

    if (cropped == null) {
      return null;
    }

    return File(cropped.path);
  }
}
