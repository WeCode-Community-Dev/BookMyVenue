import 'package:flutter/material.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_cached_image.dart';
import '../../../../core/widgets/app_text.dart';
import '../../domain/entity/user_venue_entity.dart';

class UserVenueDetailsScreen extends StatefulWidget {
  const UserVenueDetailsScreen({required this.venue, super.key});

  final UserVenueEntity venue;

  @override
  State<UserVenueDetailsScreen> createState() => _UserVenueDetailsScreenState();
}

class _UserVenueDetailsScreenState extends State<UserVenueDetailsScreen> {
  late final UserVenueEntity _venue;
  late DateTime _selectedDate;
  double _selectedHours = 8.0;
  String _selectedTimeSlot = '';
  late List<String> _timeSlots;

  @override
  void initState() {
    super.initState();
    _selectedDate = DateTime.now().add(const Duration(days: 2));

    _venue = widget.venue;

    // Dynamically build slots list
    _timeSlots = _venue.slots
        .map(
          (UserVenueSlotEntity slot) =>
              '${slot.slotName} (${slot.startTime} - ${slot.endTime})',
        )
        .toList();

    if (_timeSlots.isEmpty) {
      _timeSlots = <String>[
        '8:00 AM - 12:00 PM',
        '1:00 PM - 5:00 PM',
        '9:00 AM - 5:00 PM',
        '6:00 PM - 10:00 PM',
        '9:00 AM - 9:00 PM',
      ];
    }
    _selectedTimeSlot = _timeSlots.first;
  }

