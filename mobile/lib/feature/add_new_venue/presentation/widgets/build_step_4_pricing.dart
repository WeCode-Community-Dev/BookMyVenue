import 'package:flutter/material.dart';

import '../../../../core/constants/app_constant.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_dropdown.dart';
import '../../../../core/widgets/custom_text_field.dart';

class BuildStep4Pricing extends StatefulWidget {
  const BuildStep4Pricing({super.key});

  @override
  State<BuildStep4Pricing> createState() => _BuildStep4PricingState();
}

class _BuildStep4PricingState extends State<BuildStep4Pricing> {
  final TextEditingController _hourlyController = TextEditingController(
    text: '120',
  );
  final TextEditingController _dayController = TextEditingController(
    text: '950',
  );
  final TextEditingController _cleaningController = TextEditingController(
    text: '150',
  );
  final TextEditingController _depositController = TextEditingController(
    text: '500',
  );
  bool _weekendSurcharge = false;
  String? _cancellationPolicy;

  @override
  void dispose() {
    _hourlyController.dispose();
    _dayController.dispose();
    _cleaningController.dispose();
    _depositController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      spacing: AppSpacing.spaceMd,
      crossAxisAlignment: .start,
      children: <Widget>[
        const AppText('Pricing Plans', variant: TextVariant.headerText),
        Row(
          children: <Widget>[
            Expanded(
              child: Column(
                crossAxisAlignment: .start,
                children: <Widget>[
                  const AppText(r'HOURLY RATE ($)'),
                  const SizedBox(height: 8),
                  CustomTextField(
                    hint: r'HOURLY RATE ($)',
                    controller: _hourlyController,
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
            ),

            Expanded(
              child: Column(
                crossAxisAlignment: .start,
                children: <Widget>[
                  const AppText(r'DAY RATE ($)'),
                  const SizedBox(height: 8),
                  CustomTextField(
                    hint: r'DAY RATE ($)',
                    controller: _dayController,
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
            ),
          ],
        ),
        Row(
          children: <Widget>[
            Expanded(
              child: Column(
                crossAxisAlignment: .start,
                children: <Widget>[
                  const AppText(r'CLEANING FEE ($)'),
                  CustomTextField(
                    hint: r'CLEANING FEE ($)',
                    controller: _cleaningController,
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
            ),

            Expanded(
              child: Column(
                crossAxisAlignment: .start,
                children: <Widget>[
                  const AppText(r'SECURITY DEPOSIT ($)'),
                  CustomTextField(
                    hint: r'SECURITY DEPOSIT ($)',
                    controller: _depositController,
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
            ),
          ],
        ),

        // Weekend surcharge Switch
        CheckboxListTile(
          value: _weekendSurcharge,
          activeColor: AppColors.primary,
          title: const AppText('Apply Weekend Surcharges'),
          subtitle: const AppText(
            'Adds 15% to hourly rates for Saturday and Sunday bookings.',
          ),
          onChanged: (bool? val) {
            if (val != null) {
              setState(() => _weekendSurcharge = val);
            }
          },
        ),

        CustomDropdown(
          value: _cancellationPolicy,
          label: 'CANCELLATION POLICY',
          items: AppConst.cancellationPolicy,
          onChanged: (String? val) {},
        ),
      ],
    );
  }
}
