import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';

import '../../../../core/extension/date_extension.dart';
import '../../../../core/router/route_name.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/utils/ui/snackbar_command.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_cached_image.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_app_bar.dart';
import '../../../booking/domain/entity/booking_entities.dart';
import '../../../booking/presentation/bloc/booking_bloc.dart';
import '../../../user_profile/presentation/bloc/user_profile_bloc.dart';
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
  String _selectedTimeSlot = '';
  late List<String> _timeSlots;

  @override
  void initState() {
    super.initState();
    _selectedDate = DateTime.now().add(const Duration(days: 5));

    _venue = widget.venue;

    // Dynamically build slots list
    _timeSlots = _venue.slots
        .map(
          (UserVenueSlotEntity slot) =>
              '${slot.slotName} (${slot.startTime.to12HourTime} - ${slot.endTime.to12HourTime})',
        )
        .toList();

    if (_timeSlots.isEmpty) {
      _timeSlots = <String>[
        '08.00 AM - 12.00 PM',
        '01.00 PM - 05.00 PM',
        '09.00 AM - 05.00 PM',
        '06.00 PM - 10.00 PM',
        '09.00 AM - 09.00 PM',
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
              'Venue Rate',
              '\u{20B9} ${hourlyRate.toStringAsFixed(0)}',
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
                firstDate: DateTime.now().add(const Duration(days: 1)),
                lastDate: DateTime.now().add(const Duration(days: 150)),
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
          // const AppText('DURATION HOURS'),
          // const SizedBox(height: 8),
          // DropdownButtonFormField<double>(
          //   value: _selectedHours,
          //   decoration: const InputDecoration(
          //     contentPadding: EdgeInsets.symmetric(
          //       horizontal: 12,
          //       vertical: 12,
          //     ),
          //   ),
          //   items: const <DropdownMenuItem<double>>[
          //     DropdownMenuItem<double>(value: 4.0, child: AppText('4 Hours')),
          //     DropdownMenuItem<double>(value: 8.0, child: AppText('8 Hours')),
          //     DropdownMenuItem<double>(value: 12.0, child: AppText('12 Hours')),
          //   ],
          //   onChanged: (double? val) {
          //     setState(() {
          //       _selectedHours = val ?? 8.0;
          //     });
          //   },
          // ),
          // const SizedBox(height: 20),

          // Time Slot Selection
          const AppText('TIME SLOT'),
          const SizedBox(height: 8),
          RadioGroup<String>(
            groupValue: _selectedTimeSlot,
            onChanged: (String? val) {
              setState(() {
                _selectedTimeSlot = val ?? _timeSlots.first;
              });
            },
            child: Column(
              children: _timeSlots.map((String slot) {
                return RadioListTile<String>(
                  title: AppText(slot),
                  value: slot,
                  contentPadding: EdgeInsets.zero,
                  activeColor: AppColors.primary,
                  dense: true,
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 32),

          // Submit Request Button
          AppButton(
            label: 'Review Bookings & Policy',
            onPressed: () {
              context.push(
                '/${AppRouteNames.checkoutPolicy}',
                extra: <String, dynamic>{
                  'venue': _venue,
                  'selectedDate': _selectedDate,
                  'selectedTimeSlot': _selectedTimeSlot,
                },
              );
            },
          ),
          // SizedBox(
          //   width: double.infinity,
          //   height: 52,
          //   child: ElevatedButton(
          //     style: ElevatedButton.styleFrom(
          //       backgroundColor: AppColors.primary,
          //       foregroundColor: Colors.white,
          //       shape: RoundedRectangleBorder(
          //         borderRadius: AppShapes.defaultBorder,
          //       ),
          //       elevation: 0,
          //     ),
          //     onPressed: () {
          //       Navigator.of(context).push(
          //         MaterialPageRoute<UserBookingDetailsPolicyScreen>(
          //           builder: (BuildContext context) =>
          //               UserBookingDetailsPolicyScreen(
          //                 venue: _venue,
          //                 selectedHours: _selectedHours,
          //                 selectedTimeSlot: _selectedTimeSlot,
          //               ),
          //         ),
          //       );
          //     },
          //     child: const AppText('Review Bookings & Policy'),
          //   ),
          // ),
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
          padding: AppSpacing.screenPadding,
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
    required this.selectedDate,
    required this.selectedTimeSlot,
    super.key,
  });

  final UserVenueEntity venue;
  final DateTime selectedDate;
  final String selectedTimeSlot;

  @override
  State<UserBookingDetailsPolicyScreen> createState() =>
      _UserBookingDetailsPolicyScreenState();
}

class _UserBookingDetailsPolicyScreenState
    extends State<UserBookingDetailsPolicyScreen> {
  bool _agreedToPolicies = false;
  late final Razorpay _razorpay;
  String _bookingId = '';
  bool _isLoading = false;
  bool _waitingForProfileUpdate = false;

  @override
  void initState() {
    super.initState();
    _agreedToPolicies = false;
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  @override
  void dispose() {
    _razorpay.clear();
    super.dispose();
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) {
    SnackbarCommand.show(
      type: ToastType.success,
      title: 'Payment Successful',
      description: 'Verifying payment status...',
    );

    context.read<BookingBloc>().add(
      BookingEvent.verifyPayment(
        bookingId: _bookingId,
        razorpayOrderId: response.orderId ?? '',
        razorpayPaymentId: response.paymentId ?? '',
        razorpaySignature: response.signature ?? '',
      ),
    );
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    setState(() {
      _isLoading = false;
    });

    if (response.code == Razorpay.PAYMENT_CANCELLED) {
      SnackbarCommand.show(
        type: ToastType.error,
        title: 'Payment Cancelled',
        description: 'You have cancelled the payment.',
      );

      context.read<BookingBloc>().add(
        BookingEvent.cancel(bookingId: _bookingId),
      );
    } else {
      SnackbarCommand.show(
        type: ToastType.error,
        title: 'Payment Failed',
        description: response.message ?? 'Payment failed.',
      );

      context.push(
        '/booking_failure',
        extra: response.message ?? 'Payment failed.',
      );
    }
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    SnackbarCommand.show(
      type: ToastType.info,
      title: 'External Wallet',
      description: 'External wallet chosen: ${response.walletName}',
    );
  }

  @override
  Widget build(BuildContext context) {
    final double hourlyRate = widget.venue.slots.isNotEmpty
        ? widget.venue.slots.first.price
        : 0.0;
    final double baseAmount = hourlyRate;

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
    final double serviceFee = baseAmount * 0.02;
    final double totalAmount = baseAmount + cleaning + security + serviceFee;

    return BlocListener<UserProfileBloc, UserProfileState>(
      listener: (BuildContext context, UserProfileState profileState) {
        if (profileState.status == UserProfileStatus.success &&
            profileState.profile != null) {
          final String? name = profileState.profile!.fullName;
          final String? email = profileState.profile!.email;

          if (_waitingForProfileUpdate &&
              name != null &&
              name.trim().isNotEmpty &&
              email != null &&
              email.trim().isNotEmpty) {
            setState(() {
              _waitingForProfileUpdate = false;
              _isLoading = false;
            });
            _proceedToCheckoutDirectly();
          }
        } else if (profileState.status == UserProfileStatus.failure &&
            _waitingForProfileUpdate) {
          setState(() {
            _waitingForProfileUpdate = false;
            _isLoading = false;
          });
          SnackbarCommand.show(
            type: ToastType.error,
            title: 'Profile Update Failed',
            description:
                profileState.errorMessage ?? 'Failed to update profile info',
          );
        } else if (profileState.status == UserProfileStatus.loading &&
            _waitingForProfileUpdate) {
          setState(() {
            _isLoading = true;
          });
        }
      },
      child: BlocConsumer<BookingBloc, BookingState>(
      listener: (BuildContext context, BookingState state) {
        state.maybeWhen(
          loading: () {
            setState(() {
              _isLoading = true;
            });
          },
          checkoutSuccess: (BookingCheckoutResult checkoutResult) {
            setState(() {
              _isLoading = false;
            });
            _bookingId = checkoutResult.bookingId;

            final Map<String, dynamic> options = <String, dynamic>{
              'key': checkoutResult.razorpayKeyId,
              'amount': (checkoutResult.amount * 100).toInt(),
              'name': 'Book My Venue',
              'description': 'Booking for ${widget.venue.venueName}',
              'order_id': checkoutResult.razorpayOrderId,
              'prefill': <String, String>{'contact': '', 'email': ''},
            };

            try {
              _razorpay.open(options);
            } catch (e) {
              SnackbarCommand.show(
                type: ToastType.error,
                title: 'Checkout Error',
                description: 'Failed to launch Razorpay: $e',
              );
            }
          },
          verifySuccess: (BookingDetailsEntity details, String message) {
            setState(() {
              _isLoading = false;
            });
            SnackbarCommand.show(
              type: ToastType.success,
              title: 'Success',
              description: message,
            );
            context.pushReplacement('/booking_success', extra: details);
          },
          cancelSuccess: (BookingDetailsEntity details, String message) {
            setState(() {
              _isLoading = false;
            });
            SnackbarCommand.show(
              type: ToastType.info,
              title: 'Cancelled',
              description: message,
            );
          },
          failure: (String message) {
            setState(() {
              _isLoading = false;
            });
            SnackbarCommand.show(
              type: ToastType.error,
              title: 'Booking Error',
              description: message,
            );
            context.push('/booking_failure', extra: message);
          },
          orElse: () {
            setState(() {
              _isLoading = false;
            });
          },
        );
      },
      builder: (BuildContext context, BookingState state) {
        return Scaffold(
          appBar: const CustomAppBar(title: 'Policies & Review'),
          body: Stack(
            children: <Widget>[
              SingleChildScrollView(
                padding: AppSpacing.screenPadding,
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
                                      widget.venue.coverImageUrl.isNotEmpty
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
                                      '${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year} | ${widget.selectedTimeSlot}',
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
                              AppText(
                                'Standard Cancellation Policy',
                                fontWeight: FontWeight.bold,
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
                          '1. Overtime hours are charged at an additional ₹500 per hour, separate from the standard hourly rate.\n2. No smoking permitted indoors. Outdoor smoking areas available.\n3. Noise levels must be kept within municipal guidelines after 10:00 PM.\n4. Clean-up fee covers normal usage. Excess clutter will require additional security deposit deduction.',
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
                                'Base Rate \u{20B9} ${hourlyRate.toStringAsFixed(0)})',
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
                                'Service & Platform Fee (2%)',
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
                        AppButton(
                          label: 'Proceed to Secure Checkout',
                          onPressed: _agreedToPolicies
                              ? _onProceedToSecureCheckoutPressed
                              : null,
                        ),

                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
              ),
              if (_isLoading)
                const ModalBarrier(dismissible: false, color: Colors.black26),
              if (_isLoading) const Center(child: CircularProgressIndicator()),
            ],
          ),
        );
      },
    ),
  );
}

  void _proceedToCheckoutDirectly() {
    final int selectedIndex = widget.venue.slots.indexWhere(
      (UserVenueSlotEntity slot) =>
          '${slot.slotName} (${slot.startTime.to12HourTime} - ${slot.endTime.to12HourTime})' ==
          widget.selectedTimeSlot,
    );
    final String slotId = selectedIndex != -1
        ? widget.venue.slots[selectedIndex].id
        : widget.venue.slots.first.id;

    context.read<BookingBloc>().add(
      BookingEvent.checkout(
        venueId: widget.venue.id,
        bookingDate: widget.selectedDate.yyyyMmDd,
        slotIds: <String>[slotId],
      ),
    );
  }

  void _onProceedToSecureCheckoutPressed() {
    final UserProfileState profileState = context.read<UserProfileBloc>().state;
    final String? name = profileState.profile?.fullName;
    final String? email = profileState.profile?.email;

    if (name != null &&
        name.trim().isNotEmpty &&
        email != null &&
        email.trim().isNotEmpty) {
      _proceedToCheckoutDirectly();
    } else {
      _showCompleteProfileBottomSheet(
        initialName: name ?? '',
        initialEmail: email ?? '',
      );
    }
  }

  void _showCompleteProfileBottomSheet({
    required String initialName,
    required String initialEmail,
  }) {
    final TextEditingController nameController =
        TextEditingController(text: initialName);
    final TextEditingController emailController =
        TextEditingController(text: initialEmail);
    final GlobalKey<FormState> formKey = GlobalKey<FormState>();

    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.background,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 24,
            left: 24,
            right: 24,
            top: 24,
          ),
          child: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    const AppText(
                      'Complete Profile',
                      variant: TextVariant.headingMedium,
                      fontWeight: FontWeight.bold,
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                AppText(
                  'Please update your name and email to proceed with secure checkout.',
                  variant: TextVariant.bodyMedium,
                  color: AppColors.onSurfaceVariant,
                ),
                const SizedBox(height: 24),
                TextFormField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Full Name',
                    hintText: 'Enter your full name',
                    prefixIcon: Icon(Icons.person_outline),
                  ),
                  validator: (String? val) {
                    if (val == null || val.trim().isEmpty) {
                      return 'Full name is required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    labelText: 'Email Address',
                    hintText: 'Enter your email address',
                    prefixIcon: Icon(Icons.email_outlined),
                  ),
                  keyboardType: TextInputType.emailAddress,
                  validator: (String? val) {
                    if (val == null || val.trim().isEmpty) {
                      return 'Email is required';
                    }
                    final RegExp emailRegex = RegExp(
                      r'^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+',
                    );
                    if (!emailRegex.hasMatch(val.trim())) {
                      return 'Please enter a valid email';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 32),
                AppButton(
                  label: 'Save & Proceed',
                  onPressed: () {
                    if (formKey.currentState!.validate()) {
                      Navigator.pop(context);
                      setState(() {
                        _waitingForProfileUpdate = true;
                      });
                      this.context.read<UserProfileBloc>().add(
                            UserProfileEvent.updateUserProfile(
                              fullName: nameController.text.trim(),
                              email: emailController.text.trim(),
                            ),
                          );
                    }
                  },
                ),
              ],
            ),
          ),
        );
      },
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
