import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../../core/router/route_name.dart';
import '../../../../../core/utils/ui/snackbar_command.dart';
import '../../../../../core/validation/app_validation.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/app_text.dart';
import '../../../../../core/widgets/custom_text_field.dart';
import '../../../domain/params/auth_param.dart';
import '../../bloc/user/auth_bloc.dart';
import '../widget/auth_header.dart';
import '../widget/otp_field_widget.dart';

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
  void dispose() {
    _mobileController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Access theme for spacing and layout logic
    final ThemeData theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      resizeToAvoidBottomInset: false,
      body: SafeArea(
        child: BlocConsumer<AuthBloc, AuthState>(
          listener: (BuildContext context, AuthState state) {
            if (state.isError) {
              SnackbarCommand.show(
                type: ToastType.error,
                title: state.errorMessage!,
              );
            } else if (state.successMessage != null) {
              SnackbarCommand.show(
                type: ToastType.success,
                title: state.successMessage!,
              );
              if (state.verifyOtpResponse != null) {
                context.goNamed(
                  AppRouteNames.home,
                  extra: state.verifyOtpResponse!.user.role,
                );
              }
            }
          },
          builder: (BuildContext context, AuthState state) {
            return Padding(
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
                    if (state.successMessage == null)
                      AppButton(
                        isLoading: state.isLoading,
                        label: 'Get OTP',
                        onPressed: () {
                          final OtpRequestParams param = OtpRequestParams(
                            mobileNumber: '+91${_mobileController.text.trim()}',
                          );
                          context.read<AuthBloc>().add(
                            AuthEvent.requestOtp(requestParam: param),
                          );
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
                    if (isValidOtp)
                      AppButton(
                        label: 'Sign In',
                        onPressed: () {
                          final VerifyOtpRequestParams param =
                              VerifyOtpRequestParams(
                                mobileNumber:
                                    '+91${_mobileController.text.trim()}',
                                otp: _otpController.text.trim(),
                              );
                          context.read<AuthBloc>().add(
                            AuthEvent.verifyOtp(requestParam: param),
                          );
                        },
                      ),

                    const SizedBox(height: 24),

                    const Spacer(),
                    const AppText('Want to host events?'),
                    const SizedBox(height: 6),
                    AppButton(
                      onPressed: () =>
                          context.goNamed(AppRouteNames.venueOwnerSignup),
                      label: 'Become a venue owner',
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
