import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/app_router.dart';
import '../../../../core/router/route_name.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_cached_image.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import '../../../user_venue_listing/presentation/pages/venue_details_page.dart';

class UserDashboard extends StatefulWidget {
  const UserDashboard({super.key});

  @override
  State<UserDashboard> createState() => _UserDashboardState();
}

class _UserDashboardState extends State<UserDashboard> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedCategory = 'All';

  final List<Map<String, dynamic>> _categories = <Map<String, dynamic>>[
    <String, dynamic>{'name': 'All', 'icon': Icons.grid_view},
    <String, dynamic>{
      'name': 'Studio & Loft',
      'icon': Icons.camera_alt_outlined,
    },
    <String, dynamic>{
      'name': 'Banquets & Weddings',
      'icon': Icons.celebration_outlined,
    },
    <String, dynamic>{
      'name': 'Corporate Meeting Room',
      'icon': Icons.business_outlined,
    },
    <String, dynamic>{
      'name': 'Outdoor & Lounge',
      'icon': Icons.wb_sunny_outlined,
    },
    <String, dynamic>{
      'name': 'Industrial Exhibition',
      'icon': Icons.warehouse_outlined,
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'Book My Venue'),
      body: SingleChildScrollView(
        child: Center(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 1200),
            padding: const EdgeInsets.symmetric(
              horizontal: 20.0,
              vertical: 32.0,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                // Top Greeting
                const Column(
                  crossAxisAlignment: .start,
                  children: <Widget>[
                    AppText('Hello,  "Event Planner" 👋'),

                    AppText(
                      'Find and book premium spaces for your next big event.',
                    ),
                  ],
                ),

                // Hero Promo Banner
                _buildPromoBanner(context),

                // Search Bar
                const AppText('What are you planning?'),

                Row(
                  children: <Widget>[
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: AppShapes.defaultBorder,
                          boxShadow: <BoxShadow>[
                            BoxShadow(
                              color: AppColors.primary.withOpacity(0.04),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: TextFormField(
                          controller: _searchController,
                          decoration: InputDecoration(
                            hintText:
                                'Search by city, venue name, or category...',
                            prefixIcon: Icon(
                              Icons.search,
                              color: AppColors.onSurfaceVariant,
                            ),
                            suffixIcon: _searchController.text.isNotEmpty
                                ? IconButton(
                                    icon: const Icon(Icons.clear),
                                    onPressed: () {
                                      setState(() {
                                        _searchController.clear();
                                      });
                                    },
                                  )
                                : null,
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: OutlineInputBorder(
                              borderRadius: AppShapes.defaultBorder,
                              borderSide: const BorderSide(
                                color: AppColors.primary,
                                width: 1.5,
                              ),
                            ),
                          ),
                          onChanged: (String val) {
                            setState(() {});
                          },
                        ),
                      ),
                    ),

                    // Quick Action explore button
                    Expanded(
                      child: SizedBox(
                        height: 56,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: AppShapes.defaultBorder,
                            ),
                            padding: const EdgeInsets.symmetric(horizontal: 24),
                            elevation: 0,
                          ),
                          onPressed: () {
                            // Change index tab to Explore (1)
                            // appState.setActiveTab(1);
                          },
                          child: const Icon(Icons.tune),
                        ),
                      ),
                    ),
                  ],
                ),

                // Categories horizontal selector
                SizedBox(
                  height: 48,
                  child: ListView.builder(
                    scrollDirection: .horizontal,
                    itemCount: _categories.length,
                    itemBuilder: (BuildContext context, int index) {
                      final Map<String, dynamic> cat = _categories[index];
                      final bool isSelected = _selectedCategory == cat['name'];
                      return Container(
                        margin: const EdgeInsets.only(right: 12),
                        child: ChoiceChip(
                          avatar: Icon(
                            cat['icon'] as IconData,
                            size: 16,
                            color: isSelected
                                ? Colors.white
                                : AppColors.onSurfaceVariant,
                          ),
                          label: AppText(cat['name'].toString()),
                          selected: isSelected,
                          onSelected: (bool selected) {
                            setState(() {
                              _selectedCategory = cat['name'].toString();
                            });
                          },
                          selectedColor: AppColors.primary,
                          labelStyle: TextStyle(
                            color: isSelected
                                ? Colors.white
                                : AppColors.onSurfaceVariant,
                            fontWeight: isSelected
                                ? FontWeight.bold
                                : FontWeight.w500,
                            fontSize: 13,
                          ),
                          side: BorderSide(
                            color: isSelected
                                ? AppColors.primary
                                : AppColors.outline,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                        ),
                      );
                    },
                  ),
                ),

                // Featured / Top Venues Section
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    const AppText('Featured Venues'),

                    AppTextButton(
                      icon: Icons.arrow_forward,
                      title: 'View All',
                      onPressed: () {
                        context.go(AppRouteNames.listVenue);
                        // appState.setActiveTab(1);
                      },
                    ),
                  ],
                ),

                // Horizontal list of venues
                SizedBox(
                  height: 280,
                  child: 'a' != 'a'
                      ? Center(
                          child: Column(
                            mainAxisAlignment: .center,
                            children: <Widget>[
                              Icon(
                                Icons.search_off,
                                size: 48,
                                color: AppColors.onSurfaceVariant,
                              ),

                              const AppText('No venues match your filters.'),
                            ],
                          ),
                        )
                      : ListView.builder(
                          scrollDirection: Axis.horizontal,
                          padding: EdgeInsets.zero,
                          itemCount: 10,
                          itemBuilder: (BuildContext context, int index) {
                            return GestureDetector(
                              onTap: () {
                                // Navigate to details
                                Navigator.of(context).push(
                                  AppRouter.createHeroPageRoute(
                                    const UserVenueDetailsScreen(),
                                  ),
                                );
                              },
                              child: Container(
                                width: 280,
                                margin: const EdgeInsets.only(right: 20),
                                decoration: BoxDecoration(
                                  color: AppColors.surface,
                                  borderRadius: AppShapes.md,
                                  border: Border.all(color: AppColors.outline),
                                  boxShadow: <BoxShadow>[
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.02),
                                      blurRadius: 10,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Column(
                                  crossAxisAlignment: .start,
                                  children: <Widget>[
                                    // Image & Favorite
                                    Stack(
                                      children: <Widget>[
                                        const Hero(
                                          tag: 10,
                                          child: AppCachedImage(
                                            imageUrl:
                                                'https://d3i6fh83elv35t.cloudfront.net/static/2026/06/2026-06-17T033637Z_31440324_UP1EM6H0415VH_RTRMADP_3_SOCCER-WORLDCUP-ARG-DZA-1024x674.jpg',
                                            height: 160,

                                            width: double.infinity,
                                            borderRadius: BorderRadius.vertical(
                                              top: Radius.circular(
                                                AppShapes.radiusMd,
                                              ),
                                            ),
                                          ),
                                        ),

                                        Positioned(
                                          top: 12,
                                          right: 12,
                                          child: InkWell(
                                            onTap: () {
                                              // appState.toggleStarred(venue.id);
                                            },
                                            child: Container(
                                              padding: const EdgeInsets.all(8),
                                              decoration: BoxDecoration(
                                                color: AppColors.surface,
                                                shape: BoxShape.circle,
                                              ),
                                              child: Icon(
                                                Icons.favorite_border,
                                                color:
                                                    AppColors.onSurfaceVariant,
                                                size: 18,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    // Details
                                    Padding(
                                      padding: const EdgeInsets.all(16),
                                      child: Column(
                                        crossAxisAlignment: .start,
                                        children: <Widget>[
                                          Column(
                                            crossAxisAlignment: .start,
                                            children: <Widget>[
                                              AppText(
                                                'Auditorium'.toUpperCase(),
                                              ),

                                              const AppText(
                                                'Venue name',
                                                maxLines: 1,
                                                overflow: .ellipsis,
                                              ),

                                              Row(
                                                children: <Widget>[
                                                  Icon(
                                                    Icons.location_on,
                                                    size: 14,
                                                    color: AppColors
                                                        .onSurfaceVariant,
                                                  ),

                                                  const Expanded(
                                                    child: AppText(
                                                      'venue.address',
                                                      maxLines: 1,
                                                      overflow: .ellipsis,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                          Row(
                                            mainAxisAlignment: .spaceBetween,
                                            children: <Widget>[
                                              Row(
                                                children: <Widget>[
                                                  Icon(
                                                    Icons.people,
                                                    size: 14,
                                                    color: AppColors
                                                        .onSurfaceVariant,
                                                  ),

                                                  const AppText('Up to ${100}'),
                                                ],
                                              ),
                                              AppText(
                                                '\$${100.toStringAsFixed(0)}/hr',
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
                          },
                        ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPromoBanner(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: <Color>[
            AppColors.outlineFocus,
            AppColors.primary,
            AppColors.primaryDark,
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        borderRadius: AppShapes.lg,
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: AppColors.primary.withOpacity(0.12),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: .start,
        children: <Widget>[
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.amber,
              borderRadius: BorderRadius.circular(20),
            ),
            child: const AppText('LIMITED OFFER'),
          ),

          const AppText('Book Executive Suite M-1'),

          const AppText(
            'Get 20% off corporate events this week. Enter code COMP20 at checkout.',
          ),
          ClipRRect(
            borderRadius: AppShapes.md,
            child: Image.network(
              'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
              width: double.infinity,
              height: 180,
              fit: BoxFit.cover,
            ),
          ),

          AppButton(
            label: 'Book Now',
            onPressed: () {
              /// Try to find Executive Suite M-1 (V-103)
              // final appState = Provider.of<AppState>(
              //   context,
              //   listen: false,
              // );
              // final suite = appState.venues.firstWhere(
              //   (v) => v.id == 'V-103',
              //   orElse: () => appState.venues.first,
              // );
              Navigator.of(context).push(
                AppRouter.createHeroPageRoute(const UserVenueDetailsScreen()),
              );
            },
          ),
        ],
      ),
    );
  }
}
