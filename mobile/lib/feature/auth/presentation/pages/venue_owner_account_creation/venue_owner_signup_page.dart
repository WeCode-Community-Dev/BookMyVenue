import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../../core/router/route_name.dart';
import '../../../../../core/utils/ui/snackbar_command.dart';
import '../../../../../core/validation/app_validation.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/custom_text_field.dart';
import '../../bloc/auth_bloc.dart';
import '../widget/auth_header.dart';

class VenueOwnerSignupPage extends StatefulWidget {
  const VenueOwnerSignupPage({super.key});

  @override
  State<VenueOwnerSignupPage> createState() => _VenueOwnerSignupPageState();
}

class _VenueOwnerSignupPageState extends State<VenueOwnerSignupPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  final TextEditingController _fullNameController = TextEditingController();
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
        child: BlocConsumer<AuthBloc, AuthState>(
          listener: (BuildContext context, AuthState state) {
            if (state.successMessage != null) {
              SnackbarCommand.show(
                type: ToastType.success,
                title: state.successMessage!,
              );
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
                      hint: 'Enter Fullname',
                      controller: _fullNameController,
                      icon: Icons.email_outlined,
                      keyboardType: TextInputType.name,
                      maxLength: 25,
                      validator: AppValidation.validateFullname,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      hint: 'Enter your email',
                      controller: _emailController,
                      icon: Icons.email_outlined,
                      keyboardType: TextInputType.emailAddress,
                      maxLength: 50,
                      validator: AppValidation.validateEmail,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      hint: 'Enter mobile number',
                      controller: _mobileController,
                      icon: Icons.email_outlined,
                      keyboardType: TextInputType.number,
                      maxLength: 10,
                      validator: AppValidation.validateMobile,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      hint: 'Enter password',
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
                        context.pushNamed(AppRouteNames.ownerBusinessProfile);
                      },
                    ),

                    const SizedBox(height: 24),

                    const Spacer(),

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
            );
          },
        ),
      ),
    );
  }
}
