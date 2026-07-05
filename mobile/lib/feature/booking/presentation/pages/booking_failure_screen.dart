import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/utils/colors.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text.dart';

class BookingFailureScreen extends StatelessWidget {
  const BookingFailureScreen({
    required this.errorMessage,
    super.key,
  });

  final String errorMessage;

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
                  // Error Badge
                  Container(
                    width: 100,
                    height: 100,
                    decoration: const BoxDecoration(
                      color: Color(0xFFFFEAEA),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.error_outline_rounded,
                      color: Color(0xFFE74C3C),
                      size: 70,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Header
                  const AppText(
                    'Booking Failed',
                    variant: TextVariant.headingLarge,
                    fontWeight: FontWeight.bold,
                  ),
                  const SizedBox(height: 12),
                  AppText(
                    errorMessage.isNotEmpty
                        ? errorMessage
                        : 'Something went wrong while processing your booking or payment. Please try again.',
                    color: AppColors.onSurfaceVariant,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 48),

                  // Back Action Button
                  AppButton(
                    label: 'Go Back & Retry',
                    onPressed: () {
                      context.pop();
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
