import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'app_text.dart';

class CustomTextField extends StatefulWidget {
  const CustomTextField({
    super.key,
    required this.hint,
    this.controller,
    this.isPassword = false,
    this.prefixIcon,
    this.validator,
    this.keyboardType,
    this.maxLength,
    this.maxLines = 1,
    this.label,
    this.enabled,
  });
  final String hint;
  final String? label;
  final TextEditingController? controller;
  final bool isPassword;
  final IconData? prefixIcon;
  final String? Function(String?)? validator;
  final TextInputType? keyboardType;
  final int? maxLength;
  final int? maxLines;
  final bool? enabled;

  @override
  State<CustomTextField> createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  // Local state to manage visibility
  late bool _obscureText;

  @override
  void initState() {
    super.initState();
    _obscureText = widget.isPassword;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: .min,
      crossAxisAlignment: .start,
      children: <Widget>[
        if (widget.label != null) ...<Widget>[
          AppText(widget.label!, variant: TextVariant.headingMedium),
          const SizedBox(height: 6),
        ],
        TextFormField(
          enabled: widget.enabled,
          controller: widget.controller,
          keyboardType: widget.keyboardType,
          obscureText: _obscureText,
          maxLength: widget.maxLength,
          maxLines: widget.maxLines,
          style: Theme.of(context).textTheme.bodyLarge,
          inputFormatters: <TextInputFormatter>[
            if (widget.keyboardType ==
                TextInputType.number) ...<TextInputFormatter>[
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(10),
            ],
          ],
          validator: widget.validator,
          decoration: InputDecoration(
            counter: const SizedBox(),
            hintText: widget.hint,
            prefixIcon: widget.prefixIcon != null
                ? Icon(widget.prefixIcon, size: 20)
                : null,
            suffixIcon: widget.isPassword
                ? IconButton(
                    icon: Icon(
                      _obscureText
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      size: 20,
                      color: Theme.of(context).hintColor,
                    ),
                    onPressed: () {
                      setState(() {
                        _obscureText = !_obscureText;
                      });
                    },
                  )
                : null,
          ),
        ),
      ],
    );
  }
}
