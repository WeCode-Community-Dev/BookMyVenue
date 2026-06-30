import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../../core/auth/auth_session.dart';
import '../../../../../core/router/route_name.dart';
import '../../../../../core/utils/colors.dart';
import '../../../../../core/utils/ui/snackbar_command.dart';
import '../../../../../core/validation/app_validation.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/app_text.dart';
import '../../../../../core/widgets/custom_text_field.dart';
import '../../../domain/enums/approval_status.dart';
import '../../../domain/enums/role_base.dart';
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

  Timer? _timer;
  int _resendAttempt = 0;
  int _remainingSeconds = 60;
  bool _isTimerRunning = false;

  void _startTimer(int seconds) {
    _timer?.cancel();

    setState(() {
      _remainingSeconds = seconds;
      _isTimerRunning = true;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (Timer timer) {
      if (_remainingSeconds <= 1) {
        timer.cancel();

        setState(() {
          _remainingSeconds = 0;
          _isTimerRunning = false;
        });
      } else {
        setState(() {
          _remainingSeconds--;
        });
      }
    });
  }

  Future<void> _resendOtp() async {
    if (_resendAttempt >= 3) {
      return;
    }

    final OtpRequestParams param = OtpRequestParams(
      mobileNumber: '+91${_mobileController.text.trim()}',
    );
    context.read<AuthBloc>().add(
      AuthEvent.requestOtp(requestParam: param),
    );

    _resendAttempt++;
    int nextDuration = 60;
    if (_resendAttempt == 1) {
      nextDuration = 120;
    } else if (_resendAttempt == 2) {
      nextDuration = 180;
    }

    _startTimer(nextDuration);
  }

  String get formattedTime {
    final int minutes = _remainingSeconds ~/ 60;
    final int seconds = _remainingSeconds % 60;

    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  Widget _buildResendSection() {
    if (_resendAttempt >= 3 && !_isTimerRunning) {
      return const Padding(
        padding: EdgeInsets.only(top: 16.0),
        child: Text(
          'Maximum resend attempts reached.',
          style: TextStyle(color: Colors.red),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.only(top: 16.0),
      child: RichText(
        text: TextSpan(
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: Colors.black87,
            decoration: TextDecoration.none,
            fontSize: 14,
          ),
          children: <InlineSpan>[
            if (_isTimerRunning) ...<InlineSpan>[
              const TextSpan(text: 'Resend OTP in '),
              TextSpan(
                text: formattedTime,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  color: AppColors.primaryDark,
                ),
              ),
            ] else ...<InlineSpan>[
              const TextSpan(text: "Didn't receive the OTP? "),
              WidgetSpan(
                alignment: PlaceholderAlignment.middle,
                child: GestureDetector(
                  onTap: _resendOtp,
                  child: const AppText(
                    'Resend OTP',
                    color: AppColors.primaryDark,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    _mobileController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
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
            }
            if (state.successMessage != null &&
                state.successMessage!.isNotEmpty) {
              SnackbarCommand.show(
                type: ToastType.success,
                title: state.successMessage!,
              );
            }

            // If OTP was successfully requested, start resend timer
            if (state.otpResponse != null && !isOtpReceived) {
              setState(() {
                isOtpReceived = true;
              });
              _startTimer(60);
            }

            // Redirection logic on verification
            if (state.verifyOtpResponse != null) {
              final UserRole role = state.verifyOtpResponse!.user.role;
              if (role == UserRole.customer) {
                context.goNamed(AppRouteNames.userDashboard);
              } else if (role == UserRole.venueOwner) {
                final bool isVerified =
                    AuthSession.ownerVerified == ApprovalStatus.approved;
                if (isVerified) {
                  context.goNamed(AppRouteNames.ownerDashboard);
                } else {
                  context.goNamed(AppRouteNames.ownerVerification);
                }
              }
            }
          },
          builder: (BuildContext context, AuthState state) {
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Form(
                key: _formKey,
                child: Column(
                  children: <Widget>[
                    const SizedBox(height: 60),

                    const AuthHeader(
                      title: 'Welcome Back',
                      subtitle: 'Sign in to continue your journey',
                    ),

                    const SizedBox(height: 40),

                    CustomTextField(
                      hint: 'Continue with mobile number',
                      controller: _mobileController,
                      prefixIcon: Icons.phone_outlined,
                      keyboardType: TextInputType.number,
                      maxLength: 10,
                      validator: AppValidation.validateMobile,
                    ),
                    const SizedBox(height: 16),
                    if (!isOtpReceived)
                      AppButton(
                        isLoading: state.isLoading,
                        label: 'Get OTP',
                        onPressed: () {
                          if (!_formKey.currentState!.validate()) {
                            return;
                          }
                          final OtpRequestParams param = OtpRequestParams(
                            mobileNumber: '+91${_mobileController.text.trim()}',
                          );
                          context.read<AuthBloc>().add(
                            AuthEvent.requestOtp(requestParam: param),
                          );
                        },
                      )
                    else ...<Widget>[
                      OtpFieldWidget(
                        controller: _otpController,
                        onCompleted: (String otp) {
                          setState(() {
                            isValidOtp = true;
                          });
                        },
                      ),
                      _buildResendSection(),
                    ],

                    const SizedBox(height: 32),

                    if (isValidOtp && isOtpReceived)
                      AppButton(
                        isLoading: state.isLoading,
                        label: 'Sign In',
                        onPressed: () {
                          if (_otpController.text.trim().length < 6) {
                            SnackbarCommand.show(
                              type: ToastType.warning,
                              title: 'Please enter a valid 6-digit OTP',
                            );
                            return;
                          }
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
