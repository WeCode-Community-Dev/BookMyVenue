import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/extension/date_extension.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import '../../domain/entity/booking_entities.dart';
import '../bloc/booking_bloc.dart';

class OwnerBookingHistoryScreen extends StatefulWidget {
  const OwnerBookingHistoryScreen({super.key});

  @override
  State<OwnerBookingHistoryScreen> createState() => _OwnerBookingHistoryScreenState();
}

class _OwnerBookingHistoryScreenState extends State<OwnerBookingHistoryScreen> {
  String _selectedFilter = 'All';

  @override
  void initState() {
    super.initState();
    _fetchBookings();
  }

  void _fetchBookings() {
    context.read<BookingBloc>().add(const BookingEvent.fetchOwnerBookings());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const CustomAppBar(
        title: 'Reservations & Bookings',
      ),
      body: Column(
        children: <Widget>[
          const SizedBox(height: 16),
          _buildFilterChips(),
          const SizedBox(height: 16),
          Expanded(
            child: BlocBuilder<BookingBloc, BookingState>(
              builder: (BuildContext context, BookingState state) {
                return state.maybeWhen(
                  loading: () => const Center(
                    child: CircularProgressIndicator(),
                  ),
                  failure: (String message) => Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Icon(
                            Icons.error_outline_rounded,
                            size: 64,
                            color: AppColors.error,
                          ),
                          const SizedBox(height: 16),
                          AppText(
                            message,
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 24),
                          AppButton(
                            label: 'Retry',
                            onPressed: _fetchBookings,
                            minWidth: 120,
                          ),
                        ],
                      ),
                    ),
                  ),
                  ownerBookingsSuccess: (List<OwnerBookingDetailsEntity> bookings) {
                    final List<OwnerBookingDetailsEntity> filteredList = bookings.where((OwnerBookingDetailsEntity booking) {
                      if (_selectedFilter.toLowerCase() == 'all') {
                        return true;
                      }
                      return booking.status.toLowerCase() == _selectedFilter.toLowerCase();
                    }).toList();

                    if (filteredList.isEmpty) {
                      return Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Icon(
                                Icons.book_online_outlined,
                                size: 80,
                                color: AppColors.onSurfaceVariant.withAlpha(80),
                              ),
                              const SizedBox(height: 16),
                              AppText(
                                'No $_selectedFilter Bookings Found',
                                variant: TextVariant.headingMedium,
                                fontWeight: FontWeight.w600,
                              ),
                              const SizedBox(height: 8),
                              AppText(
                                'Your venues do not have any bookings matching this filter.',
                                color: AppColors.onSurfaceVariant,
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 24),
                              if (_selectedFilter.toLowerCase() != 'all')
                                AppButton(
                                  label: 'Show All Bookings',
                                  onPressed: () {
                                    setState(() {
                                      _selectedFilter = 'All';
                                    });
                                  },
                                ),
                            ],
                          ),
                        ),
                      );
                    }

                    // Sort bookings descending by creation date
                    final List<OwnerBookingDetailsEntity> sortedList = List<OwnerBookingDetailsEntity>.from(filteredList)
                      ..sort((OwnerBookingDetailsEntity a, OwnerBookingDetailsEntity b) => b.createdAt.compareTo(a.createdAt));

