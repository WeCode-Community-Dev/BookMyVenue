import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class CustomTextField extends StatefulWidget {
  const CustomTextField({
    super.key,
    required this.hint,
    this.controller,
    this.isPassword = false,
    this.icon,
    this.validator,
    this.keyboardType,
    this.maxLength,
  });
  final String hint;
  final TextEditingController? controller;
  final bool isPassword;
  final IconData? icon;
  final String? Function(String?)? validator;
  final TextInputType? keyboardType;
  final int? maxLength;

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
    return TextFormField(
      controller: widget.controller,
      keyboardType: widget.keyboardType,
      obscureText: _obscureText,
      maxLength: widget.maxLength,
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
        prefixIcon: widget.icon != null ? Icon(widget.icon, size: 20) : null,
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
    );
  }
}
