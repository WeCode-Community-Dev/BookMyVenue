import 'package:flutter/material.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_cached_image.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import '../../domain/entity/venue_response_entity.dart';

class OwnerVenueDetailsScreen extends StatefulWidget {
  const OwnerVenueDetailsScreen({required this.venue, super.key});

  final VenueEntity venue;

  @override
  State<OwnerVenueDetailsScreen> createState() =>
      _OwnerVenueDetailsScreenState();
}

class _OwnerVenueDetailsScreenState extends State<OwnerVenueDetailsScreen> {
  late final VenueEntity _venue;
  late final PageController _pageController;
  late final List<String> _imageUrls;
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    _venue = widget.venue;
    _pageController = PageController();

    // Combine coverImageUrl and galleryImages URLs, filtering out duplicates/empty values
    _imageUrls = <String>[
      if (_venue.coverImageUrl.isNotEmpty) _venue.coverImageUrl,
      ..._venue.galleryImages
          .map((e) => e.imageUrl)
          .where((url) => url.isNotEmpty),
    ].toSet().toList();

    if (_imageUrls.isEmpty) {
      _imageUrls.add(
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400',
      );
    }

    _pageController.addListener(() {
      final int nextPage = _pageController.page?.round() ?? 0;
      if (_currentPage != nextPage) {
        setState(() {
          _currentPage = nextPage;
        });
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final double hourlyRate = _venue.slots.isNotEmpty
        ? _venue.slots.first.price
        : 0.0;

    final Widget detailsContent = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        // Image banner carousel with indicators and back button
        Stack(
          children: <Widget>[
            Hero(
              tag: _venue.id,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(AppShapes.radiusMd),
                child: SizedBox(
                  height: 280,
                  width: double.infinity,
                  child: PageView.builder(
                    controller: _pageController,
                    itemCount: _imageUrls.length,
                    itemBuilder: (BuildContext context, int index) {
                      return AppCachedImage(
                        imageUrl: _imageUrls[index],
                        height: 280,
                        width: double.infinity,
                        borderRadius: BorderRadius.zero,
                      );
                    },
                  ),
                ),
              ),
            ),

            // Horizontal Dot Indicators
            Positioned(
              bottom: 16,
              left: 0,
              right: 0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List<Widget>.generate(_imageUrls.length, (int index) {
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    height: 8,
                    width: _currentPage == index ? 24 : 8,
                    decoration: BoxDecoration(
                      color: _currentPage == index
                          ? AppColors.primary
                          : Colors.white.withAlpha(180),
                      borderRadius: BorderRadius.circular(4),
                    ),
                  );
                }),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Verification Status Bar
        _buildVerificationStatusCard(),
        const SizedBox(height: 16),

        // Title and Category
        Row(
          children: <Widget>[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.primary.withAlpha(10),
                borderRadius: BorderRadius.circular(12),
              ),
              child: AppText(
                _venue.category.replaceAll('_', ' ').toUpperCase(),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),

        AppText(
          _venue.venueName,
          variant: TextVariant.headingLarge,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 8),

        // Address & Rating Info
        Row(
          children: <Widget>[
            Icon(
              Icons.location_on,
              size: 16,
              color: AppColors.onSurfaceVariant,
            ),
            const SizedBox(width: 6),
            Expanded(
              child: AppText(
                _venue.location.address,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: <Widget>[
            const Icon(
              Icons.star,
              color: AppColors.primary,
              size: AppSpacing.iconXs,
            ),
            const SizedBox(width: 4),
            AppText(
              _venue.averageRating.toStringAsFixed(1),
              variant: TextVariant.captionRegular,
              color: AppColors.primaryDark,
            ),
            const SizedBox(width: 4),
            AppText('(${_venue.totalReviews} reviews)'),
          ],
        ),
        Divider(height: 40, color: AppColors.outline),

        // Highlights (Cap, Hourly Rate)
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: <Widget>[
            _buildHighlightItem(
              Icons.people_alt_outlined,
              'Capacity',
              '${_venue.maxCapacity} people',
            ),
            _buildHighlightItem(
              Icons.payments_outlined,
              'Venue Rate',
              '\u{20B9} ${hourlyRate.toStringAsFixed(0)}',
            ),
            _buildHighlightItem(
              Icons.square_foot,
              'Venue Size',
              '${_venue.venueSize} sq ft',
            ),
          ],
        ),
        Divider(height: 40, color: AppColors.outline),

        // Description
        const AppText('About the Space', variant: TextVariant.headingMedium),
        const SizedBox(height: 12),
        AppText(
          _venue.description.isNotEmpty
              ? _venue.description
              : 'This premium venue offers excellent spaces and top-notch event hospitality.',
        ),
        const SizedBox(height: 32),

        // Amenities
        const AppText('Amenities Included', variant: TextVariant.headingMedium),
        const SizedBox(height: 16),
        if (_venue.amenities.isEmpty)
          const AppText('No amenities listed.')
        else
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: _venue.amenities.map((VenueAmenityEntity amenity) {
              return Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.outline),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    const Icon(
                      Icons.check_circle_outline,
                      size: 16,
                      color: AppColors.primary,
                    ),
                    const SizedBox(width: 8),
                    AppText(amenity.name),
                  ],
                ),
              );
            }).toList(),
          ),
        const SizedBox(height: 32),

        // Slots Configured
        const AppText(
          'Configured Time Slots',
          variant: TextVariant.headingMedium,
        ),
        const SizedBox(height: 16),
        if (_venue.slots.isEmpty)
          const AppText('No time slots configured.')
        else
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _venue.slots.length,
            separatorBuilder: (BuildContext context, int index) =>
                const SizedBox(height: 12),
            itemBuilder: (BuildContext context, int index) {
              final VenueSlotEntity slot = _venue.slots[index];
              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.outline),
                ),
                child: Row(
                  children: <Widget>[
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withAlpha(10),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.schedule,
                        color: AppColors.primary,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          AppText(
                            slot.slotName,
                            fontWeight: FontWeight.bold,
                            variant: TextVariant.bodyMedium,
                          ),
                          const SizedBox(height: 4),
                          AppText(
                            '${slot.startTime} - ${slot.endTime}',
                            color: AppColors.onSurfaceVariant,
                            variant: TextVariant.captionRegular,
                          ),
                        ],
                      ),
                    ),
                    AppText(
                      '\u{20B9} ${slot.price.toStringAsFixed(0)}',
                      fontWeight: FontWeight.bold,
                      variant: TextVariant.headingMedium,
                      color: AppColors.primary,
                    ),
                  ],
                ),
              );
            },
          ),
        const SizedBox(height: 32),

        // Services Configured
        const AppText(
          'Additional Services',
          variant: TextVariant.headingMedium,
        ),
        const SizedBox(height: 16),
        if (_venue.services.isEmpty)
          const AppText('No extra services offered.')
        else
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: _venue.services.map((VenueServiceEntity service) {
              return Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.outline),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    const Icon(
                      Icons.room_service_outlined,
                      size: 16,
                      color: AppColors.primary,
                    ),
                    const SizedBox(width: 8),
                    AppText(service.serviceName, fontWeight: FontWeight.bold),
                    const SizedBox(width: 12),
                    AppText(
                      '(\u{20B9}${service.price.toStringAsFixed(0)})',
                      color: AppColors.onSurfaceVariant,
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        const SizedBox(height: 32),
        // Edit & Delete Action Buttons
        Row(
          children: <Widget>[
            Expanded(
              child: AppButton(
                label: 'Edit Venue',
                type: ButtonType.primary,
                onPressed: () {
                  // Edit action callback placeholder
                },
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: AppButton(
                label: 'Delete Venue',
                type: ButtonType.destructive,
                onPressed: () {
                  // Delete action callback placeholder
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 32),
      ],
    );

    return Scaffold(
      appBar: CustomAppBar(title: _venue.venueName),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Center(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 800),
            child: detailsContent,
          ),
        ),
      ),
    );
  }

  Widget _buildHighlightItem(IconData icon, String label, String value) {
    return Column(
      children: <Widget>[
        Icon(icon, color: AppColors.primary, size: 24),
        const SizedBox(height: 6),
        AppText(label),
        const SizedBox(height: 2),
        AppText(value, variant: TextVariant.headingMedium),
      ],
    );
  }

  Widget _buildVerificationStatusCard() {
    final String status = _venue.verificationStatus.toLowerCase();
    Color cardColor;
    Color borderColor;
    Color textColor;
    IconData icon;
    String statusTitle;
    String statusDesc;

    if (status == 'approved') {
      cardColor = const Color(0xFFF4FBF7);
      borderColor = Colors.green.shade200;
      textColor = Colors.green.shade800;
      icon = Icons.verified_user_outlined;
      statusTitle = 'Approved & Live';
      statusDesc =
          'Your venue has been verified and is now open for public bookings.';
    } else if (status == 'rejected') {
      cardColor = const Color(0xFFFFF5F5);
      borderColor = Colors.red.shade200;
      textColor = Colors.red.shade800;
      icon = Icons.gpp_bad_outlined;
      statusTitle = 'Verification Rejected';
      statusDesc =
          _venue.rejectionReason != null && _venue.rejectionReason!.isNotEmpty
          ? 'Reason: ${_venue.rejectionReason}'
          : 'Your venue verification has been rejected. Please review and update details.';
    } else {
      cardColor = const Color(0xFFFFFDF5);
      borderColor = Colors.amber.shade200;
      textColor = Colors.amber.shade800;
      icon = Icons.hourglass_empty_outlined;
      statusTitle = 'Under Review';
      statusDesc =
          'Our review team is currently verifying your venue details. This usually takes 24 hours.';
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Icon(icon, color: textColor, size: 28),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                AppText(
                  statusTitle,
                  color: textColor,
                  fontWeight: FontWeight.bold,
                  variant: TextVariant.headingMedium,
                ),
                const SizedBox(height: 4),
                AppText(statusDesc, color: textColor.withAlpha(200)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
