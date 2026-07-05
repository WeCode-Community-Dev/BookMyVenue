import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/extension/date_extension.dart';
import '../../../../core/router/route_name.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import '../../domain/entity/booking_entities.dart';
import '../bloc/booking_bloc.dart';

class BookingHistoryScreen extends StatefulWidget {
  const BookingHistoryScreen({super.key});

  @override
  State<BookingHistoryScreen> createState() => _BookingHistoryScreenState();
}

class _BookingHistoryScreenState extends State<BookingHistoryScreen> {
  String _selectedFilter = 'All';

  @override
  void initState() {
    super.initState();
    _fetchBookings();
  }

  void _fetchBookings() {
    context.read<BookingBloc>().add(const BookingEvent.fetchMyBookings());
  }

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
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const CustomAppBar(
        title: 'Booking History',
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
                  myBookingsSuccess: (List<BookingDetailsEntity> bookings) {
                    final List<BookingDetailsEntity> filteredList = bookings.where((BookingDetailsEntity booking) {
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
                                Icons.calendar_today_outlined,
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
                                'You do not have any booking history matching this filter.',
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
                                )
                              else
                                AppButton(
                                  label: 'Book a Venue Now',
                                  onPressed: () {
                                    context.go('/${AppRouteNames.listVenue}');
                                  },
                                ),
                            ],
                          ),
                        ),
                      );
                    }

                    // Sort bookings descending by creation date or date
                    final List<BookingDetailsEntity> sortedList = List<BookingDetailsEntity>.from(filteredList)
                      ..sort((BookingDetailsEntity a, BookingDetailsEntity b) => b.createdAt.compareTo(a.createdAt));

                    return RefreshIndicator(
                      onRefresh: () async {
                        _fetchBookings();
                      },
                      child: ListView.builder(
                        physics: const AlwaysScrollableScrollPhysics(),
                        padding: const EdgeInsets.only(bottom: 24),
                        itemCount: sortedList.length,
                        itemBuilder: (BuildContext context, int index) {
                          final BookingDetailsEntity booking = sortedList[index];
                          return _buildBookingCard(booking);
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

  Widget _buildBookingCard(BookingDetailsEntity booking) {
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
                      booking.venueName,
                      variant: TextVariant.headingMedium,
                      fontWeight: FontWeight.bold,
                    ),
                    const SizedBox(height: 4),
                    AppText(
                      'Date: ${_formatBookingDate(booking.bookingDate)}',
                      color: AppColors.onSurfaceVariant,
                      variant: TextVariant.bodyMedium,
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: _getStatusBgColor(booking.status),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: AppText(
                  booking.status.toUpperCase(),
                  color: _getStatusTextColor(booking.status),
                  variant: TextVariant.captionMedium,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const Divider(height: 24),

          // Slots details
          const AppText(
            'Selected Slots',
            fontWeight: FontWeight.w600,
            variant: TextVariant.bodyMedium,
          ),
          const SizedBox(height: 8),
          ...booking.slots.map((BookingSlotEntity slot) {
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
                    booking.id.substring(0, 8).toUpperCase(),
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
                    '₹${booking.amount.toStringAsFixed(2)}',
                    variant: TextVariant.headingMedium,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
