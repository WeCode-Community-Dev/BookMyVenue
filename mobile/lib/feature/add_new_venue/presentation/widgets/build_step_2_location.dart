import 'package:flutter/material.dart';

import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_text.dart';

class BuildStep2Location extends StatefulWidget {
  const BuildStep2Location({super.key});

  @override
  State<BuildStep2Location> createState() => _BuildStep2LocationState();
}

class _BuildStep2LocationState extends State<BuildStep2Location> {
  final TextEditingController _addressController = TextEditingController(
    text: '725 5th Ave, New York, NY 10022',
  );
  final List<String> _selectedAmenities = <String>[
    'Free WiFi',
    'Parking',
    'AV Equipment',
  ];
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
    _addressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        const AppText('Location & Amenities'),

        const AppText('VENUE ADDRESS'),

        TextField(
          controller: _addressController,
          decoration: InputDecoration(
            prefixIcon: Icon(
              Icons.location_on,
              color: AppColors.onSurfaceVariant,
            ),
          ),
        ),

        // Map mockup image
        Container(
          height: 240,
          decoration: BoxDecoration(
            borderRadius: AppShapes.md,
            border: Border.all(color: AppColors.outline),
          ),
          child: ClipRRect(
            borderRadius: AppShapes.md,
            child: Stack(
              children: <Widget>[
                Positioned.fill(
                  child: Image.network(
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2e2oQ4AFwo9g6fW8BO5WBfrf7x9PJF_wTgm1W5v-FsnrVUanpuWZBdJNT0QK6BFXZJ_xsfeAmhwhCixfhsI5wVPiaVUNuS9c92affpKhwv1Q7mym5x7Hlek8bZd38sj_ztrWDNr_CHkxT-ABULFRNDGetEO_I_bPhemEMK2k_3PKYyMcuU9oFxLP8fdO4uAz7tHPtJpQeGH8nvk_7dvyk-MnvNLxTSo0Bwk-5X__kYPUsdGquPoqcK8_fraQVoSGPSrJI6CajCbZW',
                    fit: BoxFit.cover,
                  ),
                ),
                Center(
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.location_on,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                ),
                Positioned(
                  bottom: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.9),
                      borderRadius: AppShapes.sm,
                    ),
                    child: Row(
                      children: <Widget>[
                        Icon(Icons.info, color: AppColors.secondary, size: 12),

                        const AppText('Precision Verified'),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 32),

        const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            AppText('AMENITIES'),
            AppText('Select all that apply'),
          ],
        ),
        const SizedBox(height: 12),

        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _allAmenities.map((String amenity) {
            final bool isChecked = _selectedAmenities.contains(amenity);
            return FilterChip(
              label: AppText(amenity),
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
        const SizedBox(height: 16),
        TextButton.icon(
          onPressed: () {
            // Add custom amenity dialog simulator
            setState(() {
              _allAmenities.add('Custom Service');
              _selectedAmenities.add('Custom Service');
            });
          },
          icon: const Icon(Icons.add, size: 16),
          label: const AppText('Add Custom Amenity'),
        ),
      ],
    );
  }
}
