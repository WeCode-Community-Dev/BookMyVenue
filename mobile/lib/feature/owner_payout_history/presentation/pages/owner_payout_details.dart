import 'package:flutter/material.dart';

import '../../../../core/extension/date_extension.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';

class PayoutTransactionDetailsScreen extends StatelessWidget {
  const PayoutTransactionDetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final String formattedDate = DateTime.now().mmmDdYyyyWithTime;
    Color statusColor;
    Color statusBg;

    switch ('Paid') {
      case 'Paid':
        statusColor = AppColors.success;
        statusBg = AppColors.successBg;
        break;
      case 'Processing':
        statusColor = AppColors.warningText;
        statusBg = AppColors.warningBg;
        break;
      default:
        statusColor = AppColors.error;
        statusBg = AppColors.errorBg;
    }

    return Scaffold(
      appBar: const CustomAppBar(title: 'Transaction Details'),
      body: Center(
        child: SingleChildScrollView(
          padding: AppSpacing.screenPadding,
          child: Column(
            spacing: AppSpacing.spaceMd,
            crossAxisAlignment: .start,
            children: <Widget>[
              /// Total Credited Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(
                  vertical: 24,
                  horizontal: 20,
                ),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: AppShapes.md,
                  border: Border.all(color: AppColors.outline),
                  // boxShadow: AppShadows.ambient,
                ),
                child: Column(
                  spacing: AppSpacing.spaceMd,
                  children: <Widget>[
                    const AppText('TOTAL CREDITED'),

                    AppText(
                      '\$${1000.toStringAsFixed(2)}',
                      variant: TextVariant.headerText,
                    ),

                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: true
                            ? AppColors.successBg
                            : (false ? AppColors.warningBg : AppColors.errorBg),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisSize: .min,
                        children: <Widget>[
                          Icon(
                            true
                                ? Icons.check_circle
                                : (false
                                      ? Icons.hourglass_empty
                                      : Icons.cancel),
                            size: 12,
                            color: true
                                ? AppColors.success
                                : (false
                                      ? AppColors.warningText
                                      : AppColors.error),
                          ),

                          const AppText(' payout.status'),
                        ],
                      ),
                    ),
                    AppButton(
                      label: 'Download Receipt',
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: AppText('Receipt download started...'),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),

              /// Transaction Summary
              Container(
                width: double.infinity,
                padding: AppSpacing.pLg,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: AppShapes.md,
                  border: Border.all(color: AppColors.outline),
                  // boxShadow: AppShadows.ambient,
                ),
                child: Column(
                  spacing: AppSpacing.spaceMd,
                  crossAxisAlignment: .start,
                  children: <Widget>[
                    const AppText('Transaction Summary'),

                    _buildSummaryField('Payout ID', 'PAY#${1234}'),

                    _buildSummaryField('Date', formattedDate),

                    _buildSummaryFieldWithIcon(
                      'Payment Method',
                      'Bank Transfer (Ending in ****1234)',
                      Icons.account_balance,
                    ),

                    _buildSummaryFieldWithIcon(
                      'Venue',
                      'payout.venueName',
                      Icons.business_center,
                    ),
                  ],
                ),
              ),

              /// Payout Breakdown
              Container(
                width: double.infinity,
                padding: AppSpacing.pLg,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: AppShapes.md,
                  border: Border.all(color: AppColors.outline),
                  // boxShadow: AppShadows.ambient,
                ),
                child: Column(
                  spacing: AppSpacing.spaceMd,
                  crossAxisAlignment: .start,
                  children: <Widget>[
                    const AppText('Payout Breakdown'),

                    _buildBreakdownRow(
                      'Base Booking Amount',
                      '\$${(1000 + 10 + 20.00).toStringAsFixed(2)}',
                      isNegative: false,
                    ),

                    _buildBreakdownRow(
                      'Platform Fee (10%)',
                      '-\$${1000.toStringAsFixed(2)}',
                      isNegative: true,
                    ),

                    _buildBreakdownRow('Taxes', r'-$20.00', isNegative: true),

                    Divider(color: AppColors.outline),

                    Row(
                      mainAxisAlignment: .spaceBetween,
                      children: <Widget>[
                        const AppText('Total Credited'),
                        AppText('\$${1000.toStringAsFixed(2)}'),
                      ],
                    ),
                  ],
                ),
              ),

              /// Payout Timeline
              Container(
                width: double.infinity,
                padding: AppSpacing.pLg,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: AppShapes.md,
                  border: Border.all(color: AppColors.outline),
                  // boxShadow: AppShadows.ambient,
                ),
                child: Column(
                  spacing: AppSpacing.spaceMd,
                  crossAxisAlignment: .start,
                  children: <Widget>[
                    const AppText('PAYOUT TIMELINE'),

                    _buildTimelineStep(
                      title: 'Requested',
                      subtitle: '1234' == 'PAY-9921'
                          ? 'Oct 20, 2024 • 10:30 AM'
                          : formattedDate,
                      completed: true,
                      icon: Icons.check,
                    ),
                    _buildTimelineDivider('success' != 'Failed'),
                    _buildTimelineStep(
                      title: 'success' == 'Failed' ? 'Failed' : 'Processed',
                      subtitle: '1234' == 'PAY-9921'
                          ? 'Oct 22, 2024 • 02:15 PM'
                          : formattedDate,
                      completed: 'success' != 'Failed',
                      icon: 'success' == 'Failed' ? Icons.close : Icons.check,
                    ),
                    _buildTimelineDivider('success' == 'Paid'),
                    _buildTimelineStep(
                      title: 'Credited to Bank',
                      subtitle: '1234' == 'PAY-9921'
                          ? 'Oct 24, 2024 • 09:00 AM'
                          : formattedDate,
                      completed: 'Paid' == 'Paid',
                      icon: Icons.account_balance,
                    ),
                  ],
                ),
              ),

