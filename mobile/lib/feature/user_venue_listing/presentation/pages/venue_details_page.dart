import 'package:flutter/material.dart';

import '../../../../core/constants/app_constant.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_cached_image.dart';
import '../../../../core/widgets/app_text.dart';

class UserVenueDetailsScreen extends StatefulWidget {
  const UserVenueDetailsScreen({super.key});

  @override
  State<UserVenueDetailsScreen> createState() => _UserVenueDetailsScreenState();
}

class _UserVenueDetailsScreenState extends State<UserVenueDetailsScreen> {
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 2));
  double _selectedHours = 8.0;
  String _selectedTimeSlot = '9:00 AM - 5:00 PM';

  final List<String> _timeSlots = <String>[
    '8:00 AM - 12:00 PM',
    '1:00 PM - 5:00 PM',
    '9:00 AM - 5:00 PM',
    '6:00 PM - 10:00 PM',
    '9:00 AM - 9:00 PM',
  ];

  final bool isStarred = true;

  @override
  Widget build(BuildContext context) {
    final Widget detailsContent = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        // Image banner
        Stack(
          children: <Widget>[
            const Hero(
              tag: 10,
              child: AppCachedImage(
                imageUrl:
                    'https://d3i6fh83elv35t.cloudfront.net/static/2026/06/2026-06-17T033637Z_31440324_UP1EM6H0415VH_RTRMADP_3_SOCCER-WORLDCUP-ARG-DZA-1024x674.jpg',
                height: 250,

                width: double.infinity,
                borderRadius: BorderRadius.vertical(
                  top: Radius.circular(AppShapes.radiusMd),
                ),
              ),
            ),
            Positioned(
              top: 16,
              left: 16,
              child: CircleAvatar(
                backgroundColor: AppColors.surface,
                child: IconButton(
                  icon: const Icon(Icons.arrow_back, color: AppColors.primary),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ),
            ),
            Positioned(
              top: 16,
              right: 16,
              child: CircleAvatar(
                backgroundColor: Colors.white,
                child: IconButton(
                  icon: Icon(
                    isStarred ? Icons.favorite : Icons.favorite_border,
                    color: isStarred ? Colors.red : AppColors.onSurfaceVariant,
                  ),
                  onPressed: () {
                    // appState.toggleStarred(widget.venue.id);
                  },
                ),
              ),
            ),
          ],
        ),

        // Title and Category
        Row(
          children: <Widget>[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.primary.withAlpha(10),
                borderRadius: BorderRadius.circular(12),
              ),
              child: AppText('Auditorium'.toUpperCase()),
            ),
          ],
        ),

        const AppText(
          'Adathara Auditorium',
          variant: TextVariant.headingLarge,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),

        // Address & Reviews
        Row(
          children: <Widget>[
            Icon(
              Icons.location_on,
              size: 16,
              color: AppColors.onSurfaceVariant,
            ),
            const SizedBox(width: 6),
            const Expanded(
              child: AppText(
                'Manathattikunn, Sulthan Bathery',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        const Row(
          children: <Widget>[
            Icon(Icons.star, color: AppColors.primary, size: AppSpacing.iconXs),
            AppText(
              '4.9',
              variant: TextVariant.captionRegular,
              color: AppColors.primaryDark,
            ),
            AppText('(124 reviews)'),
          ],
        ),
        Divider(height: 40, color: AppColors.outline),

        // Highlights (Cap, Sq Ft)
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: <Widget>[
            _buildHighlightItem(
              Icons.people_alt_outlined,
              'Capacity',
              '${1000} people',
            ),
            _buildHighlightItem(
              Icons.square_foot_outlined,
              'Size',
              '${1500.toStringAsFixed(0)} sq ft',
            ),
            _buildHighlightItem(
              Icons.payments_outlined,
              'Hourly Rate',
              '\$${100.toStringAsFixed(0)}/hr',
            ),
          ],
        ),
        Divider(height: 40, color: AppColors.outline),

        // Description
        const AppText('About the Space'),
        const SizedBox(height: 12),
        const AppText(
          'widget.venue.description' +
              '\n\nThis premium listing features standard high-tech support, central air conditioning, pristine sanitization, and flexible layouts. Conveniently located with excellent transport accessibility and ample local parking.',
        ),
        const SizedBox(height: 32),

        // Amenities
        const AppText('Amenities Included'),
        const SizedBox(height: 16),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: AppConst.amenities.map((String amenity) {
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.outline),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  const Icon(
                    Icons.check_circle_outline,
                    size: 16,
                    color: AppColors.primary,
                  ),
                  const SizedBox(width: 8),
                  AppText(amenity),
                ],
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 32),
      ],
    );

    final Widget dateFormCard = Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppShapes.md,
        border: Border.all(color: AppColors.outline),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: AppColors.primary.withOpacity(0.03),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const AppText('Reservation Request'),
          const SizedBox(height: 20),

          // Date Picker
          const AppText('EVENT DATE'),
          const SizedBox(height: 8),
          InkWell(
            onTap: () async {
              final DateTime? pickedDate = await showDatePicker(
                context: context,
                initialDate: _selectedDate,
                firstDate: DateTime.now(),
                lastDate: DateTime.now().add(const Duration(days: 365)),
              );
              if (pickedDate != null) {
                setState(() {
                  _selectedDate = pickedDate;
                });
              }
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              decoration: BoxDecoration(
                borderRadius: AppShapes.defaultBorder,
                border: Border.all(color: AppColors.outline),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  AppText(
                    '${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}',
                  ),
                  const Icon(Icons.calendar_month, color: AppColors.primary),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Hours Selection
          const AppText('DURATION HOURS'),
          const SizedBox(height: 8),
          DropdownButtonFormField<double>(
            value: _selectedHours,
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(
                horizontal: 12,
                vertical: 12,
              ),
            ),
            items: const <DropdownMenuItem<double>>[
              DropdownMenuItem(value: 4.0, child: AppText('4 Hours')),
              DropdownMenuItem(value: 8.0, child: AppText('8 Hours')),
              DropdownMenuItem(value: 12.0, child: AppText('12 Hours')),
            ],
            onChanged: (double? val) {
              setState(() {
                _selectedHours = val ?? 8.0;
              });
            },
          ),
          const SizedBox(height: 20),

          // Time Slot Selection
          const AppText('TIME SLOT'),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            value: _selectedTimeSlot,
            decoration: const InputDecoration(
              contentPadding: EdgeInsets.symmetric(
                horizontal: 12,
                vertical: 12,
              ),
            ),
            items: _timeSlots.map((String slot) {
              return DropdownMenuItem(value: slot, child: AppText(slot));
            }).toList(),
            onChanged: (String? val) {
              setState(() {
                _selectedTimeSlot = val ?? '9:00 AM - 5:00 PM';
              });
            },
          ),
          const SizedBox(height: 32),

          // Submit Request Button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: AppShapes.defaultBorder,
                ),
                elevation: 0,
              ),
              onPressed: () {
                // Save settings in state and navigate to policy review screen
                // appState.startCheckout(
                //   widget.venue,
                //   _selectedDate,
                //   timeSlot: _selectedTimeSlot,
                //   hours: _selectedHours,
                // );
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (BuildContext context) =>
                        const UserBookingDetailsPolicyScreen(),
                  ),
                );
              },
              child: const AppText('Review Bookings & Policy'),
            ),
          ),
          const SizedBox(height: 12),
          const Center(
            child: AppText('No immediate charges. Review policy first.'),
          ),
        ],
      ),
    );

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Center(
            child: Container(
              constraints: const BoxConstraints(maxWidth: 1100),
              child: Column(children: <Widget>[detailsContent, dateFormCard]),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHighlightItem(IconData icon, String label, String value) {
    return Column(
      children: <Widget>[
        Icon(icon, color: AppColors.primary, size: 24),
        const SizedBox(height: 6),
        AppText(label),
        const SizedBox(height: 2),
        AppText(value),
      ],
    );
  }
}

class UserBookingDetailsPolicyScreen extends StatefulWidget {
  const UserBookingDetailsPolicyScreen({super.key});

  @override
  State<UserBookingDetailsPolicyScreen> createState() =>
      _UserBookingDetailsPolicyScreenState();
}

class _UserBookingDetailsPolicyScreenState
    extends State<UserBookingDetailsPolicyScreen> {
  bool _agreedToPolicies = false;

  @override
  Widget build(BuildContext context) {
    // Calculations
    const double baseAmount = 100;
    const double cleaning = 10;
    const double security = 1000;
    const double serviceFee = baseAmount * 0.05;
    const double totalAmount = baseAmount + cleaning + security + serviceFee;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.primary),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const AppText('Policies & Review'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1.0),
          child: Container(color: AppColors.outline, height: 1.0),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Center(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 800),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                // Venue Details Summary Card
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: AppShapes.md,
                    border: Border.all(color: AppColors.outline),
                  ),
                  child: Row(
                    children: <Widget>[
                      Expanded(
                        child: AppCachedImage(
                          imageUrl:
                              'https://d3i6fh83elv35t.cloudfront.net/static/2026/06/2026-06-17T033637Z_31440324_UP1EM6H0415VH_RTRMADP_3_SOCCER-WORLDCUP-ARG-DZA-1024x674.jpg',
                          height: 100,

                          width: double.infinity,
                          borderRadius: BorderRadius.circular(
                            AppShapes.radiusMd,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            const AppText('Venue Name'),
                            const SizedBox(height: 6),
                            AppText(
                              '${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year} | Morning - 9 - 3',
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // Policies Section
                const AppText('Cancellation Policy'),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceLow,
                    borderRadius: AppShapes.defaultBorder,
                    border: Border.all(color: AppColors.outline),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Row(
                        children: <Widget>[
                          Icon(
                            Icons.info_outline,
                            color: AppColors.primary,
                            size: 20,
                          ),
                          SizedBox(width: 8),
                          AppText('Standard 7-Day Refund'),
                        ],
                      ),
                      SizedBox(height: 8),
                      AppText(
                        '• Free cancellation up to 7 days before your scheduled reservation.\n• 50% refund for cancellations between 7 days and 48 hours.\n• Cancellations within 48 hours are non-refundable.\n• Security deposits are always refunded 100% in case of cancellation.',
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Rules
                const AppText('House Rules & Guidelines'),
                const SizedBox(height: 12),
                const AppText(
                  '1. Overtime hours are billed at 1.5x the hourly rate.\n2. No smoking permitted indoors. Outdoor smoking areas available.\n3. Noise levels must be kept within municipal guidelines after 10:00 PM.\n4. Clean-up fee covers normal usage. Excess clutter will require additional security deposit deduction.',
                ),
                const SizedBox(height: 32),

                // Pricing Breakdown Table
                const AppText('Pricing Breakdown'),
                const SizedBox(height: 12),
                Container(
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: AppShapes.defaultBorder,
                    border: Border.all(color: AppColors.outline),
                  ),
                  child: Column(
                    children: <Widget>[
                      _buildBreakdownRow(
                        'Base Rate (${10.toStringAsFixed(0)} hrs × \$${10.toStringAsFixed(0)})',
                        '\$${baseAmount.toStringAsFixed(2)}',
                      ),
                      _buildBreakdownRow(
                        'Cleaning Fee',
                        '\$${cleaning.toStringAsFixed(2)}',
                      ),
                      _buildBreakdownRow(
                        'Refundable Security Deposit',
                        '\$${security.toStringAsFixed(2)}',
                      ),
                      _buildBreakdownRow(
                        'Service & Platform Fee (5%)',
                        '\$${serviceFee.toStringAsFixed(2)}',
                      ),
                      Divider(height: 1, color: AppColors.outline),
                      _buildBreakdownRow(
                        'Total Booking Cost',
                        '\$${totalAmount.toStringAsFixed(2)}',
                        isTotal: true,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // Agreement Checkbox
                Row(
                  children: <Widget>[
                    Checkbox(
                      value: _agreedToPolicies,
                      activeColor: AppColors.primary,
                      onChanged: (bool? val) {
                        setState(() {
                          _agreedToPolicies = val ?? false;
                        });
                      },
                    ),
                    const Expanded(
                      child: AppText(
                        'I agree to the cancellation policies, house rules, and detailed breakdown above.',
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 32),

                // Actions
                SizedBox(
                  width: double.infinity,
                  height: 54,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: AppShapes.defaultBorder,
                      ),
                    ),
                    onPressed: _agreedToPolicies
                        ? () {
                            // Navigator.of(context).push(
                            //   MaterialPageRoute(
                            //     builder: (BuildContext context) =>
                            //         const UserSecureCheckoutScreen(),
                            //   ),
                            // );
                          }
                        : null,
                    child: const AppText('Proceed to Secure Checkout'),
                  ),
                ),
                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBreakdownRow(
    String label,
    String value, {
    bool isTotal = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[AppText(label), AppText(value)],
      ),
    );
  }
}
