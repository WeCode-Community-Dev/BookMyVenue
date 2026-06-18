import 'package:flutter/material.dart';

import '../../../../core/utils/colors.dart';
import '../../../../core/widgets/app_text.dart';

class BuildStepper extends StatelessWidget {
  const BuildStepper({super.key, required this.step});
  final int step;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.outline)),
      ),
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          _BuildStepIndicator(
            number: 1,
            label: 'Basics',
            active: step >= 1,
            current: step == 1,
          ),
          _BuildStepLine(isActive: step >= 2),
          _BuildStepIndicator(
            number: 2,
            label: 'Location',
            active: step >= 2,
            current: step == 2,
          ),
          _BuildStepLine(isActive: step >= 3),
          _BuildStepIndicator(
            number: 3,
            label: 'Photos',
            active: step >= 3,
            current: step == 3,
          ),
          _BuildStepLine(isActive: step >= 4),
          _BuildStepIndicator(
            number: 4,
            label: 'Pricing',
            active: step >= 4,
            current: step == 4,
          ),
        ],
      ),
    );
  }
}

class _BuildStepLine extends StatelessWidget {
  const _BuildStepLine({required this.isActive});

  final bool isActive;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        height: 2,
        color: isActive ? AppColors.primary : AppColors.outline,
        margin: const EdgeInsets.only(left: 8, right: 8, bottom: 16),
      ),
    );
  }
}

class _BuildStepIndicator extends StatelessWidget {
  const _BuildStepIndicator({
    required this.number,
    required this.label,
    required this.active,
    required this.current,
  });

  final int number;
  final String label;
  final bool active;
  final bool current;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: current
                ? AppColors.primary
                : active
                ? AppColors.secondary
                : AppColors.surfaceHighest,
            shape: BoxShape.circle,
            boxShadow: current
                ? <BoxShadow>[
                    BoxShadow(
                      color: AppColors.primary.withAlpha(30),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ]
                : null,
          ),
          alignment: Alignment.center,
          child: AppText('$number'),
        ),
        const SizedBox(height: 6),
        AppText(label),
      ],
    );
  }
}
