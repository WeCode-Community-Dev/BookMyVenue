// class PayoutTransactionDetailsScreen extends StatelessWidget {
//   const PayoutTransactionDetailsScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     final appState = Provider.of<AppState>(context);
//     final payout = appState.selectedPayout;

//     if (payout == null) {
//       return const Scaffold(
//         body: Center(child: AppText('No payout selected.')),
//       );
//     }

//     final formattedDate = DateFormat(
//       'MMMM d, yyyy • h:mm a',
//     ).format(payout.date);
//     Color statusColor;
//     Color statusBg;

//     switch (payout.status) {
//       case 'Paid':
//         statusColor = AppColors.success;
//         statusBg = AppColors.successBg;
//         break;
//       case 'Processing':
//         statusColor = AppColors.warningText;
//         statusBg = AppColors.warningBg;
//         break;
//       default:
//         statusColor = AppColors.error;
//         statusBg = AppColors.errorBg;
//     }

//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: AppBar(
//         backgroundColor: AppColors.surface,
//         elevation: 0,
//         leading: IconButton(
//           icon: Icon(Icons.arrow_back, color: AppColors.primary),
//           onPressed: () => Navigator.of(context).pop(),
//         ),
//         title: AppText(
//           'Transaction Details',
//           style: GoogleFonts.plusJakartaSans(
//             fontWeight: FontWeight.bold,
//             color: AppColors.primary,
//           ),
//         ),
//         bottom: PreferredSize(
//           preferredSize: const Size.fromHeight(1.0),
//           child: Container(color: AppColors.outline, height: 1.0),
//         ),
//       ),
//       body: Center(
//         child: SingleChildScrollView(
//           padding: const EdgeInsets.all(24.0),
//           child: Container(
//             constraints: const BoxConstraints(maxWidth: 600),
//             padding: const EdgeInsets.all(32),
//             decoration: BoxDecoration(
//               color: AppColors.surface,
//               borderRadius: AppShapes.md,
//               border: Border.all(color: AppColors.outline),
//               boxShadow: AppShadows.ambient,
//             ),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: <Widget>[
//                 // Header
//                 Row(
//                   mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                   children: <Widget>[
//                     Container(
//                       padding: const EdgeInsets.symmetric(
//                         horizontal: 12,
//                         vertical: 6,
//                       ),
//                       decoration: BoxDecoration(
//                         color: statusBg,
//                         borderRadius: AppShapes.full,
//                       ),
//                       child: AppText(
//                         payout.status,
//                         style: GoogleFonts.inter(
//                           fontWeight: FontWeight.bold,
//                           color: statusColor,
//                           fontSize: 12,
//                         ),
//                       ),
//                     ),
//                     AppText(
//                       'ID: #${payout.id}',
//                       style: GoogleFonts.inter(
//                         fontSize: 14,
//                         color: AppColors.onSurfaceVariant,
//                       ),
//                     ),
//                   ],
//                 ),
//                 const SizedBox(height: 24),
//                 AppText(
//                   'NET DISBURSEMENT',
//                   style: GoogleFonts.inter(
//                     fontWeight: FontWeight.bold,
//                     fontSize: 11,
//                     color: AppColors.onSurfaceVariant,
//                     letterSpacing: 0.8,
//                   ),
//                 ),
//                 const SizedBox(height: 6),
//                 AppText(
//                   '\$${payout.netAmount.toStringAsFixed(2)}',
//                   style: GoogleFonts.plusJakartaSans(
//                     fontWeight: FontWeight.w800,
//                     fontSize: 36,
//                     color: AppColors.onSurface,
//                   ),
//                 ),
//                 const SizedBox(height: 32),