  @override
  Widget build(BuildContext context) {
    final double hourlyRate = _venue.slots.isNotEmpty
        ? _venue.slots.first.price
        : 0.0;

    final Widget detailsContent = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        // Image banner
        Stack(
          children: <Widget>[
            Hero(
              tag: _venue.id,
              child: AppCachedImage(
                imageUrl: _venue.coverImageUrl.isNotEmpty
                    ? _venue.coverImageUrl
                    : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400',
                height: 250,
                width: double.infinity,
                borderRadius: const BorderRadius.vertical(
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
                    Icons.favorite_border,
                    color: AppColors.onSurfaceVariant,
                  ),
                  onPressed: () {
                    // Star action
                  },
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Title and Category
        Row(
          children: <Widget>[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.primary.withAlpha(10),
                borderRadius: BorderRadius.circular(12),
              ),
              child: AppText(_venue.category.toUpperCase()),
            ),
          ],
        ),
        const SizedBox(height: 8),

        AppText(
          _venue.venueName,
          variant: TextVariant.headingLarge,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 8),

        // Address & Reviews
        Row(
          children: <Widget>[
            Icon(
              Icons.location_on,
              size: 16,
              color: AppColors.onSurfaceVariant,
            ),
            const SizedBox(width: 6),
            Expanded(
              child: AppText(
                _venue.location.address,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: <Widget>[
            const Icon(
              Icons.star,
              color: AppColors.primary,
              size: AppSpacing.iconXs,
            ),
            const SizedBox(width: 4),
            AppText(
              _venue.averageRating.toStringAsFixed(1),
              variant: TextVariant.captionRegular,
              color: AppColors.primaryDark,
            ),
            const SizedBox(width: 4),
            AppText('(${_venue.totalReviews} reviews)'),
          ],
        ),
        Divider(height: 40, color: AppColors.outline),

        // Highlights (Cap, Hourly Rate)
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: <Widget>[
            _buildHighlightItem(
              Icons.people_alt_outlined,
              'Capacity',
              '${_venue.maxCapacity} people',
            ),
            _buildHighlightItem(
              Icons.payments_outlined,
              'Hourly Rate',
              '\u{20B9} ${hourlyRate.toStringAsFixed(0)}/hr',
            ),
          ],
        ),
        Divider(height: 40, color: AppColors.outline),

        // Description
        const AppText('About the Space', variant: TextVariant.headingMedium),
        const SizedBox(height: 12),
        AppText(
          _venue.description.isNotEmpty
              ? _venue.description
              : 'This premium venue offers excellent spaces and top-notch event hospitality. Reach out to coordinate custom decorations and booking rules.',
        ),
        const SizedBox(height: 32),

        // Amenities
        const AppText('Amenities Included', variant: TextVariant.headingMedium),
        const SizedBox(height: 16),
        if (_venue.amenities.isEmpty)
          const AppText('No amenities listed.')
        else
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: _venue.amenities.map((UserVenueAmenityEntity amenity) {
              return Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
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
                    AppText(amenity.name),
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
          const AppText(
            'Reservation Request',
            variant: TextVariant.headingMedium,
          ),
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
              DropdownMenuItem<double>(value: 4.0, child: AppText('4 Hours')),
              DropdownMenuItem<double>(value: 8.0, child: AppText('8 Hours')),
              DropdownMenuItem<double>(value: 12.0, child: AppText('12 Hours')),
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
              return DropdownMenuItem<String>(
                value: slot,
                child: AppText(slot),
              );
            }).toList(),
            onChanged: (String? val) {
              setState(() {
                _selectedTimeSlot = val ?? _timeSlots.first;
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
                Navigator.of(context).push(
                  MaterialPageRoute<UserBookingDetailsPolicyScreen>(
                    builder: (BuildContext context) =>
                        UserBookingDetailsPolicyScreen(
                          venue: _venue,
                          selectedHours: _selectedHours,
                          selectedTimeSlot: _selectedTimeSlot,
                        ),
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
        AppText(value, variant: TextVariant.headingMedium),
      ],
    );
  }
}

class UserBookingDetailsPolicyScreen extends StatefulWidget {
  const UserBookingDetailsPolicyScreen({
    required this.venue,
    required this.selectedHours,
    required this.selectedTimeSlot,
    super.key,
  });

  final UserVenueEntity venue;
  final double selectedHours;
  final String selectedTimeSlot;

  @override
  State<UserBookingDetailsPolicyScreen> createState() =>
      _UserBookingDetailsPolicyScreenState();
}

class _UserBookingDetailsPolicyScreenState
    extends State<UserBookingDetailsPolicyScreen> {
  bool _agreedToPolicies = false;

  @override
  Widget build(BuildContext context) {
    final double hourlyRate = widget.venue.slots.isNotEmpty
        ? widget.venue.slots.first.price
        : 0.0;
    final double baseAmount = widget.selectedHours * hourlyRate;

    // Search for cleaning fee or fallback to first service
    final double cleaning = widget.venue.services.isNotEmpty
        ? widget.venue.services
              .firstWhere(
                (UserVenueServiceEntity s) =>
                    s.serviceName.toLowerCase().contains('clean') ||
                    s.serviceName.toLowerCase().contains('fee'),
                orElse: () => widget.venue.services.first,
              )
              .price
        : 0.0;

    const double security = 1000.0;
    final double serviceFee = baseAmount * 0.05;
    final double totalAmount = baseAmount + cleaning + security + serviceFee;

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
                          imageUrl: widget.venue.coverImageUrl.isNotEmpty
                              ? widget.venue.coverImageUrl
                              : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400',
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
                            AppText(
                              widget.venue.venueName,
                              variant: TextVariant.headingMedium,
                            ),
                            const SizedBox(height: 6),
                            AppText(
                              '${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year} | ${widget.selectedTimeSlot} | ${widget.selectedHours.toInt()} hrs',
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // Policies Section
                const AppText(
                  'Cancellation Policy',
                  variant: TextVariant.headingMedium,
                ),
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
                const AppText(
                  'House Rules & Guidelines',
                  variant: TextVariant.headingMedium,
                ),
                const SizedBox(height: 12),
                const AppText(
                  '1. Overtime hours are billed at 1.5x the hourly rate.\n2. No smoking permitted indoors. Outdoor smoking areas available.\n3. Noise levels must be kept within municipal guidelines after 10:00 PM.\n4. Clean-up fee covers normal usage. Excess clutter will require additional security deposit deduction.',
                ),
                const SizedBox(height: 32),

                // Pricing Breakdown Table
                const AppText(
                  'Pricing Breakdown',
                  variant: TextVariant.headingMedium,
                ),
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
                        'Base Rate (${widget.selectedHours.toInt()} hrs × \u{20B9} ${hourlyRate.toStringAsFixed(0)})',
                        '\u{20B9} ${baseAmount.toStringAsFixed(2)}',
                      ),
                      _buildBreakdownRow(
                        'Cleaning Fee',
                        '\u{20B9} ${cleaning.toStringAsFixed(2)}',
                      ),
                      _buildBreakdownRow(
                        'Refundable Security Deposit',
                        '\u{20B9} ${security.toStringAsFixed(2)}',
                      ),
                      _buildBreakdownRow(
                        'Service & Platform Fee (5%)',
                        '\u{20B9} ${serviceFee.toStringAsFixed(2)}',
                      ),
                      Divider(height: 1, color: AppColors.outline),
                      _buildBreakdownRow(
                        'Total Booking Cost',
                        '\u{20B9} ${totalAmount.toStringAsFixed(2)}',
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
                            // Proceed to Secure Checkout
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
