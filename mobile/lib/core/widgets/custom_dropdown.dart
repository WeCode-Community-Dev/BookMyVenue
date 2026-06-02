import 'package:flutter/material.dart';

import 'app_text.dart';

class CustomDropdown extends StatelessWidget {
  const CustomDropdown({
    super.key,
    required this.label,
    required this.items,
    required this.onChanged,
    this.value,
    this.hint,
    this.prefixIcon,
    this.validator,
  });
  final String label;
  final String? hint;
  final String? value;
  final List<String> items;
  final Widget? prefixIcon;
  final Function(String?) onChanged;
  final String? Function(String?)? validator;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        AppText(label),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          isExpanded: true,
          initialValue: value,
          onChanged: onChanged,
          validator: validator,
          decoration: InputDecoration(hintText: hint, prefixIcon: prefixIcon),
          items: items.map((String item) {
            return DropdownMenuItem<String>(
              value: item,
              child: AppText(item, overflow: TextOverflow.ellipsis),
            );
          }).toList(),
        ),
      ],
    );
  }
}
