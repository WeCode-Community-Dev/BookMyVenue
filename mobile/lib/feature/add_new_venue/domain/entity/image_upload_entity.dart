import 'package:equatable/equatable.dart';

class UploadedImageEntity extends Equatable {
  const UploadedImageEntity({
    required this.publicId,
    required this.url,
    required this.originalFilename,
    required this.width,
    required this.height,
    required this.format,
    required this.bytes,
  });

  final String publicId;
  final String url;
  final String originalFilename;
  final int width;
  final int height;
  final String format;
  final int bytes;

  @override
  List<Object?> get props => <Object?>[
        publicId,
        url,
        originalFilename,
        width,
        height,
        format,
        bytes,
      ];
}
