import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/utils/app_spacing.dart';
import '../../../../core/utils/colors.dart';
import '../../../../core/utils/shape_constants.dart';
import '../../../../core/widgets/app_text.dart';
import '../../domain/enum/venue_category_enum.dart';
import '../../domain/entity/venue_response_entity.dart';
import '../../domain/params/add_venue_params.dart';
import '../bloc/cubit/venue_details_cubit.dart';
import '../bloc/venue_bloc.dart';
import 'build_action_button.dart';

class DynamicServiceInput {
  final TextEditingController nameController;
  final TextEditingController priceController;

  DynamicServiceInput({String name = '', String price = ''})
    : nameController = TextEditingController(text: name),
      priceController = TextEditingController(text: price);

  void dispose() {
    nameController.dispose();
    priceController.dispose();
  }
}

class BuildStep4Pricing extends StatefulWidget {
  const BuildStep4Pricing({super.key});

  @override
  State<BuildStep4Pricing> createState() => _BuildStep4PricingState();
}

class _BuildStep4PricingState extends State<BuildStep4Pricing> {
  final List<DynamicServiceInput> _services = <DynamicServiceInput>[];
  bool isInstantBookingEnabled = true;
  final Set<SlotTemplate> selectedSlots = <SlotTemplate>{};
  final Map<SlotTemplate, TextEditingController> _slotPriceControllers =
      <SlotTemplate, TextEditingController>{};

  @override
  void initState() {
    super.initState();
    final VenueDetailsCubit cubit = context.read<VenueDetailsCubit>();
    final VenueDetailsState state = cubit.state;
    final VenueCategory? category = state.basicInfo?.category;
    final List<SlotTemplate> slots =
        VenueSlotConfig.slots[category] ?? <SlotTemplate>[];

    // Initialize price controllers for all templates
    for (final SlotTemplate slot in slots) {
      _slotPriceControllers[slot] = TextEditingController(text: '0.00');
    }

    final List<VenuePricingState> existingPricing =
        state.pricing ?? <VenuePricingState>[];
    if (existingPricing.isNotEmpty) {
      isInstantBookingEnabled = existingPricing.first.instantBooking;
      for (final VenuePricingState pricingState in existingPricing) {
        try {
          final SlotTemplate match = slots.firstWhere(
            (SlotTemplate s) => s.name == pricingState.slotName,
          );
          selectedSlots.add(match);
          _slotPriceControllers[match]?.text = pricingState.price.toString();
        } catch (_) {}
      }
    }

    final List<VenueServiceState> existingServices =
        state.service ?? <VenueServiceState>[];
    if (existingServices.isEmpty) {
      _services.add(DynamicServiceInput());
    } else {
      for (final VenueServiceState service in existingServices) {
        _services.add(
          DynamicServiceInput(
            name: service.serviceName,
            price: service.servicePrice.toString(),
          ),
        );
      }
    }
  }

  @override
  void dispose() {
    for (final TextEditingController controller
        in _slotPriceControllers.values) {
      controller.dispose();
    }
    for (final DynamicServiceInput service in _services) {
      service.dispose();
    }
    super.dispose();
  }

  List<VenuePricingState> _getPricingStateList() {
    return List<VenuePricingState>.generate(selectedSlots.length, (int index) {
      final SlotTemplate item = selectedSlots.elementAt(index);
      final TextEditingController? priceController =
          _slotPriceControllers[item];
      final String priceStr = priceController?.text ?? '0.00';
      return VenuePricingState(
        slotName: item.name,
        startTime: item.startTime,
        endTime: item.endTime,
        capacity: 0,
        price: double.tryParse(priceStr) ?? 0.0,
        instantBooking: isInstantBookingEnabled,
      );
    });
  }

  List<VenueServiceState> _getServiceStateList() {
    return _services
        .where(
          (DynamicServiceInput s) => s.nameController.text.trim().isNotEmpty,
        )
        .map((DynamicServiceInput s) {
          final String name = s.nameController.text.trim();
          final String priceStr = s.priceController.text.trim();
          return VenueServiceState(
            serviceName: name,
            servicePrice: double.tryParse(priceStr) ?? 0.0,
          );
        })
        .toList();
  }

