import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/utils/ui/snackbar_command.dart';
import '../../../../core/validation/app_validation.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_dropdown.dart';
import '../../../../core/widgets/custom_text_field.dart';
import '../../domain/enum/venue_category_enum.dart';
import '../bloc/cubit/venue_details_cubit.dart';
import 'build_action_button.dart';

class BuildStep1Basics extends StatefulWidget {
  const BuildStep1Basics({super.key});

  @override
  State<BuildStep1Basics> createState() => _BuildStep1BasicsState();
}

class _BuildStep1BasicsState extends State<BuildStep1Basics> {
  final GlobalKey<FormState> _formKeyBasics = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descController = TextEditingController();
  final TextEditingController _capacityController = TextEditingController();
  final TextEditingController _sizeController = TextEditingController();
  VenueCategory? _selectedCategory;

  final List<String> _selectedAmenities = <String>[];

  @override
  void initState() {
    super.initState();
    final VenueBasicInfoState? basicInfo = context
        .read<VenueDetailsCubit>()
        .state
        .basicInfo;
    if (basicInfo != null) {
      _nameController.text = basicInfo.venueName;
      _descController.text = basicInfo.description;
      _capacityController.text = basicInfo.minCapacity.toString();
      _sizeController.text = basicInfo.maxCapacity.toString();
      _selectedCategory = basicInfo.category;
      _selectedAmenities.addAll(basicInfo.amenityIds);
    }
  }

  final List<String> _allAmenities = <String>[
    'Free WiFi',
    'Parking',
    'Air Conditioning',
    'AV Equipment',
    'Kitchenette',
    'Accessibility',
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _descController.dispose();
    _capacityController.dispose();
    _sizeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKeyBasics,
      child: Column(
        spacing: AppSpacing.spaceMd,
        crossAxisAlignment: .start,
        children: <Widget>[
          CustomTextField(
            controller: _nameController,
            label: 'VENUE NAME',
            hint: 'e.g. Skyline Penthouse Ballroom',
            validator: AppValidation.validateVenueName,
          ),
          CustomDropdown(
            label: 'VENUE CATEGORY',
            value: _selectedCategory?.title,
            items: VenueCategory.values
                .map((VenueCategory e) => e.title)
                .toList(),
            onChanged: (String? value) {
              if (value == null) {
                return;
              }
              _selectedCategory = VenueCategoryX.fromTitle(value);
            },
            validator: (String? val) =>
                AppValidation.validateEmptyField(val, 'Category'),
          ),

          CustomTextField(
            controller: _descController,
            maxLines: 4,
            label: 'DESCRIPTION',
            hint:
                'Describe the style, architecture, view and capacity of the venue...',
            validator: (String? val) =>
                AppValidation.validateEmptyField(val, 'Description'),
          ),

          Row(
            spacing: AppSpacing.spaceMd,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Expanded(
                child: CustomTextField(
                  controller: _capacityController,
                  label: 'MAX CAPACITY',
                  hint: 'e.g. 150',
                  keyboardType: TextInputType.number,
                  validator: (String? val) =>
                      AppValidation.validateEmptyField(val, 'Max Capacity'),
                ),
              ),

              Expanded(
                child: CustomTextField(
                  controller: _sizeController,
                  label: 'SIZE (SQ FT)',
                  hint: 'e.g. 3200',
                  keyboardType: TextInputType.number,
                  validator: (String? val) =>
                      AppValidation.validateEmptyField(val, 'Size (Sq ft)'),
                ),
              ),
            ],
          ),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              AppText('AMENITIES', variant: TextVariant.headingMedium),
              AppText(
                'Select all that apply',
                variant: TextVariant.captionMedium,
              ),
            ],
          ),

          Wrap(
            spacing: AppSpacing.spaceXs,
            runSpacing: AppSpacing.spaceXs,
            children: _allAmenities.map((String amenity) {
              final bool isChecked = _selectedAmenities.contains(amenity);
              return FilterChip(
                label: AppText(
                  amenity,
                  color: isChecked ? Colors.white : AppColors.onSurface,
                ),
                selected: isChecked,
                selectedColor: AppColors.primary,
                checkmarkColor: Colors.white,
                backgroundColor: AppColors.surface,
                shape: RoundedRectangleBorder(
                  borderRadius: AppShapes.defaultBorder,
                  side: BorderSide(
                    color: isChecked ? AppColors.primary : AppColors.outline,
                  ),
                ),
                labelStyle: TextStyle(
                  fontSize: 13,
                  color: isChecked ? Colors.white : AppColors.onSurface,
                  fontWeight: isChecked ? FontWeight.bold : FontWeight.normal,
                ),
                onSelected: (bool checked) {
                  setState(() {
                    if (checked) {
                      _selectedAmenities.add(amenity);
                    } else {
                      _selectedAmenities.remove(amenity);
                    }
                  });
                },
              );
            }).toList(),
          ),
          BuildActionButton(
            onTap: (int step) {
              if (!_formKeyBasics.currentState!.validate()) {
                return;
              }
              if (_selectedAmenities.isEmpty) {
                SnackbarCommand.show(
                  type: ToastType.warning,
                  title: 'Select At least 1 amenities',
                );
                return;
              }
              context.read<VenueDetailsCubit>().updateBasicInfo(
                step: step,
                basicInfo: VenueBasicInfoState(
                  venueName: _nameController.text.trim(),
                  category: _selectedCategory!,
                  description: _descController.text.trim(),
                  minCapacity: int.parse(_capacityController.text.trim()),
                  maxCapacity: int.parse(_sizeController.text.trim()),
                  amenityIds: _selectedAmenities,
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
