import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_cropper/image_cropper.dart';

import '../../../../core/services/image_picker_service.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/utils/ui/snackbar_command.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_text_field.dart';
import '../bloc/cubit/venue_details_cubit.dart';
import 'build_action_button.dart';

class BuildStep2Media extends StatefulWidget {
  const BuildStep2Media({super.key});

  @override
  State<BuildStep2Media> createState() => _BuildStep2MediaState();
}

class _BuildStep2MediaState extends State<BuildStep2Media> {
  final ImagePickerService picker = ImagePickerService(
    cropAspectRatio: const CropAspectRatio(ratioX: 4, ratioY: 3),
  );

  final List<String> _photos = <String>[];

  final TextEditingController _virtualTourUrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    final VenueMediaState? media = context
        .read<VenueDetailsCubit>()
        .state
        .media;
    if (media != null) {
      if (media.coverImageUrl.isNotEmpty) {
        _photos.add(media.coverImageUrl);
      }
      _photos.addAll(media.galleryImages);
      _virtualTourUrl.text = media.virtualTourUrl ?? '';
    }
  }

  bool isValidUrl(String url) {
    if (url.isEmpty) {
      return true;
    }
    final Uri? uri = Uri.tryParse(url);

    return uri != null &&
        uri.hasScheme &&
        (uri.scheme == 'http' || uri.scheme == 'https');
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      spacing: AppSpacing.spaceMd,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        // Photo Uploader Card
        const AppText(
          'Venue Images',
          fontWeight: FontWeight.w600,
          variant: TextVariant.headingLarge,
        ),

        const AppText(
          'Upload at least 3 images and up to 6 images. '
          'Upload high-quality images of your venue. '
          'The first image will automatically be used as the cover photo. '
          'Adding attractive photos helps customers make booking decisions.',
          // color: AppColors.primary,
          variant: TextVariant.labelMedium,
        ),

        // const AppText( maxLines: 5),
        AppText('UPLOADED IMAGES (${_photos.length} / 6 Images)'),

        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _photos.length + 1,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
          ),
          itemBuilder: (BuildContext context, int index) {
            if (index == 0) {
              return InkWell(
                borderRadius: AppShapes.md,
                onTap: () async {
                  if (_photos.length >= 6) {
                    SnackbarCommand.show(
                      type: ToastType.warning,
                      title: "You can't upload more than  6 images.",
                    );
                    return;
                  }
                  final File? image = await picker.pickImage();
                  if (image == null) {
                    SnackbarCommand.show(
                      type: ToastType.warning,
                      title: 'Please select image',
                    );
                    return;
                  }

                  setState(() {
                    _photos.add(image.path);
                  });
                },
                child: Container(
                  decoration: BoxDecoration(
                    color: AppColors.surfaceLow,
                    borderRadius: AppShapes.md,
                    border: Border.all(color: AppColors.primary, width: 1.5),
                  ),
                  child: const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Icon(
                        Icons.add_photo_alternate_outlined,
                        size: 34,
                        color: AppColors.primary,
                      ),

                      AppText(
                        'Upload',
                        color: AppColors.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ],
                  ),
                ),
              );
            }

            return ClipRRect(
              borderRadius: AppShapes.md,
              child: Stack(
                children: <Widget>[
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        image: DecorationImage(
                          image: FileImage(File(_photos[index - 1])),
                        ),
                      ),
                    ),
                  ),

                  if (index == 1)
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: AppShapes.sm,
                        ),
                        child: const AppText(
                          'Cover',
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),

                  Positioned(
                    top: 8,
                    right: 8,
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _photos.removeAt(index - 1);
                        });
                      },
                      child: Container(
                        decoration: const BoxDecoration(
                          color: Colors.black54,
                          shape: BoxShape.circle,
                        ),
                        padding: const EdgeInsets.all(4),
                        child: const Icon(
                          Icons.close,
                          size: 14,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),

        const AppText('Virtual Tour Video', fontWeight: FontWeight.w600),

        const AppText(
          'If you have a virtual tour, YouTube video, Instagram Reel, or any public video showcasing your venue, '
          'paste the link below. This helps customers explore your venue before booking.',
          color: AppColors.textSecondary,
          maxLines: 4,
        ),
        CustomTextField(
          controller: _virtualTourUrl,
          hint: 'https://youtube.com/watch?v=...',
          prefixIcon: Icons.link,
        ),

        BuildActionButton(
          onTap: (int step) {
            if (_photos.isEmpty) {
              SnackbarCommand.show(
                type: ToastType.warning,
                title: 'Select At least 3 images',
              );
              return;
            }
            if (!isValidUrl(_virtualTourUrl.text.trim())) {
              SnackbarCommand.show(
                type: ToastType.warning,
                title:
                    'Url is invalid, No issue keep it empty if you dont have any thing',
              );
              return;
            }
            context.read<VenueDetailsCubit>().updateMedia(
              step: step,
              media: VenueMediaState(
                coverImageUrl: _photos[0],
                galleryImages: _photos.skip(1).toList(),
                virtualTourUrl: _virtualTourUrl.text.trim(),
              ),
            );
          },
        ),
      ],
    );
  }
}
