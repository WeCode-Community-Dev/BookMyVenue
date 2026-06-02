import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../../core/constants/app_constant.dart';
import '../../../../../core/router/route_name.dart';
import '../../../../../core/utils/ui/snackbar_command.dart';
import '../../../../../core/validation/app_validation.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/custom_dropdown.dart';
import '../../../../../core/widgets/custom_text_field.dart';
import '../../bloc/auth_bloc.dart';
import '../widget/auth_header.dart';

class VenueOwnerBusinessProfileSetup extends StatefulWidget {
  const VenueOwnerBusinessProfileSetup({super.key});

  @override
  State<VenueOwnerBusinessProfileSetup> createState() =>
      _VenueOwnerBusinessProfileSetupState();
}

class _VenueOwnerBusinessProfileSetupState
    extends State<VenueOwnerBusinessProfileSetup> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  final TextEditingController _businessNameController = TextEditingController();

  final ValueNotifier<String?> _selectedBusinessNotifier =
      ValueNotifier<String?>(null);

  @override
  void dispose() {
    _businessNameController.dispose();
    _selectedBusinessNotifier.dispose();
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
                      controller: _businessNameController,
                      icon: Icons.email_outlined,
                      keyboardType: TextInputType.name,
                      maxLength: 100,
                      validator: AppValidation.validateFullname,
                    ),
                    const SizedBox(height: 16),
                    ValueListenableBuilder<String?>(
                      valueListenable: _selectedBusinessNotifier,
                      builder:
                          (BuildContext context, String? value, Widget? child) {
                            return CustomDropdown(
                              label: 'Business type',
                              hint: 'Select business type',
                              prefixIcon: const Icon(Icons.business),
                              value: value,
                              items: AppConst.businessTypes,
                              onChanged: (String? val) {
                                _selectedBusinessNotifier.value = val;
                              },
                              validator: (String? val) =>
                                  val == null ? 'Required' : null,
                            );
                          },
                    ),

                    const SizedBox(height: 16),

                    AppButton(label: 'Continue', onPressed: () {}),

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
