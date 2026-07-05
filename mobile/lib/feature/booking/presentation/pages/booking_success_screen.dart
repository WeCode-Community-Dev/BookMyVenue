import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_name.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text.dart';
import '../../domain/entity/booking_entities.dart';

class BookingSuccessScreen extends StatefulWidget {
  const BookingSuccessScreen({required this.bookingDetails, super.key});

  final BookingDetailsEntity bookingDetails;

  @override
  State<BookingSuccessScreen> createState() => _BookingSuccessScreenState();
}

class _BookingSuccessScreenState extends State<BookingSuccessScreen> {
  int _secondsRemaining = 3;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startCountdown();
  }

  void _startCountdown() {
    _timer = Timer.periodic(const Duration(seconds: 1), (Timer timer) {
      if (_secondsRemaining == 1) {
        timer.cancel();
        _redirectToBookingHistory();
      } else {
        setState(() {
          _secondsRemaining--;
        });
      }
    });
  }

  void _redirectToBookingHistory() {
    context.go('/${AppRouteNames.bookingHistory}');
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 500),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  // Animated Success Indicator
                  Container(
                    width: 100,
                    height: 100,
                    decoration: const BoxDecoration(
                      color: Color(0xFFEFFAF1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.check_circle_rounded,
                      color: Color(0xFF2ECC71),
                      size: 70,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Header
                  const AppText(
                    'Booking Confirmed!',
                    variant: TextVariant.headingLarge,
                    fontWeight: FontWeight.bold,
                  ),
                  const SizedBox(height: 8),
                  AppText(
                    'Your payment has been successfully verified.',
                    color: AppColors.onSurfaceVariant,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 32),

                  // Receipt/Details Box
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: AppShapes.md,
                      border: Border.all(color: AppColors.outline),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        _buildDetailRow('Booking ID', widget.bookingDetails.id),
                        _buildDetailRow('Venue', widget.bookingDetails.venueName),
                        _buildDetailRow('Date', widget.bookingDetails.bookingDate),
                        _buildDetailRow(
                          'Amount Paid',
                          '₹${widget.bookingDetails.amount.toStringAsFixed(2)}',
                        ),
                        const Divider(height: 32),
                        const AppText(
                          'Selected Slots',
                          fontWeight: FontWeight.bold,
                        ),
                        const SizedBox(height: 8),
                        ...widget.bookingDetails.slots.map(
                          (BookingSlotEntity s) => Padding(
                            padding: const EdgeInsets.only(bottom: 6.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: <Widget>[
                                AppText(s.slotName),
                                AppText(
                                  '₹${s.price.toStringAsFixed(0)}',
                                  color: AppColors.onSurfaceVariant,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 40),

                  // Countdown Redirect Info
                  AppText(
                    'Redirecting to booking history in $_secondsRemaining seconds...',
                    color: AppColors.onSurfaceVariant,
                  ),
                  const SizedBox(height: 20),

                  // Manual Action Button
                  AppButton(
                    label: 'Go to Booking History',
                    onPressed: _redirectToBookingHistory,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          AppText(label, color: AppColors.onSurfaceVariant),
          const SizedBox(width: 16),
          Expanded(
            child: AppText(
              value,
              textAlign: TextAlign.end,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
