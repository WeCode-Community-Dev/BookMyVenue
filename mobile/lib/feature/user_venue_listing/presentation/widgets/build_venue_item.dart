import 'package:flutter/material.dart';

import '../../../../core/router/app_router.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_cached_image.dart';
import '../../../../core/widgets/app_text.dart';
import '../pages/venue_details_page.dart';

class BuildVenueItem extends StatelessWidget {
  const BuildVenueItem({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.of(
          context,
        ).push(AppRouter.createHeroPageRoute(const UserVenueDetailsScreen()));
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
          crossAxisAlignment: .start,
          children: <Widget>[
            // Image and Star / Verified badge
            Stack(
              children: <Widget>[
                const Hero(
                  tag: 10,
                  child: AppCachedImage(
                    imageUrl:
                        'https://d3i6fh83elv35t.cloudfront.net/static/2026/06/2026-06-17T033637Z_31440324_UP1EM6H0415VH_RTRMADP_3_SOCCER-WORLDCUP-ARG-DZA-1024x674.jpg',
                    height: 180,

                    width: double.infinity,
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(AppShapes.radiusMd),
                    ),
                  ),
                ),
                Positioned(
                  top: 12,
                  right: 12,
                  child: InkWell(
                    onTap: () {
                      // appState.toggleStarred(
                      //   venue.id,
                      // );
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
                crossAxisAlignment: .start,
                mainAxisAlignment: .spaceBetween,
                children: <Widget>[
                  Column(
                    spacing: AppSpacing.spaceXs,
                    crossAxisAlignment: .start,
                    children: <Widget>[
                      Row(
                        children: <Widget>[
                          AppText(
                            'Auditorium'.toUpperCase(),
                            variant: TextVariant.labelMedium,
                            color: AppColors.primaryDark,
                          ),
                          const Spacer(),
                          const Icon(
                            Icons.star,
                            color: AppColors.primary,
                            size: AppSpacing.iconXs,
                          ),
                          const AppText(
                            '4.9',
                            variant: TextVariant.captionRegular,
                            color: AppColors.primaryDark,
                          ),
                        ],
                      ),

                      const AppText(
                        'Adathara Auditorium',
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

                          const Expanded(
                            child: AppText(
                              'Manathattikunn, Sulthan Bathery',
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
                    mainAxisAlignment: .spaceBetween,
                    children: <Widget>[
                      Row(
                        spacing: AppSpacing.spaceXs,
                        children: <Widget>[
                          Icon(
                            Icons.people,
                            size: 14,
                            color: AppColors.onSurfaceVariant,
                          ),

                          const AppText('Cap: ${1000}'),
                        ],
                      ),
                      AppText(
                        '\u{20B9} ${100.toStringAsFixed(0)}/hr',
                        variant: TextVariant.headingLarge,
                        color: AppColors.primaryDark,
                      ),
                      // Expanded(
                      //   child: AppButton(
                      //     onPressed: () {},
                      //     label: 'View details',
                      //     size: ButtonSize.small,
                      //     borderRadius: AppShapes.sm,
                      //   ),
                      // ),
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
