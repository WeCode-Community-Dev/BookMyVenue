import 'package:flutter/material.dart';

import '../../../../core/constants/app_constant.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_dropdown.dart';
import '../../../../core/widgets/custom_text_field.dart';

enum VenueSortOption {
  popularity,
  priceLowToHigh,
  priceHighToLow,
  capacityHighToLow,
  nameAsc,
}

class ExploreFiltersState {
  const ExploreFiltersState({
    this.selectedCategory = 'All',
    this.maxHourlyRate = 500.0,
    this.venueSize = 0,
    this.onlyVerified = false,
    this.sortOption = VenueSortOption.popularity,
  });
  final String selectedCategory;
  final double maxHourlyRate;
  final int venueSize;
  final bool onlyVerified;
  final VenueSortOption sortOption;

  ExploreFiltersState copyWith({
    String? selectedCategory,
    double? maxHourlyRate,
    int? venueSize,
    bool? onlyVerified,
    VenueSortOption? sortOption,
  }) {
    return ExploreFiltersState(
      selectedCategory: selectedCategory ?? this.selectedCategory,
      maxHourlyRate: maxHourlyRate ?? this.maxHourlyRate,
      venueSize: venueSize ?? this.venueSize,
      onlyVerified: onlyVerified ?? this.onlyVerified,
      sortOption: sortOption ?? this.sortOption,
    );
  }
}

class BuildFilterSheet extends StatelessWidget {
  BuildFilterSheet({
    super.key,
    required this.state,
    required this.categories,
    required this.onChanged,
  });
  final ExploreFiltersState state;
  final List<String> categories;
  final ValueChanged<ExploreFiltersState> onChanged;

  static final Map<VenueSortOption, String> sortLabels =
      <VenueSortOption, String>{
        VenueSortOption.popularity: 'Popularity',
        VenueSortOption.priceLowToHigh: 'Price: Low to High',
        VenueSortOption.priceHighToLow: 'Price: High to Low',
        VenueSortOption.capacityHighToLow: 'Capacity: High to Low',
        VenueSortOption.nameAsc: 'Name: A to Z',
      };

  String? _selectedBusinessType;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: AppSpacing.cardPadding,
      child: Column(
        spacing: AppSpacing.spaceMd,
        crossAxisAlignment: .start,
        children: <Widget>[
          // Category Dropdown
          CustomDropdown(
            label: 'Category',
            value: 'All',
            items: categories,
            onChanged: (String? val) {
              if (val != null) {
                onChanged(state.copyWith(selectedCategory: val));
              }
            },
          ),

          // Sort By Dropdown
          CustomDropdown(
            label: 'Sort by',
            value: 'Popularity',
            items: VenueSortOption.values
                .map((VenueSortOption e) => sortLabels[e] ?? '')
                .toList(),
            onChanged: (String? val) {
              if (val != null) {
                onChanged(state.copyWith(selectedCategory: val));
              }
            },
          ),

          // Hourly rate limit slider
          const AppText('MAX HOURLY RATE'),
          const Row(
            spacing: AppSpacing.spaceSm,
            crossAxisAlignment: .start,
            children: <Widget>[
              Expanded(child: CustomTextField(hint: 'Low')),
              Expanded(child: CustomTextField(hint: 'High')),
            ],
          ),

          // Min Capacity Input
          const AppText('MINIMUM CAPACITY'),
          SizedBox(
            height: 40,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: AppConst.minCapacity.length,
              separatorBuilder: (_, __) => Padding(padding: AppSpacing.pxSm),
              itemBuilder: (BuildContext context, int index) {
                final String type = AppConst.minCapacity[index];

                return ChoiceChip(
                  label: Text(type),
                  selected: _selectedBusinessType == type,
                  onSelected: (bool selected) {
                    _selectedBusinessType = selected ? type : null;
                  },
                  showCheckmark: false,
                  labelStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(
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
    );
  }
}