  AddNewVenueRequestParams _mapDetailsToRequestParams(
    VenueDetailsState state,
    List<VenuePricingState> pricingList,
    List<VenueServiceState> serviceList,
  ) {
    final VenueBasicInfoState basic = state.basicInfo!;
    final VenueLocationState location = state.location!;
    final VenueMediaState media = state.media!;

    return AddNewVenueRequestParams(
      venueName: basic.venueName,
      category: basic.category.apiValue,
      description: basic.description,
      location: VenueLocationRequestParams(
        address: location.address,
        city: location.city,
        state: location.state,
        country: location.country,
        pincode: location.pincode,
        latitude: location.latitude,
        longitude: location.longitude,
      ),
      venueSize: basic.venueSize,
      maxCapacity: basic.maxCapacity,
      amenityIds: basic.amenities.map((VenueAmenityEntity e) => e.id).toList(),
      coverImageUrl: media.coverImageUrl,
      galleryImages: media.galleryImages,
      virtualTourUrl: media.virtualTourUrl,
      slots: pricingList
          .map(
            (VenuePricingState p) => VenueSlotRequestParams(
              slotName: p.slotName,
              startTime: p.startTime,
              endTime: p.endTime,
              price: p.price,
            ),
          )
          .toList(),
      services: serviceList
          .map(
            (VenueServiceState s) => VenueServiceRequestParams(
              serviceName: s.serviceName,
              price: s.servicePrice,
            ),
          )
          .toList(),
      instantBooking: isInstantBookingEnabled,
    );
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: BlocBuilder<VenueDetailsCubit, VenueDetailsState>(
        builder: (BuildContext context, VenueDetailsState state) {
          final List<SlotTemplate> slots =
              VenueSlotConfig.slots[state.basicInfo?.category] ??
              <SlotTemplate>[];
          return Column(
            spacing: AppSpacing.spaceMd,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              // PRICING SLOTS BLOCK
              _buildSectionContainer(
                child: Column(
                  spacing: AppSpacing.spaceMd,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const AppText('VENUE CATEGORY'),

                    AppText(
                      state.basicInfo?.category.title.toUpperCase() ?? '',
                      variant: TextVariant.headingLarge,
                    ),

                    ListView.builder(
                      physics: const NeverScrollableScrollPhysics(),
                      padding: EdgeInsets.zero,
                      shrinkWrap: true,
                      itemCount: slots.length,
                      itemBuilder: (_, int index) {
                        final SlotTemplate slot = slots[index];

                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8.0),
                          child: PricingSlotCard(
                            slot: slot,
                            isSelected: selectedSlots.contains(slot),
                            priceController: _slotPriceControllers[slot]!,
                            onChanged: (bool? value) {
                              setState(() {
                                if (value ?? false) {
                                  selectedSlots.add(slot);
                                } else {
                                  selectedSlots.remove(slot);
                                }
                              });
                            },
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),

              // SERVICES & EXTRAS BLOCK
              _buildSectionContainer(
                child: Column(
                  spacing: AppSpacing.spaceMd,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                        const Row(
                          spacing: AppSpacing.spaceSm,
                          children: <Widget>[
                            Icon(
                              Icons.add_circle,
                              color: Color(0xFF9C363F),
                              size: 20,
                            ),
                            AppText('Services & Extras'),
                          ],
                        ),
                        TextButton.icon(
                          onPressed: () {
                            setState(() {
                              _services.add(DynamicServiceInput());
                            });
                          },
                          icon: const Icon(Icons.add, size: 18),
                          label: const AppText('Add Service'),
                          style: TextButton.styleFrom(
                            foregroundColor: const Color(0xFF9C363F),
                          ),
                        ),
                      ],
                    ),

                    if (_services.isEmpty)
                      const Center(
                        child: Padding(
                          padding: EdgeInsets.symmetric(vertical: 16.0),
                          child: AppText(
                            'No extra services added yet.',
                            color: Colors.grey,
                          ),
                        ),
                      )
                    else
                      ListView.builder(
                        physics: const NeverScrollableScrollPhysics(),
                        padding: EdgeInsets.zero,
                        shrinkWrap: true,
                        itemCount: _services.length,
                        itemBuilder: (_, int index) {
                          final DynamicServiceInput service = _services[index];
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 8.0),
                            child: DynamicServiceCard(
                              nameController: service.nameController,
                              priceController: service.priceController,
                              onDelete: () {
                                setState(() {
                                  _services.removeAt(index).dispose();
                                });
                              },
                            ),
                          );
                        },
                      ),
                  ],
                ),
              ),

              // INSTANT BOOKING BLOCK
              InstantBookingCard(
                isSwitched: isInstantBookingEnabled,
                onSwitched: (bool val) =>
                    setState(() => isInstantBookingEnabled = val),
              ),

              // SUBMIT BUTTON
              BuildActionButton(
                onTap: (int step) async {
                  if (step == 3) {
                    final List<VenuePricingState> pricingList =
                        _getPricingStateList();
                    final List<VenueServiceState> serviceList =
                        _getServiceStateList();
                    context.read<VenueDetailsCubit>().updatePricing(
                      step: 3,
                      pricing: pricingList,
                      service: serviceList,
                    );
                    return;
                  }

                  // Validations
                  if (selectedSlots.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text(
                          'Please select at least one pricing slot',
                        ),
                      ),
                    );
                    return;
                  }

                  // Verify slot prices
                  for (final SlotTemplate slot in selectedSlots) {
                    final String? priceText = _slotPriceControllers[slot]?.text
                        .trim();
                    if (priceText == null || priceText.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            'Please enter a price for ${slot.name}',
                          ),
                        ),
                      );
                      return;
                    }
                  }

                  // Update pricing state in Cubit
                  final List<VenuePricingState> pricingList =
                      _getPricingStateList();
                  final List<VenueServiceState> serviceList =
                      _getServiceStateList();
                  context.read<VenueDetailsCubit>().updatePricing(
                    step: 4,
                    pricing: pricingList,
                    service: serviceList,
                  );

                  // Submit and call API via bloc
                  final VenueDetailsState detailsState = context
                      .read<VenueDetailsCubit>()
                      .state;
                  final AddNewVenueRequestParams params =
                      _mapDetailsToRequestParams(
                        detailsState,
                        pricingList,
                        serviceList,
                      );

                  context.read<VenueBloc>().add(
                    VenueEvent.addNewVenue(params: params),
                  );
                },
              ),

              // BOTTOM NOTICE
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF4FBF7),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Row(
                  spacing: AppSpacing.spaceSm,
                  children: <Widget>[
                    Icon(Icons.check_circle, size: 20, color: Colors.green),

                    Expanded(
                      child: AppText(
                        'Ready to go! Your venue will be reviewed by our team within 24 hours.',
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSectionContainer({required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: child,
    );
  }
}

class PricingSlotCard extends StatelessWidget {
  const PricingSlotCard({
    super.key,
    required this.slot,
    required this.isSelected,
    required this.priceController,
    required this.onChanged,
  });

  final SlotTemplate slot;
  final bool isSelected;
  final TextEditingController priceController;
  final ValueChanged<bool?> onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: AppSpacing.pMd,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppShapes.defaultBorder,
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        children: <Widget>[
          Checkbox(
            value: isSelected,
            onChanged: onChanged,
            activeColor: AppColors.primaryDark,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(4),
            ),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                AppText(slot.name),
                if (slot.startTime.isNotEmpty && slot.endTime.isNotEmpty)
                  AppText('${slot.startTime} - ${slot.endTime}'),
              ],
            ),
          ),
          _buildPriceField(),
        ],
      ),
    );
  }

  Widget _buildPriceField() {
    return Container(
      width: 110,
      height: 40,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Row(
        children: <Widget>[
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 10),
            child: AppText('\u{20B9}'),
          ),
          Expanded(
            child: TextFormField(
              controller: priceController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                border: InputBorder.none,
                contentPadding: EdgeInsets.only(bottom: 10),
              ),
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }
}

class DynamicServiceCard extends StatelessWidget {
  const DynamicServiceCard({
    super.key,
    required this.nameController,
    required this.priceController,
    required this.onDelete,
  });

  final TextEditingController nameController;
  final TextEditingController priceController;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFFCF9F9),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        children: <Widget>[
          Expanded(
            child: TextFormField(
              controller: nameController,
              decoration: const InputDecoration(
                hintText: 'Service name (e.g. Cleaning)',
                border: InputBorder.none,
              ),
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
          const SizedBox(width: 8),
          Container(
            width: 110,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Row(
              children: <Widget>[
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10),
                  child: AppText('\u{20B9}'),
                ),
                Expanded(
                  child: TextFormField(
                    controller: priceController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.only(bottom: 10),
                    ),
                    style: const TextStyle(fontWeight: FontWeight.w500),
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline, color: Color(0xFF9C363F)),
            onPressed: onDelete,
          ),
        ],
      ),
    );
  }
}

class InstantBookingCard extends StatelessWidget {
  const InstantBookingCard({
    super.key,
    required this.isSwitched,
    required this.onSwitched,
  });
  final bool isSwitched;
  final ValueChanged<bool> onSwitched;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              Icon(Icons.bolt, color: AppColors.primary),

              const AppText('Instant Booking'),
              const Spacer(),
              Switch(
                value: isSwitched,
                onChanged: onSwitched,
                activeTrackColor: AppColors.primary,
              ),
            ],
          ),

          const AppText(
            'Allow guests to book immediately without manual approval. This typically increases conversion by 40%.',
          ),
        ],
      ),
    );
  }
}