//                 // Step flow progress
//                 AppText(
//                   'TRANSACTION TIMELINE',
//                   style: Theme.of(context).textTheme.labelLarge,
//                 ),
//                 const SizedBox(height: 16),
//                 _buildTimelinePoint(
//                   'Payout Request Received',
//                   'Initiated automatically by platform scheduler',
//                   true,
//                 ),
//                 _buildTimelineDivider(true),
//                 _buildTimelinePoint(
//                   'Clearing with Bank',
//                   'Awaiting clearing partner validation',
//                   payout.status != 'Failed',
//                 ),
//                 _buildTimelineDivider(payout.status == 'Paid'),
//                 _buildTimelinePoint(
//                   'Funds Disbursed',
//                   'Completed and settled to destination account',
//                   payout.status == 'Paid',
//                 ),
//                 const SizedBox(height: 32),

//                 // Ledger breakdown
//                 Divider(color: AppColors.outline),
//                 const SizedBox(height: 24),
//                 AppText(
//                   'DETAILS',
//                   style: Theme.of(context).textTheme.labelLarge,
//                 ),
//                 const SizedBox(height: 16),
//                 _buildLedgerRow('Date & Time', formattedDate),
//                 _buildLedgerRow('Destination', payout.bankAccount),
//                 _buildLedgerRow(
//                   'Gross Amount',
//                   '\$${payout.amount.toStringAsFixed(2)}',
//                 ),
//                 _buildLedgerRow(
//                   'Transaction Fee',
//                   '\$${payout.fee.toStringAsFixed(2)}',
//                 ),
//                 Divider(color: AppColors.outline, height: 24),
//                 _buildLedgerRow(
//                   'Net Amount Paid',
//                   '\$${payout.netAmount.toStringAsFixed(2)}',
//                   isBold: true,
//                 ),
//                 _buildLedgerRow('Associated Property', payout.venueName),
//                 const SizedBox(height: 24),
//               ],
//             ),
//           ),
//         ),
//       ),
//     );
//   }

//   Widget _buildTimelinePoint(String title, String subtitle, bool completed) {
//     return Row(
//       children: <Widget>[
//         Container(
//           width: 20,
//           height: 20,
//           decoration: BoxDecoration(
//             color: completed ? AppColors.success : AppColors.surfaceHighest,
//             shape: BoxShape.circle,
//           ),
//           alignment: Alignment.center,
//           child: completed
//               ? const Icon(Icons.check, color: Colors.white, size: 10)
//               : SizedBox(
//                   width: 6,
//                   height: 6,
//                   child: CircleAvatar(
//                     backgroundColor: AppColors.onSurfaceVariant,
//                   ),
//                 ),
//         ),
//         const SizedBox(width: 16),
//         Expanded(
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: <Widget>[
//               AppText(
//                 title,
//                 style: GoogleFonts.inter(
//                   fontWeight: FontWeight.bold,
//                   fontSize: 13,
//                   color: completed
//                       ? AppColors.onSurface
//                       : AppColors.onSurfaceVariant,
//                 ),
//               ),
//               AppText(
//                 subtitle,
//                 style: GoogleFonts.inter(
//                   fontSize: 11,
//                   color: AppColors.onSurfaceVariant,
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ],
//     );
//   }

//   Widget _buildTimelineDivider(bool completed) {
//     return Container(
//       height: 16,
//       alignment: Alignment.centerLeft,
//       margin: const EdgeInsets.only(left: 9),
//       child: Container(
//         width: 2,
//         height: 16,
//         color: completed ? AppColors.success : AppColors.surfaceHighest,
//       ),
//     );
//   }

//   Widget _buildLedgerRow(String label, String value, {bool isBold = false}) {
//     return Padding(
//       padding: const EdgeInsets.symmetric(vertical: 4.0),
//       child: Row(
//         mainAxisAlignment: MainAxisAlignment.spaceBetween,
//         children: <Widget>[
//           AppText(
//             label,
//             style: GoogleFonts.inter(
//               fontSize: 13,
//               color: AppColors.onSurfaceVariant,
//             ),
//           ),
//           AppText(
//             value,
//             style: GoogleFonts.inter(
//               fontSize: 13,
//               fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
//               color: isBold ? AppColors.primary : AppColors.onSurface,
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }
