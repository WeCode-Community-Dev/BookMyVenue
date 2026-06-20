import 'package:flutter/material.dart';

import '../../../../core/extension/date_extension.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';

class OwnerPayoutHistoryPage extends StatelessWidget {
  const OwnerPayoutHistoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const Drawer(),
      appBar: const CustomAppBar(title: 'Payouts'),
      body: SingleChildScrollView(
        padding: AppSpacing.screenPadding,
        child: Column(
          spacing: AppSpacing.spaceMd,
          crossAxisAlignment: .start,
          children: <Widget>[
            /// Balance Summary Row
            const BuildAvailableBalanceCard(),

            const BuildTotalPaidCard(),

            // Payout List Section
            Row(
              mainAxisAlignment: .spaceBetween,
              children: <Widget>[
                const AppText(
                  'Recent Payouts',
                  variant: TextVariant.headingLarge,
                ),
                AppTextButton(onPressed: () {}, title: 'View All'),
              ],
            ),

            /// List Card
            Container(
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppShapes.md,
                border: Border.all(color: AppColors.outline),
              ),
              child: ListView.separated(
                padding: AppSpacing.p0,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: 5,
                separatorBuilder: (BuildContext context, int index) =>
                    Divider(color: AppColors.outline, height: 1),
                itemBuilder: (BuildContext context, int index) {
                  return BuildPayoutItem(index: index);
                },
              ),
            ),

            /// Help callout
            // Container(
            //   padding: const EdgeInsets.all(20),
            //   decoration: BoxDecoration(
            //     color: AppColors.surfaceLow,
            //     borderRadius: AppShapes.md,
            //     border: Border.all(color: AppColors.outline),
            //   ),
            //   child: Row(
            //     children: <Widget>[
            //       Container(
            //         padding: const EdgeInsets.all(12),
            //         decoration: BoxDecoration(
            //           color: AppColors.surface,
            //           shape: BoxShape.circle,
            //         ),
            //         child: Icon(
            //           Icons.help_outline,
            //           color: AppColors.secondary,
            //           size: 24,
            //         ),
            //       ),
            //       const SizedBox(width: 16),
            //       Expanded(
            //         child: Column(
            //           crossAxisAlignment: CrossAxisAlignment.start,
            //           children: <Widget>[
            //             AppText('Missing a payout?'),
            //             const SizedBox(height: 2),
            //             AppText(
            //               'Payouts usually take 3-5 business days to appear in your account.',
            //             ),
            //           ],
            //         ),
            //       ),
            //       const SizedBox(width: 16),
            //       OutlinedButton(
            //         style: OutlinedButton.styleFrom(
            //           side: BorderSide(color: AppColors.secondary),
            //           shape: RoundedRectangleBorder(
            //             borderRadius: AppShapes.defaultBorder,
            //           ),
            //           padding: const EdgeInsets.symmetric(
            //             horizontal: 20,
            //             vertical: 12,
            //           ),
            //         ),
            //         onPressed: () {
            //           ScaffoldMessenger.of(context).showSnackBar(
            //             const SnackBar(
            //               content: AppText(
            //                 'Connecting to help desk support...',
            //               ),
            //             ),
            //           );
            //         },
            //         child: AppText('Contact Support'),
            //       ),
            //     ],
            //   ),
            // ),
          ],
        ),
      ),
    );
  }
}

class BuildPayoutItem extends StatelessWidget {
  const BuildPayoutItem({super.key, required this.index});
  final int index;

  @override
  Widget build(BuildContext context) {
    Color statusColor;
    Color statusBg;
    IconData icon;

    switch ('Paid') {
      case 'Paid':
        statusColor = AppColors.success;
        statusBg = AppColors.successBg;
        icon = Icons.calendar_today;
        break;
      case 'Processing':
        statusColor = AppColors.warningText;
        statusBg = AppColors.warningBg;
        icon = Icons.update;
        break;
      default:
        statusColor = AppColors.error;
        statusBg = AppColors.errorBg;
        icon = Icons.error_outline;
    }

    final String formattedDate = DateTime.now().mmmDdYyyy;
    return Container(
      padding: AppSpacing.pMd,
      child: GestureDetector(
        onTap: () {
          // Navigator.of(context).push(
          //   MaterialPageRoute(
          //     builder: (BuildContext context) =>
          //         const PayoutTransactionDetailsScreen(),
          //   ),
          // );
        },
        child: Column(
          spacing: AppSpacing.spaceMd,
          children: <Widget>[
            Row(
              spacing: AppSpacing.spaceMd,
              children: <Widget>[
                Container(
                  decoration: BoxDecoration(
                    color: AppColors.surfaceLow,
                    borderRadius: AppShapes.defaultBorder,
                  ),
                  child: Icon(
                    icon,
                    color: AppColors.primary,
                    size: AppSpacing.iconLg,
                  ),
                ),

                Expanded(
                  child: Column(
                    spacing: AppSpacing.spaceXs,
                    crossAxisAlignment: .start,
                    children: <Widget>[
                      AppText('$formattedDate • #PAY${1234}'),

                      const AppText(
                        'Venue Name',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        variant: TextVariant.headingLarge,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            Row(
              children: <Widget>[
                Column(
                  crossAxisAlignment: .start,
                  children: <Widget>[
                    AppText(
                      '\$${1000.toStringAsFixed(2)}',
                      variant: TextVariant.headingLarge,
                      color: AppColors.primaryDark,
                    ),
                    const SizedBox(height: 2),
                    const AppText(
                      'Bank transfer',
                      variant: TextVariant.captionMedium,
                    ),
                  ],
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: statusBg,
                    borderRadius: AppShapes.full,
                  ),
                  child: const AppText(
                    'payout.status',
                    variant: TextVariant.headingMedium,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class BuildAvailableBalanceCard extends StatelessWidget {
  const BuildAvailableBalanceCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: AppSpacing.pLg,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppShapes.md,
        border: Border.all(color: AppColors.outline),
      ),
      child: Column(
        spacing: AppSpacing.spaceSm,
        crossAxisAlignment: .start,
        children: <Widget>[
          const AppText('AVAILABLE BALANCE', variant: TextVariant.headingLarge),

          AppText(
            '\$${100.toStringAsFixed(2)}',
            variant: TextVariant.headerText,
          ),

          AppButton(
            label: 'Withdraw funds',
            onPressed: () {},
            size: ButtonSize.small,
          ),
        ],
      ),
    );
  }
}

class BuildTotalPaidCard extends StatelessWidget {
  const BuildTotalPaidCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: AppSpacing.pLg,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppShapes.md,
      ),
      child: Stack(
        children: <Widget>[
          Column(
            spacing: AppSpacing.spaceSm,
            crossAxisAlignment: .start,
            children: <Widget>[
              const AppText(
                'TOTAL PAID TO DATE',
                variant: TextVariant.headingLarge,
              ),

              AppText(
                '\$${100.toStringAsFixed(2)}',
                variant: TextVariant.headerText,
              ),

              Row(
                spacing: AppSpacing.spaceXs,
                children: <Widget>[
                  Icon(
                    Icons.trending_up,
                    color: AppColors.success,
                    size: AppSpacing.iconMd,
                  ),
                  const AppText('+12.4% from last month'),
                ],
              ),
            ],
          ),
          Positioned(
            right: -20,
            bottom: -20,
            child: Icon(
              Icons.payments,
              size: 120,
              color: Colors.white.withOpacity(0.04),
            ),
          ),
        ],
      ),
    );
  }
}