                    return RefreshIndicator(
                      onRefresh: () async {
                        _fetchBookings();
                      },
                      child: ListView.builder(
                        physics: const AlwaysScrollableScrollPhysics(),
                        padding: const EdgeInsets.only(bottom: 24),
                        itemCount: sortedList.length,
                        itemBuilder: (BuildContext context, int index) {
                          final OwnerBookingDetailsEntity booking = sortedList[index];
                          return OwnerBookingCard(booking: booking);
                        },
                      ),
                    );
                  },
                  orElse: () => const Center(
                    child: CircularProgressIndicator(),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChips() {
    final List<String> statuses = <String>['All', 'Confirmed', 'Pending', 'Cancelled'];
    return SizedBox(
      height: 40,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: statuses.length,
        itemBuilder: (BuildContext context, int index) {
          final String status = statuses[index];
          final bool isSelected = _selectedFilter.toLowerCase() == status.toLowerCase();
          return Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: ChoiceChip(
              label: AppText(
                status,
                color: isSelected ? Colors.white : AppColors.onSurface,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              selected: isSelected,
              onSelected: (bool selected) {
                if (selected) {
                  setState(() {
                    _selectedFilter = status;
                  });
                }
              },
              selectedColor: AppColors.primary,
              backgroundColor: AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(
                  color: isSelected ? AppColors.primary : AppColors.outline,
                ),
              ),
              showCheckmark: false,
            ),
          );
        },
      ),
    );
  }
}

class OwnerBookingCard extends StatefulWidget {
  const OwnerBookingCard({required this.booking, super.key});
  final OwnerBookingDetailsEntity booking;

  @override
  State<OwnerBookingCard> createState() => _OwnerBookingCardState();
}

class _OwnerBookingCardState extends State<OwnerBookingCard> {
  bool _isExpanded = false;

