import 'package:flutter/material.dart';
import 'package:flutter/src/services/text_formatter.dart';
import 'package:go_router/go_router.dart';
import 'package:pinput/pinput.dart';

import '../../../../core/router/route_name.dart';
import '../../../../core/validation/app_validation.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/custom_text_field.dart';
import '../widget/auth_header.dart';

class SigninPage extends StatefulWidget {
  const SigninPage({super.key});

  @override
  State<SigninPage> createState() => _SigninPageState();
}

class _SigninPageState extends State<SigninPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _mobileController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();
  bool isOtpReceived = false;
  bool isValidOtp = false;

  @override
  Widget build(BuildContext context) {
    // Access theme for spacing and layout logic
    final ThemeData theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      resizeToAvoidBottomInset: false,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: _formKey,
            child: Column(
              // mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                const SizedBox(height: 60),

                const AuthHeader(
                  title: 'Welcome Back',
                  subtitle: 'Sign in to continue your journey',
                ),

                const SizedBox(height: 40),

                // Text Fields
                CustomTextField(
                  hint: 'Continue with mobile number',
                  controller: _mobileController,
                  icon: Icons.email_outlined,
                  keyboardType: TextInputType.number,

                  maxLength: 50,
                  validator: AppValidation.validateMobile,
                ),
                const SizedBox(height: 16),
                if (!isOtpReceived)
                  AppButton(
                    label: 'Get OTP',
                    onPressed: () {
                      setState(() {
                        isOtpReceived = true;
                      });
                    },
                  )
                else
                  OtpFieldWidget(
                    controller: _otpController,
                    onCompleted: (String otp) {
                      print("OTP: $otp");
                      setState(() {
                        isValidOtp = true;
                      });
                    },
                  ),

                const SizedBox(height: 32),

                // Main Action Button (using our new AppButton)
                if (isValidOtp) AppButton(label: 'Sign In', onPressed: () {}),

                const SizedBox(height: 24),

                // Navigation using AppText for consistency
                GestureDetector(
                  onTap: () => context.goNamed(AppRouteNames.signup1),
                  child: RichText(
                    text: TextSpan(
                      style: theme.textTheme.bodyMedium,
                      children: <InlineSpan>[
                        const TextSpan(text: "Don't have an account? "),
                        TextSpan(
                          text: 'Sign Up',
                          style: TextStyle(
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

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
      inputFormatters: <TextInputFormatter>[
        FilteringTextInputFormatter.digitsOnly,
      ],
      defaultPinTheme: defaultPinTheme,

      validator: (String? value) {
        if (value == null || value.length != 4) {
          return 'Enter valid OTP';
        }
        return null;
      },

      onCompleted: onCompleted,
    );
  }
}
