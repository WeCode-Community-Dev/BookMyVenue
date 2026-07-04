import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fpdart/fpdart.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/logger/app_logger.dart';
import '../../domain/entity/add_new_venue_entity.dart';
import '../../domain/entity/image_upload_entity.dart';
import '../../domain/entity/venue_response_entity.dart';
import '../../domain/params/add_venue_params.dart';
import '../../domain/params/get_venue_params.dart';
import '../../domain/usecase/add_new_venue_usecase.dart';
import '../../domain/usecase/get_all_venues_usecase.dart';
import '../../domain/usecase/get_venue_amenities_usecase.dart';
import '../../domain/usecase/upload_images_usecase.dart';
import '../../../../core/usecase/usecase.dart';

part 'venue_event.dart';
part 'venue_state.dart';
part 'venue_bloc.freezed.dart';

class VenueBloc extends Bloc<VenueEvent, VenueState> {
  VenueBloc({
    required AddNewVenueUseCase addNewVenueUseCase,
    required GetAllVenuesUseCase getAllVenuesUseCase,
    // required GetVenueByIdUseCase getVenueByIdUseCase,
    required GetVenueAmenitiesUseCase getVenueAmenitiesUseCase,
    required UploadImagesUseCase uploadImagesUseCase,
  }) : _addNewVenueUseCase = addNewVenueUseCase,
       _getAllVenuesUseCase = getAllVenuesUseCase,
       //  _getVenueByIdUseCase = getVenueByIdUseCase,
       _getVenueAmenitiesUseCase = getVenueAmenitiesUseCase,
       _uploadImagesUseCase = uploadImagesUseCase,
       super(VenueState.initial()) {
    on<_AddNewVenue>(_onAddNewVenue);
    on<_GetAllVenues>(_onGetAllVenues);
    // on<_GetVenueById>(_onGetVenueById);
    on<_GetAmenities>(_onGetAmenities);
  }

  final AddNewVenueUseCase _addNewVenueUseCase;
  final GetAllVenuesUseCase _getAllVenuesUseCase;
  // final GetVenueByIdUseCase _getVenueByIdUseCase;
  final GetVenueAmenitiesUseCase _getVenueAmenitiesUseCase;
  final UploadImagesUseCase _uploadImagesUseCase;

  FutureOr<void> _onAddNewVenue(
    _AddNewVenue event,
    Emitter<VenueState> emit,
  ) async {
    AddNewVenueRequestParams currentParams = event.params;

    // Extract local image paths to upload
    final List<String> localPaths = <String>[];
    if (!currentParams.coverImageUrl.startsWith('http')) {
      localPaths.add(currentParams.coverImageUrl);
    }
    for (final String path in currentParams.galleryImages) {
      if (!path.startsWith('http')) {
        localPaths.add(path);
      }
    }

    if (localPaths.isNotEmpty) {
      emit(state.copyWith(addVenueStatus: VenueStatus.uploading));

      final Either<Failure, List<UploadedImageEntity>> uploadResult =
          await _uploadImagesUseCase(localPaths);

      bool uploadFailed = false;
      String? uploadErrorMessage;

      await uploadResult.fold(
        (Failure failure) async {
          uploadFailed = true;
          uploadErrorMessage = failure.message;
        },
        (List<UploadedImageEntity> uploadedImages) async {
          String getUploadedUrl(String localPath) {
            if (localPath.startsWith('http')) {
              return localPath;
            }
            final String localFilename = localPath.split('/').last;
            try {
              final UploadedImageEntity match = uploadedImages.firstWhere(
                (UploadedImageEntity e) => e.originalFilename == localFilename,
              );
              return match.url;
            } catch (_) {
              // Index-based fallback if filename matching fails
              final int index = localPaths.indexOf(localPath);
              if (index != -1 && index < uploadedImages.length) {
                return uploadedImages[index].url;
              }
              return '';
            }
          }

          final String coverUrl = getUploadedUrl(currentParams.coverImageUrl);
          final List<String> galleryUrls = currentParams.galleryImages
              .map(getUploadedUrl)
              .toList();

          if (coverUrl.isEmpty || galleryUrls.any((String u) => u.isEmpty)) {
            uploadFailed = true;
            uploadErrorMessage =
                'Failed to retrieve uploaded URLs for all images.';
          } else {
            currentParams = currentParams.copyWith(
              coverImageUrl: coverUrl,
              galleryImages: galleryUrls,
            );
          }
        },
      );

      if (uploadFailed) {
        emit(
          state.copyWith(
            addVenueStatus: VenueStatus.failure,
            errorMessage: uploadErrorMessage ?? 'Image upload failed.',
          ),
        );
        return;
      }
    }

    emit(state.copyWith(addVenueStatus: VenueStatus.loading));

    AppLogger.debug('$currentParams');

    final Either<Failure, AddNewVenueResult> result = await _addNewVenueUseCase(
      currentParams,
    );

    result.fold(
      (Failure failure) => emit(
        state.copyWith(
          addVenueStatus: VenueStatus.failure,
          errorMessage: failure.message,
        ),
      ),
      (AddNewVenueResult venueResult) => emit(
        state.copyWith(
          addVenueStatus: VenueStatus.success,
          successMessage: venueResult.message,
          addedVenue: venueResult.venue,
        ),
      ),
    );
  }

  FutureOr<void> _onGetAllVenues(
    _GetAllVenues event,
    Emitter<VenueState> emit,
  ) async {
    emit(state.copyWith(getAllVenuesStatus: VenueStatus.loading));

    final Either<Failure, VenueResponseResult> result =
        await _getAllVenuesUseCase(event.params);

    result.fold(
      (Failure failure) => emit(
        state.copyWith(
          getAllVenuesStatus: VenueStatus.failure,
          errorMessage: failure.message,
        ),
      ),
      (VenueResponseResult venueResult) => emit(
        state.copyWith(
          getAllVenuesStatus: VenueStatus.success,
          successMessage: venueResult.message,
          venues: venueResult.venue,
        ),
      ),
    );
  }

  // FutureOr<void> _onGetVenueById(
  //   _GetVenueById event,
  //   Emitter<VenueState> emit,
  // ) async {
  //   emit(state.copyWith(getVenueStatus: VenueStatus.loading));

  //   final Either<Failure, VenueResponseByIdResult> result =
  //       await _getVenueByIdUseCase(event.venueId);

  //   result.fold(
  //     (Failure failure) => emit(
  //       state.copyWith(
  //         getVenueStatus: VenueStatus.failure,
  //         errorMessage: failure.message,
  //       ),
  //     ),
  //     (VenueResponseByIdResult venueResult) => emit(
  //       state.copyWith(
  //         getVenueStatus: VenueStatus.success,
  //         successMessage: venueResult.message,
  //         selectedVenue: venueResult.venue,
  //       ),
  //     ),
  //   );
  // }

  FutureOr<void> _onGetAmenities(
    _GetAmenities event,
    Emitter<VenueState> emit,
  ) async {
    emit(state.copyWith(getAmenitiesStatus: VenueStatus.loading));

    final Either<Failure, VenueAmenityResult> result =
        await _getVenueAmenitiesUseCase(const NoParams());

    result.fold(
      (Failure failure) => emit(
        state.copyWith(
          getAmenitiesStatus: VenueStatus.failure,
          errorMessage: failure.message,
        ),
      ),
      (VenueAmenityResult amenities) => emit(
        state.copyWith(
          getAmenitiesStatus: VenueStatus.success,
          amenities: amenities.amenities,
          successMessage: amenities.message,
        ),
      ),
    );
  }
}
