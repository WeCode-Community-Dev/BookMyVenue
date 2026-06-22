import 'package:flutter/material.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import '../widgets/build_header_filter.dart';
import '../widgets/build_venue_item.dart';

class UserVenueListPage extends StatefulWidget {
  const UserVenueListPage({super.key});

  @override
  State<UserVenueListPage> createState() => _UserVenueListPageState();
}

class _UserVenueListPageState extends State<UserVenueListPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'Venue list'),
      body: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          // Main Search Grid area
          Expanded(
            child: NestedScrollView(
              headerSliverBuilder:
                  (BuildContext context, bool innerBoxIsScrolled) => <Widget>[
                    const BuildHeaderFilter(),
                  ],
              body: Padding(
                padding: AppSpacing.screenPadding,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    // Grid View
                    Expanded(
                      child: 'a' != 'a'
                          ? Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: <Widget>[
                                  Icon(
                                    Icons.search_off,
                                    size: 64,
                                    color: AppColors.onSurfaceVariant,
                                  ),
                                  const SizedBox(height: 16),
                                  const AppText(
                                    'No results match your search criteria.',
                                  ),
                                  const SizedBox(height: 8),
                                  const AppText(
                                    'Try expanding your filters or search terms.',
                                  ),
                                ],
                              ),
                            )
                          : ListView.separated(
                              itemCount: 10,
                              separatorBuilder:
                                  (BuildContext context, int index) =>
                                      AppSpacing.h8,
                              itemBuilder: (BuildContext context, int index) {
                                return const BuildVenueItem();
                              },
                            ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
