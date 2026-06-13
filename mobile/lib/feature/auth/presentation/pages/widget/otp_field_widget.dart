import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:pinput/pinput.dart';

class OtpFieldWidget extends StatelessWidget {
  const OtpFieldWidget({super.key, required this.controller, this.onCompleted});
  final TextEditingController controller;
  final Function(String)? onCompleted;

  @override
  Widget build(BuildContext context) {
    final PinTheme defaultPinTheme = PinTheme(
      width: 60,
      height: 60,

      textStyle: const TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(12),
      ),
    );

    return Pinput(
      controller: controller,
      length: 6,
      inputFormatters: <TextInputFormatter>[
        FilteringTextInputFormatter.digitsOnly,
      ],
      defaultPinTheme: defaultPinTheme,

      validator: (String? value) {
        if (value == null || value.length != 6) {
          return 'Enter valid OTP';
        }
        return null;
      },

      onCompleted: onCompleted,
    );
  }
}
