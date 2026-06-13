import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../../core/router/route_name.dart';
import '../../../../../core/utils/ui/snackbar_command.dart';
import '../../../../../core/validation/app_validation.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/custom_text_field.dart';
import '../../../domain/params/auth_param.dart';
import '../../bloc/owner/owner_auth_bloc.dart';
import '../widget/auth_header.dart';

class VenueOwnerSignupPage extends StatefulWidget {
  const VenueOwnerSignupPage({super.key});

  @override
  State<VenueOwnerSignupPage> createState() => _VenueOwnerSignupPageState();
}

class _VenueOwnerSignupPageState extends State<VenueOwnerSignupPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  final TextEditingController _fullNameController = TextEditingController();
  final TextEditingController _businessNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _mobileController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _mobileController.dispose();
    _passwordController.dispose();
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
        child: BlocConsumer<OwnerAuthBloc, OwnerAuthState>(
          listener: (BuildContext context, OwnerAuthState state) {
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
              if (state.otpResponse != null) {
                context.goNamed(AppRouteNames.venueOwnerVerify);
              } else if (state.verifyOtpResponse != null) {
                context.goNamed(AppRouteNames.ownerVerification);
              }
            }
          },
          builder: (BuildContext context, OwnerAuthState state) {
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    // mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      const SizedBox(height: 60),

                      const AuthHeader(
                        title: 'Create Your Owner Account',
                        subtitle:
                            'Join our premium marketplace and start reaching thousands of potential venue seekers today.',
                      ),

                      const SizedBox(height: 40),

                      // Text Fields
                      CustomTextField(
                        label: 'Full Owner Name',
                        hint: 'Enter your full legal name',
                        controller: _fullNameController,
                        icon: Icons.email_outlined,
                        keyboardType: TextInputType.name,
                        maxLength: 25,
                        validator: AppValidation.validateFullname,
                      ),
                      const SizedBox(height: 16),
                      CustomTextField(
                        label: 'Business Name',
                        hint: 'Enter registered business name',
                        controller: _businessNameController,
                        icon: Icons.email_outlined,
                        keyboardType: TextInputType.name,
                        maxLength: 25,
                        validator: AppValidation.validateBusinessName,
                      ),
                      const SizedBox(height: 16),
                      CustomTextField(
                        label: 'Email Address',
                        hint: 'abc@company.com',
                        controller: _emailController,
                        icon: Icons.email_outlined,
                        keyboardType: TextInputType.emailAddress,
                        maxLength: 50,
                        validator: AppValidation.validateEmail,
                      ),
                      const SizedBox(height: 16),
                      CustomTextField(
                        label: 'Mobile Number',
                        hint: '9876543210',
                        controller: _mobileController,
                        icon: Icons.email_outlined,
                        keyboardType: TextInputType.number,
                        maxLength: 10,
                        validator: AppValidation.validateMobile,
                      ),
                      const SizedBox(height: 16),
                      CustomTextField(
                        label: 'Create Password',
                        hint: 'At least 6 characters',
                        controller: _passwordController,
                        icon: Icons.email_outlined,
                        keyboardType: TextInputType.visiblePassword,
                        maxLength: 25,
                        validator: AppValidation.validatePassword,
                      ),
                      const SizedBox(height: 16),

                      AppButton(
                        label: 'Sign In',
                        onPressed: () {
                          if (_formKey.currentState!.validate()) {
                            final OwnerRegisterParams registerParams =
                                OwnerRegisterParams(
                                  fullName: _fullNameController.text.trim(),
                                  businessName: _businessNameController.text
                                      .trim(),
                                  email: _emailController.text.trim(),
                                  mobileNumber:
                                      '+91${_mobileController.text.trim()}',
                                  password: _passwordController.text.trim(),
                                );
                            context.read<OwnerAuthBloc>().add(
                              OwnerAuthEvent.registerAccount(
                                requestParam: registerParams,
                              ),
                            );
                          }
                        },
                      ),

                      const SizedBox(height: 24),

                      // Navigation using AppText for consistency
                      GestureDetector(
                        onTap: () => context.goNamed(AppRouteNames.signin),
                        child: RichText(
                          text: TextSpan(
                            style: theme.textTheme.bodyMedium,
                            children: <InlineSpan>[
                              const TextSpan(text: 'Already have an account? '),
                              TextSpan(
                                text: 'Sign In',
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
            );
          },
        ),
      ),
    );
  }
}
