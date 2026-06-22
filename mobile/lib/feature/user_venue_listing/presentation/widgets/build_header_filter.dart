import 'package:flutter/material.dart';

import '../../../../core/constants/app_constant.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/custom_text_field.dart';
import 'build_filter_sheet.dart';

class BuildHeaderFilter extends StatefulWidget {
  const BuildHeaderFilter({super.key});

  @override
  State<BuildHeaderFilter> createState() => _BuildHeaderFilterState();
}

class _BuildHeaderFilterState extends State<BuildHeaderFilter> {
  final TextEditingController _searchController = TextEditingController();
  String? _selectedBusinessType;

  ExploreFiltersState _filtersState = const ExploreFiltersState();

  final List<String> _categories = <String>[
    'All',
    'Studio & Loft',
    'Banquets & Weddings',
    'Corporate Meeting Room',
    'Outdoor & Lounge',
    'Industrial Exhibition',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SliverToBoxAdapter(
      child: Container(
        color: AppColors.surface,
        padding: AppSpacing.cardPadding,
        child: Column(
          spacing: AppSpacing.spaceMd,
          children: <Widget>[
            Row(
              children: <Widget>[
                Expanded(
                  child: CustomTextField(
                    hint: 'Search by city, name, or keywords...',
                    controller: _searchController,
                  ),
                ),
                AppIconButton(
                  icon: Icons.tune,
                  onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      builder: (BuildContext context) {
                        return BuildFilterSheet(
                          state: _filtersState,
                          categories: _categories,
                          onChanged: (ExploreFiltersState newState) {
                            setState(() {
                              _filtersState = newState;
                            });
                          },
                        );
                      },
                    );
                  },
                  size: AppSpacing.iconXl,
                ),
              ],
            ),
            SizedBox(
              height: 40,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: AppConst.businessTypes.length,
                separatorBuilder: (_, __) => Padding(padding: AppSpacing.pxSm),
                itemBuilder: (BuildContext context, int index) {
                  final String type = AppConst.businessTypes[index];

                  return ChoiceChip(
                    label: Text(type),
                    selected: _selectedBusinessType == type,
                    onSelected: (bool selected) {
                      setState(() {
                        _selectedBusinessType = selected ? type : null;
                      });
                    },
                    showCheckmark: false,
                    labelStyle: Theme.of(context).textTheme.bodyMedium
                        ?.copyWith(
                          color: _selectedBusinessType == type
                              ? Colors.white
                              : AppColors.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                    backgroundColor: AppColors.surface,
                    selectedColor: AppColors.primary,
                    side: BorderSide(
                      color: _selectedBusinessType == type
                          ? AppColors.primary
                          : AppColors.onSurfaceVariant,
                    ),
                    shape: RoundedRectangleBorder(borderRadius: AppShapes.full),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