              /// Need Help
              Container(
                width: double.infinity,
                padding: AppSpacing.pLg,
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: AppShapes.md,
                  border: Border.all(color: const Color(0xFFDBEAFE)),
                ),
                child: Column(
                  spacing: AppSpacing.spaceMd,
                  crossAxisAlignment: .start,
                  children: <Widget>[
                    const Row(
                      children: <Widget>[
                        Icon(
                          Icons.help_outline,
                          color: Color(0xFF1E40AF),
                          size: 20,
                        ),
                        SizedBox(width: 8),
                        AppText('Need Help?'),
                      ],
                    ),

                    const AppText(
                      "If you haven't received the funds in your account within 3-5 business days, please contact our support team.",
                    ),
                    AppOutlinedButton(
                      title: 'Contact Support',
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                              'Contacting customer support team...',
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBreakdownRow(
    String label,
    String value, {
    required bool isNegative,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[AppText(label), AppText(value)],
    );
  }

  Widget _buildSummaryField(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[AppText(label), AppText(value)],
    );
  }

  Widget _buildSummaryFieldWithIcon(String label, String value, IconData icon) {
    return Column(
      crossAxisAlignment: .start,
      children: <Widget>[
        AppText(label),

        Row(
          children: <Widget>[
            Icon(icon, color: AppColors.secondary, size: 16),

            Expanded(child: AppText(value)),
          ],
        ),
      ],
    );
  }

  Widget _buildTimelineStep({
    required String title,
    required String subtitle,
    required bool completed,
    required IconData icon,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            color: completed ? AppColors.primary : AppColors.surfaceLow,
            shape: BoxShape.circle,
            border: Border.all(
              color: completed ? AppColors.primary : AppColors.outline,
            ),
          ),
          alignment: Alignment.center,
          child: Icon(
            icon,
            color: completed ? Colors.white : AppColors.onSurfaceVariant,
            size: 14,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              AppText(title),
              const SizedBox(height: 2),
              AppText(subtitle),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildTimelineDivider(bool completed) {
    return Container(
      height: 24,
      margin: const EdgeInsets.only(left: 13),
      child: Container(
        width: 2,
        color: completed ? AppColors.primary : AppColors.outline,
      ),
    );
  }
}
