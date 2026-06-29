import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import '../../domain/entity/user_venue_entity.dart';
import '../bloc/user_venue_bloc.dart';
import '../widgets/build_header_filter.dart';
import '../widgets/build_venue_item.dart';

class UserVenueListPage extends StatefulWidget {
  const UserVenueListPage({super.key});

  @override
  State<UserVenueListPage> createState() => _UserVenueListPageState();
}

class _UserVenueListPageState extends State<UserVenueListPage> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    // Load venues initial page
    WidgetsBinding.instance.addPostFrameCallback((Duration timeStamp) {
      context.read<UserVenueBloc>().add(
        const UserVenueEvent.getUserVenues(isRefresh: true),
      );
    });
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_isBottom) {
      context.read<UserVenueBloc>().add(const UserVenueEvent.getUserVenues());
    }
  }

  bool get _isBottom {
    if (!_scrollController.hasClients) {
      return false;
    }
    final double maxScroll = _scrollController.position.maxScrollExtent;
    final double currentScroll = _scrollController.offset;
    return currentScroll >= (maxScroll * 0.9);
  }

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
              controller: _scrollController,
              headerSliverBuilder:
                  (BuildContext context, bool innerBoxIsScrolled) => <Widget>[
                    const BuildHeaderFilter(),
                  ],
              body: Padding(
                padding: AppSpacing.screenPadding,
                child: BlocBuilder<UserVenueBloc, UserVenueState>(
                  builder: (BuildContext context, UserVenueState state) {
                    if (state.status == UserVenueStatus.loading &&
                        state.venues.isEmpty) {
                      return const Center(child: CircularProgressIndicator());
                    }

                    if (state.status == UserVenueStatus.failure &&
                        state.venues.isEmpty) {
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget>[
                            AppText(
                              state.errorMessage ?? 'Failed to load venues',
                              color: Colors.red,
                            ),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: () {
                                context.read<UserVenueBloc>().add(
                                  const UserVenueEvent.getUserVenues(
                                    isRefresh: true,
                                  ),
                                );
                              },
                              child: const AppText('Retry'),
                            ),
                          ],
                        ),
                      );
                    }

                    final List<UserVenueEntity> venues = state.venues;
                    if (venues.isEmpty) {
                      return Center(
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
                      );
                    }

                    return RefreshIndicator(
                      onRefresh: () async {
                        context.read<UserVenueBloc>().add(
                          const UserVenueEvent.getUserVenues(isRefresh: true),
                        );
                      },
                      child: ListView.separated(
                        itemCount: state.hasReachedMax
                            ? venues.length
                            : venues.length + 1,
                        separatorBuilder: (BuildContext context, int index) =>
                            AppSpacing.h8,
                        itemBuilder: (BuildContext context, int index) {
                          if (index >= venues.length) {
                            return const Center(
                              child: Padding(
                                padding: EdgeInsets.all(8.0),
                                child: CircularProgressIndicator(),
                              ),
                            );
                          }
                          return BuildVenueItem(venue: venues[index]);
                        },
                      ),
                    );
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
