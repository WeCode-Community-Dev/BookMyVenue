import 'package:flutter/material.dart';

import '../../../../core/router/app_router.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_cached_image.dart';
import '../../../../core/widgets/app_text.dart';
import '../../domain/entity/user_venue_entity.dart';
import '../pages/venue_details_page.dart';

class BuildVenueItem extends StatelessWidget {
  const BuildVenueItem({required this.venue, super.key});

  final UserVenueEntity venue;

  @override
  Widget build(BuildContext context) {
    final String priceStr = venue.slots.isNotEmpty
        ? venue.slots.first.price.toStringAsFixed(0)
        : '0';

    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          AppRouter.createHeroPageRoute(UserVenueDetailsScreen(venue: venue)),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: AppShapes.md,
          border: Border.all(color: AppColors.outline),
          boxShadow: <BoxShadow>[
            BoxShadow(
              color: Colors.black.withAlpha(1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            // Image and Star / Verified badge
            Stack(
              children: <Widget>[
                Hero(
                  tag: venue.id,
                  child: AppCachedImage(
                    imageUrl: venue.coverImageUrl.isNotEmpty
                        ? venue.coverImageUrl
                        : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400',
                    height: 180,
                    width: double.infinity,
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(AppShapes.radiusMd),
                    ),
                  ),
                ),
                Positioned(
                  top: 12,
                  right: 12,
                  child: InkWell(
                    onTap: () {
                      // Favorite action
                    },
                    child: Container(
                      padding: AppSpacing.pSm,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.favorite_border,
                        color: AppColors.onSurfaceVariant,
                        size: 18,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            // Text Details
            Padding(
              padding: AppSpacing.cardPadding,
              child: Column(
                spacing: AppSpacing.spaceSm,
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Column(
                    spacing: AppSpacing.spaceXs,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Row(
                        children: <Widget>[
                          AppText(
                            venue.category.replaceAll('_', ' ').toUpperCase(),
                            variant: TextVariant.labelMedium,
                            color: AppColors.primaryDark,
                          ),
                          const Spacer(),
                          const Icon(
                            Icons.star,
                            color: AppColors.primary,
                            size: AppSpacing.iconXs,
                          ),
                          AppText(
                            venue.averageRating.toStringAsFixed(1),
                            variant: TextVariant.captionRegular,
                            color: AppColors.primaryDark,
                          ),
                        ],
                      ),
                      AppText(
                        venue.venueName,
                        variant: TextVariant.headingLarge,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Row(
                        spacing: AppSpacing.spaceXs,
                        children: <Widget>[
                          Icon(
                            Icons.location_on,
                            size: 14,
                            color: AppColors.onSurfaceVariant,
                          ),
                          Expanded(
                            child: AppText(
                              venue.location.address,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Row(
                    spacing: AppSpacing.spaceXl,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Row(
                        spacing: AppSpacing.spaceXs,
                        children: <Widget>[
                          Icon(
                            Icons.people,
                            size: 14,
                            color: AppColors.onSurfaceVariant,
                          ),
                          AppText('Cap: ${venue.maxCapacity}'),
                        ],
                      ),
                      AppText(
                        '\u{20B9} $priceStr',
                        variant: TextVariant.headingLarge,
                        color: AppColors.primaryDark,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
