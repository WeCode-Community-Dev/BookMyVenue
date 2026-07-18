import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/auth/auth_session.dart';
import '../../../../core/router/route_name.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_cached_image.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import '../../domain/entity/venue_response_entity.dart';
import '../../domain/params/get_venue_params.dart';
import '../bloc/venue_bloc.dart';
import 'venue_details.dart';

class OwnerAllVenues extends StatefulWidget {
  const OwnerAllVenues({super.key});

  @override
  State<OwnerAllVenues> createState() => _OwnerAllVenuesState();
}

class _OwnerAllVenuesState extends State<OwnerAllVenues> {
  Future<void> _fetchVenues() async {
    final String userId = AuthSession.userId ?? '';
    context.read<VenueBloc>().add(
      VenueEvent.getAllVenues(
        params: GetVenuesParams(skip: 0, limit: 20, ownerId: userId),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: CustomAppBar(
        title: 'My Venues',
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              context.pop();
            },
          ),
        ],
      ),
      body: BlocBuilder<VenueBloc, VenueState>(
        builder: (BuildContext context, VenueState state) {
          if (state.getAllVenuesStatus == VenueStatus.loading ||
              state.getAllVenuesStatus == VenueStatus.initial) {
            return const Padding(
              padding: EdgeInsets.all(16),
              child: _ShimmerLoadingGrid(),
            );
          }

          if (state.getAllVenuesStatus == VenueStatus.failure) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  const Icon(
                    Icons.error_outline,
                    size: 64,
                    color: AppColors.primary,
                  ),
                  const SizedBox(height: 16),
                  AppText(state.errorMessage ?? 'Failed to load venues'),
                  const SizedBox(height: 24),
                  AppButton(
                    label: 'Retry',
                    onPressed: _fetchVenues,
                    minWidth: 120,
                  ),
                ],
              ),
            );
          }

          final List<VenueEntity> venues = state.venues;

          if (venues.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Icon(
                      Icons.storefront_outlined,
                      size: 80,
                      color: AppColors.onSurfaceVariant.withAlpha(80),
                    ),
                    const SizedBox(height: 16),
                    const AppText(
                      'No Venues Listed',
                      variant: TextVariant.headingLarge,
                    ),
                    const SizedBox(height: 8),
                    const AppText(
                      'You have not added any venues yet. Start by publishing your first venue to reach clients.',
                      maxLines: 3,
                    ),
                    const SizedBox(height: 24),
                    AppButton(
                      label: 'Add Venue',
                      onPressed: () {
                        context.pushNamed(AppRouteNames.addNewVenue);
                      },
                      minWidth: 160,
                    ),
                  ],
                ),
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _fetchVenues,
            child: GridView.builder(
              padding: AppSpacing.screenPadding,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.70,
              ),
              itemCount: venues.length,
              itemBuilder: (BuildContext context, int index) {
                final VenueEntity venue = venues[index];
                return _buildVenueCard(context, venue);
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildVenueCard(BuildContext context, VenueEntity venue) {
    final double hourlyRate = venue.slots.isNotEmpty
        ? venue.slots.first.price
        : 0.0;

    return InkWell(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute<void>(
            builder: (BuildContext context) =>
                OwnerVenueDetailsScreen(venue: venue),
          ),
        );
      },
      borderRadius: AppShapes.md,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: AppShapes.md,
          border: Border.all(color: AppColors.outline),
          boxShadow: <BoxShadow>[
            BoxShadow(
              color: Colors.black.withAlpha(10),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            // Image slot with overlay price tag
            Expanded(
              child: Stack(
                children: <Widget>[
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(AppShapes.radiusMd),
                    ),
                    child: Hero(
                      tag: venue.id,
                      child: AppCachedImage(
                        imageUrl: venue.coverImageUrl,
                        height: double.infinity,
                        width: double.infinity,
                      ),
                    ),
                  ),
                  Positioned(
                    top: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black.withAlpha(150),
                        borderRadius: AppShapes.sm,
                      ),
                      child: AppText(
                        '\u{20B9} ${hourlyRate.toStringAsFixed(0)}',
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        variant: TextVariant.captionRegular,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Content
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  AppText(
                    venue.category.replaceAll('_', ' ').toUpperCase(),
                    variant: TextVariant.captionRegular,
                    color: AppColors.primary,
                    fontWeight: FontWeight.bold,
                  ),
                  const SizedBox(height: 4),
                  AppText(
                    venue.venueName,
                    variant: TextVariant.headingMedium,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: <Widget>[
                      Icon(
                        Icons.people_outline,
                        size: 14,
                        color: AppColors.onSurfaceVariant,
                      ),
                      const SizedBox(width: 4),
                      AppText(
                        'Up to ${venue.maxCapacity}',
                        variant: TextVariant.captionRegular,
                      ),
                      const Spacer(),
                      Icon(
                        Icons.square_foot,
                        size: 14,
                        color: AppColors.onSurfaceVariant,
                      ),
                      const SizedBox(width: 4),
                      AppText(
                        '${venue.venueSize} sq ft',
                        variant: TextVariant.captionRegular,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _buildVerificationBadge(venue.verificationStatus),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVerificationBadge(String verificationStatus) {
    final String status = verificationStatus.toLowerCase();
    Color bgColor;
    Color iconColor;
    Color textColor;
    IconData icon;
    String label;

    if (status == 'approved') {
      bgColor = const Color(0xFFE8F5E9);
      iconColor = Colors.green;
      textColor = Colors.green.shade800;
      icon = Icons.verified;
      label = 'Approved';
    } else if (status == 'rejected') {
      bgColor = const Color(0xFFFFEBEE);
      iconColor = Colors.red;
      textColor = Colors.red.shade800;
      icon = Icons.cancel;
      label = 'Rejected';
    } else {
      bgColor = const Color(0xFFFFF8E1);
      iconColor = Colors.amber;
      textColor = Colors.amber.shade800;
      icon = Icons.hourglass_top;
      label = 'Pending';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Icon(icon, color: iconColor, size: 12),
          const SizedBox(width: 4),
          AppText(
            label,
            color: textColor,
            fontWeight: FontWeight.w600,
            variant: TextVariant.captionRegular,
          ),
        ],
      ),
    );
  }
}

class _ShimmerLoadingGrid extends StatelessWidget {
  const _ShimmerLoadingGrid();

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.70,
      ),
      itemCount: 6,
      itemBuilder: (BuildContext context, int index) {
        return Container(
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: AppShapes.md,
            border: Border.all(color: AppColors.outline),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Expanded(
                child: Container(
                  decoration: const BoxDecoration(
                    color: Color(0xFFEAEAEA),
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(AppShapes.radiusMd),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Container(
                      height: 10,
                      width: 60,
                      color: const Color(0xFFEAEAEA),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      height: 14,
                      width: 100,
                      color: const Color(0xFFEAEAEA),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: <Widget>[
                        Container(
                          height: 10,
                          width: 40,
                          color: const Color(0xFFEAEAEA),
                        ),
                        const Spacer(),
                        Container(
                          height: 10,
                          width: 40,
                          color: const Color(0xFFEAEAEA),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Container(
                      height: 16,
                      width: 70,
                      color: const Color(0xFFEAEAEA),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
