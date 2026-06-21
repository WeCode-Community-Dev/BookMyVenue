import 'package:flutter/material.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_text.dart';

class BuildActionButton extends StatelessWidget {
  const BuildActionButton({super.key, required this.step, required this.onTap});
  final int step;
  final Function(int) onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.outline)),
      ),
      padding: const EdgeInsets.all(16),
      child: Row(
        spacing: AppSpacing.spaceSm,
        mainAxisAlignment: .spaceBetween,
        children: <Widget>[
          Expanded(
            child: OutlinedButton(
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: AppColors.secondary, width: 2),
                shape: RoundedRectangleBorder(
                  borderRadius: AppShapes.defaultBorder,
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 28,
                  vertical: 12,
                ),
              ),
              onPressed: () {
                if (step == 1) {
                  // widget.onClose();
                } else {
                  onTap(step - 1);
                  // appState.setWizardStep(step - 1);
                }
              },
              child: const AppText('Back'),
            ),
          ),
          Expanded(
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: AppShapes.defaultBorder,
                ),
                padding: const EdgeInsets.symmetric(
                  horizontal: 28,
                  vertical: 12,
                ),
              ),
              onPressed: () {
                if (step == 1) {
                  // if (_formKeyBasics.currentState!.validate()) {
                  // appState.saveWizardBasics(
                  //   _nameController.text,
                  //   _descController.text,
                  //   _selectedType,
                  //   int.tryParse(_capacityController.text) ?? 100,
                  //   double.tryParse(_sizeController.text) ?? 2000.0,
                  // );
                  // }
                } else if (step == 2) {
                  // appState.saveWizardDetails(
                  //   _addressController.text,
                  //   _selectedAmenities,
                  // );
                } else if (step == 3) {
                  // if (_photos.isEmpty) {
                  //   ScaffoldMessenger.of(context).showSnackBar(
                  //     const SnackBar(
                  //       content: AppText('Please upload at least one photo.'),
                  //     ),
                  //   );
                  //   return;
                  // }
                  // appState.saveWizardPhotos(_photos);
                } else if (step == 4) {
                  // appState.submitWizard(
                  //   double.tryParse(_hourlyController.text) ?? 120.0,
                  //   double.tryParse(_dayController.text) ?? 950.0,
                  //   double.tryParse(_cleaningController.text) ?? 150.0,
                  //   double.tryParse(_depositController.text) ?? 500.0,
                  // );
                  // widget.onClose();
                  // ScaffoldMessenger.of(context).showSnackBar(
                  //   SnackBar(
                  //     content: const AppText('Venue published successfully!'),
                  //     backgroundColor: AppColors.success,
                  //   ),
                  // );
                }
                onTap(step + 1);
              },
              child: AppText(step == 4 ? 'Publish Venue' : 'Next'),
            ),
          ),
        ],
      ),
    );
  }
}
