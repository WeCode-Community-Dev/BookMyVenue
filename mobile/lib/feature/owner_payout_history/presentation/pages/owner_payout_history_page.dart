import 'package:flutter/material.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import 'owner_payout_page.dart';

class OwnerPayoutHistoryPage extends StatelessWidget {
  const OwnerPayoutHistoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'Payouts History'),
      body: ListView.separated(
        padding: AppSpacing.p0,
        itemCount: 20,
        separatorBuilder: (BuildContext context, int index) =>
            Divider(color: AppColors.outline, height: 1),
        itemBuilder: (BuildContext context, int index) {
          return BuildPayoutItem(index: index);
        },
      ),
    );
  }
}
