import 'package:flutter/material.dart';

import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_text.dart';

class BuildStep3Media extends StatelessWidget {
  const BuildStep3Media({super.key});

  static const List<String> _photos = <String>[];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        const AppText('Media & Gallery'),

        const AppText('UPLOAD PHOTOS'),

        // Photo Uploader Card
        InkWell(
          onTap: () {
            // Simulate photo selection
            // setState(() {
            //   _photos.addAll(<String>[
            //     'https://lh3.googleusercontent.com/aida-public/AB6AXuB9kYTQIvO-WFQRgWcnkYPiFP7AmHjM-U1CqbFmhm7Y18ihtZ5FdQN9VJuSZCIZEKgbMyX2S103PNSd7Q7VSr3PcB_zYbRcjhYhbTeSC2ws3H7OdLbebQEs1C14LGeSko352t79nMZT2bD3ww11ixFSL6RCZP3K7Ik6iity2MJMqeT3qqOg1lqgVBp0pbemTQl1GPL5HdHLXJmwJSD-w8hcxGjuJ5WhpIweND6ZPePHVjBcT97hllHhYDl6Rn-PZxMU_5_qcUJpDM-B',
            //     'https://lh3.googleusercontent.com/aida-public/AB6AXuAGPBl0QRIqnJyQiq279yXjyeNcTCZA5o1kPg58pIzVx3czHRC3ow2lP5tf8mqLnRtbVtWuy0R0sKLvG-JqBvmPO6BQjh5uuHS1iwrRDTThqJz47ThJvaxGDc5-eD0L8lBK73_yiTM3UXyQLbbfRbNgk8h03CojWX9CUc_u5PMcqurgEO9TXy63pm0_PrzmD9ZSsbk6ttEIQ-NqDqQAoIHT1uq8rd0mXe1oXDRT6GJ-kSwQPtMCJ2xApviqbnRjI7yUPJPSJmt3usaD',
            //     'https://lh3.googleusercontent.com/aida-public/AB6AXuDYGzQ3hphrgvqVUb8yZ6RxRnuzGy0tGpPXhVaM3SgNg4jfgKdVWKqzdRQg5VCvamF6rllm0H6_7QrjfTT-6Xavpv-kviAG2mmv-5W-f8b64Q0I7PMgKVQFgt-5ve3GilZaAE7nZJcqlOpcViYTuFe0y-r4JOest31ckWyhmfB7IKT5KIUSc1Mrbvp3KtG9kQg01q-1ciZCu8GS-MloGn9iBxUM1lOjQaZd3ilEANKnNHBL-ZsMo___t8iRv42uEs8husu_rMR7r9Hc',
            //   ]);
            // });
          },
          borderRadius: AppShapes.md,
          child: Container(
            height: 180,
            decoration: BoxDecoration(
              color: AppColors.surfaceLow,
              borderRadius: AppShapes.md,
              border: Border.all(
                color: AppColors.primary,
                width: 2,
                style: BorderStyle.solid,
              ),
            ),
            child: const Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Icon(
                  Icons.cloud_upload_outlined,
                  size: 48,
                  color: AppColors.primary,
                ),
                SizedBox(height: 16),
                AppText('Click to upload files'),
                SizedBox(height: 6),
                AppText('PNG, JPG up to 10MB each'),
              ],
            ),
          ),
        ),
        const SizedBox(height: 32),

        if (_photos.isNotEmpty) ...<Widget>[
          AppText('UPLOADED IMAGES (${_photos.length})'),
          const SizedBox(height: 12),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.0,
            ),
            itemCount: _photos.length,
            itemBuilder: (BuildContext context, int index) {
              final String photo = _photos[index];
              final bool isCover = index == 0;
              return ClipRRect(
                borderRadius: AppShapes.defaultBorder,
                child: Stack(
                  children: <Widget>[
                    Positioned.fill(
                      child: Image.network(photo, fit: BoxFit.cover),
                    ),
                    if (isCover)
                      Positioned(
                        top: 6,
                        left: 6,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: AppShapes.sm,
                          ),
                          child: const AppText('Cover'),
                        ),
                      ),
                    Positioned(
                      top: 6,
                      right: 6,
                      child: GestureDetector(
                        onTap: () {
                          // setState(() {
                          //   _photos.removeAt(index);
                          // });
                        },
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: const BoxDecoration(
                            color: Colors.black54,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.close,
                            color: Colors.white,
                            size: 12,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ],
    );
  }
}
