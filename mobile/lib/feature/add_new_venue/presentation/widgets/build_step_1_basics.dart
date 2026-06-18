import 'package:flutter/material.dart';

import '../../../../core/constants/app_constant.dart';
import '../../../../core/widgets/app_text.dart';
import '../../../../core/widgets/custom_dropdown.dart';

class BuildStep1Basics extends StatefulWidget {
  const BuildStep1Basics({super.key});

  @override
  State<BuildStep1Basics> createState() => _BuildStep1BasicsState();
}

class _BuildStep1BasicsState extends State<BuildStep1Basics> {
  final GlobalKey<FormState> _formKeyBasics = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descController = TextEditingController();
  final TextEditingController _capacityController = TextEditingController();
  final TextEditingController _sizeController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _descController.dispose();
    _capacityController.dispose();
    _sizeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKeyBasics,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const AppText('Basic Details'),
          const SizedBox(height: 20),

          const AppText('VENUE NAME'),
          const SizedBox(height: 8),
          TextFormField(
            controller: _nameController,
            decoration: const InputDecoration(
              hintText: 'e.g. Skyline Penthouse Ballroom',
            ),
            validator: (String? val) =>
                val == null || val.isEmpty ? 'Required' : null,
          ),
          const SizedBox(height: 24),

          const AppText('DESCRIPTION'),
          const SizedBox(height: 8),
          TextFormField(
            controller: _descController,
            maxLines: 4,
            decoration: const InputDecoration(
              hintText:
                  'Describe the style, architecture, view and capacity of the venue...',
            ),
            validator: (String? val) =>
                val == null || val.isEmpty ? 'Required' : null,
          ),
          const SizedBox(height: 24),

          Row(
            children: <Widget>[
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const AppText(''),
                    const SizedBox(height: 8),
                    CustomDropdown(
                      label: 'VENUE TYPE',
                      items: AppConst.businessTypes,
                      onChanged: (String? p0) {},
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          Row(
            children: <Widget>[
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const AppText('MAX CAPACITY'),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _capacityController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(hintText: 'e.g. 150'),
                      validator: (String? val) =>
                          val == null || val.isEmpty ? 'Required' : null,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 24),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const AppText('SIZE (SQ FT)'),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _sizeController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(hintText: 'e.g. 3200'),
                      validator: (String? val) =>
                          val == null || val.isEmpty ? 'Required' : null,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