  Color _getStatusBgColor(String status) {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return AppColors.successBg;
      case 'pending':
        return AppColors.warningBg;
      case 'cancelled':
        return AppColors.errorBg;
      default:
        return AppColors.surfaceLow;
    }
  }

  Color _getStatusTextColor(String status) {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return AppColors.success;
      case 'pending':
        return AppColors.warningText;
      case 'cancelled':
        return AppColors.error;
      default:
        return AppColors.onSurfaceVariant;
    }
  }

  String _formatBookingDate(String dateStr) {
    try {
      final DateTime dt = DateTime.parse(dateStr);
      return dt.mmmDdYyyy;
    } catch (_) {
      return dateStr;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppShapes.md,
        border: Border.all(color: AppColors.outline),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: Colors.black.withAlpha(8),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          // Header: Venue Name and Status pill
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    AppText(
                      widget.booking.venueName,
                      variant: TextVariant.headingMedium,
                      fontWeight: FontWeight.bold,
                    ),
                    const SizedBox(height: 4),
                    AppText(
                      'Date: ${_formatBookingDate(widget.booking.bookingDate)}',
                      color: AppColors.onSurfaceVariant,
                      variant: TextVariant.bodyMedium,
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: _getStatusBgColor(widget.booking.status),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: AppText(
                  widget.booking.status.toUpperCase(),
                  color: _getStatusTextColor(widget.booking.status),
                  variant: TextVariant.captionMedium,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const Divider(height: 24),

          // Slots details
          const AppText(
            'Reserved Slots',
            fontWeight: FontWeight.w600,
            variant: TextVariant.bodyMedium,
          ),
          const SizedBox(height: 8),
          ...widget.booking.slots.map((BookingSlotEntity slot) {
            final String formattedStartTime = slot.startTime.to12HourTime;
            final String formattedEndTime = slot.endTime.to12HourTime;
            final String slotTimeRange = '$formattedStartTime - $formattedEndTime';
            return Padding(
              padding: const EdgeInsets.only(bottom: 6.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Expanded(
                    child: AppText(
                      '• ${slot.slotName} ($slotTimeRange)',
                      variant: TextVariant.bodyMedium,
                      color: AppColors.onSurfaceVariant,
                    ),
                  ),
                  AppText(
                    '₹${slot.price.toStringAsFixed(0)}',
                    variant: TextVariant.bodyMedium,
                    fontWeight: FontWeight.w600,
                  ),
                ],
              ),
            );
          }),

          const Divider(height: 24),

          // Total Price and booking ID
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  AppText(
                    'Booking ID',
                    variant: TextVariant.captionRegular,
                    color: AppColors.onSurfaceVariant,
                  ),
                  const SizedBox(height: 2),
                  AppText(
                    widget.booking.id.substring(0, 8).toUpperCase(),
                    variant: TextVariant.bodyMedium,
                    fontWeight: FontWeight.w600,
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: <Widget>[
                  AppText(
                    'Total Paid',
                    variant: TextVariant.captionRegular,
                    color: AppColors.onSurfaceVariant,
                  ),
                  const SizedBox(height: 2),
                  AppText(
                    '₹${widget.booking.totalAmount.toStringAsFixed(2)}',
                    variant: TextVariant.headingMedium,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ],
              ),
            ],
          ),

          // Expander trigger
          const SizedBox(height: 12),
          InkWell(
            onTap: () {
              setState(() {
                _isExpanded = !_isExpanded;
              });
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Icon(
                  _isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                  color: AppColors.primary,
                  size: 20,
                ),
                const SizedBox(width: 4),
                AppText(
                  _isExpanded ? 'Hide Billing Breakdown' : 'View Billing Breakdown',
                  color: AppColors.primary,
                  variant: TextVariant.captionMedium,
                  fontWeight: FontWeight.w600,
                ),
              ],
            ),
          ),

          // Expander block
          if (_isExpanded) ...<Widget>[
            const SizedBox(height: 16),
            if (widget.booking.user != null) ...<Widget>[
              Container(
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.only(bottom: 12),
                decoration: BoxDecoration(
                  color: AppColors.surfaceLow,
                  borderRadius: AppShapes.sm,
                  border: Border.all(color: AppColors.outline),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const AppText(
                      'Customer Details',
                      fontWeight: FontWeight.bold,
                      variant: TextVariant.bodyMedium,
                    ),
                    const SizedBox(height: 8),
                    _buildDetailRow('Name', widget.booking.user!.fullName),
                    _buildDetailRow('Mobile', widget.booking.user!.mobileNumber),
                    _buildDetailRow('Email', widget.booking.user!.email),
                  ],
                ),
              ),
            ],
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surfaceLow,
                borderRadius: AppShapes.sm,
                border: Border.all(color: AppColors.outline),
              ),
              child: Column(
                children: <Widget>[
                  _buildBreakdownRow('Subtotal Slots', '₹${widget.booking.amount.toStringAsFixed(2)}'),
                  _buildBreakdownRow('Cleaning Fee', '₹${widget.booking.cleaningFee.toStringAsFixed(2)}'),
                  _buildBreakdownRow('Security Deposit', '₹${widget.booking.securityAmount.toStringAsFixed(2)}'),
                  const Divider(height: 16),
                  _buildBreakdownRow('Total Customer Paid', '₹${widget.booking.totalAmount.toStringAsFixed(2)}', isBold: true),
                  const Divider(height: 16),
                  _buildBreakdownRow(
                    'Commission (${widget.booking.commissionPercent.toStringAsFixed(0)}%)',
                    '- ₹${widget.booking.commissionAmount.toStringAsFixed(2)}',
                    textColor: AppColors.error,
                  ),
                  const Divider(height: 16),
                  _buildBreakdownRow(
                    'Net Earnings (Owner)',
                    '₹${widget.booking.venueAmount.toStringAsFixed(2)}',
                    textColor: AppColors.success,
                    isBold: true,
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          SizedBox(
            width: 80,
            child: AppText(
              '$label:',
              fontWeight: FontWeight.w600,
              variant: TextVariant.captionMedium,
              color: AppColors.onSurfaceVariant,
            ),
          ),
          Expanded(
            child: AppText(
              value,
              variant: TextVariant.captionMedium,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBreakdownRow(String label, String value, {bool isBold = false, Color? textColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          AppText(
            label,
            variant: TextVariant.captionMedium,
            fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
          ),
          AppText(
            value,
            variant: TextVariant.captionMedium,
            fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
            color: textColor,
          ),
        ],
      ),
    );
  }
}
