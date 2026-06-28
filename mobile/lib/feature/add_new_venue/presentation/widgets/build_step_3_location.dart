import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../../../../core/logger/app_logger.dart';
import '../../../../core/services/location_service.dart';
import '../../../../core/utils/app_spacing.dart';
import '../../../../core/validation/app_validation.dart';
import '../../../../core/widgets/custom_text_field.dart';
import '../bloc/cubit/venue_details_cubit.dart';
import 'build_action_button.dart';

class BuildStep3Location extends StatefulWidget {
  const BuildStep3Location({super.key});

  @override
  State<BuildStep3Location> createState() => _BuildStep3LocationState();
}

class _BuildStep3LocationState extends State<BuildStep3Location> {
  final TextEditingController latController = TextEditingController(
    text: '11.6700',
  );
  final TextEditingController lngController = TextEditingController(
    text: '76.2800',
  );

  final TextEditingController addressController = TextEditingController();
  final TextEditingController cityController = TextEditingController();
  final TextEditingController stateController = TextEditingController();
  final TextEditingController countryController = TextEditingController(
    text: 'India',
  );
  final TextEditingController pincodeController = TextEditingController();

  final GlobalKey<FormState> _formKeyLocation = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    final location = context.read<VenueDetailsCubit>().state.location;
    if (location != null) {
      latController.text = location.latitude.toString();
      lngController.text = location.longitude.toString();
      addressController.text = location.address;
      cityController.text = location.city;
      stateController.text = location.state;
      countryController.text = location.country;
      pincodeController.text = location.pincode;
    }
  }

  @override
  void dispose() {
    latController.dispose();
    lngController.dispose();
    addressController.dispose();
    cityController.dispose();
    stateController.dispose();
    countryController.dispose();
    pincodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKeyLocation,
      child: Column(
        spacing: AppSpacing.spaceMd,
        crossAxisAlignment: .start,
        children: <Widget>[
          // TODO(Jiyad): Map integration is pending
          // Container(height: 300, width: double.infinity, child: MapPickerPage()),
          Row(
            crossAxisAlignment: .start,
            spacing: AppSpacing.spaceMd,
            children: [
              Expanded(
                flex: 2,
                child: CustomTextField(
                  controller: stateController,
                  label: 'State',
                  hint: 'Enter State',
                  validator: (String? val) =>
                      AppValidation.validateEmptyField(val, 'State'),
                ),
              ),
              Expanded(
                child: CustomTextField(
                  enabled: false,
                  controller: countryController,
                  label: 'Country',
                  hint: 'Enter Country',
                ),
              ),
            ],
          ),
          CustomTextField(
            controller: cityController,
            label: 'City',
            hint: 'Enter city',
            validator: (String? val) =>
                AppValidation.validateEmptyField(val, 'City'),
          ),
          CustomTextField(
            controller: addressController,
            label: 'Address',
            hint: 'House No, Street, Landmark',
            validator: (String? val) =>
                AppValidation.validateEmptyField(val, 'Address'),
          ),

          CustomTextField(
            controller: pincodeController,
            label: 'Pincode',
            hint: 'Enter Pincode',
            keyboardType: TextInputType.number,
            validator: (String? val) =>
                AppValidation.validateEmptyField(val, 'Pincode'),
          ),
          AppSpacing.h32,
          // Map mockup image
          BuildActionButton(
            onTap: (int step) async {
              if (!_formKeyLocation.currentState!.validate()) {
                return;
              }
              context.read<VenueDetailsCubit>().updateLocation(
                step: step,
                location: VenueLocationState(
                  address: addressController.text.trim(),
                  city: cityController.text.trim(),
                  state: stateController.text.trim(),
                  country: countryController.text.trim(),
                  pincode: pincodeController.text.trim(),
                  latitude: double.parse(latController.text.trim()),
                  longitude: double.parse(lngController.text.trim()),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
