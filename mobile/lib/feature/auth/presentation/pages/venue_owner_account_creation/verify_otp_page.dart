import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../core/utils/colors.dart';
import '../../../../../core/widgets/app_button.dart';
import '../../../../../core/widgets/app_text.dart';
import '../../../domain/params/auth_param.dart';
import '../../bloc/owner/owner_auth_bloc.dart';
import '../widget/otp_field_widget.dart';

class OwnerVerifyOtpPage extends StatefulWidget {
  const OwnerVerifyOtpPage({super.key});

  @override
  State<OwnerVerifyOtpPage> createState() => _OwnerVerifyOtpPageState();
}

class _OwnerVerifyOtpPageState extends State<OwnerVerifyOtpPage> {
  final TextEditingController _otpController = TextEditingController();
  bool isValidOtp = false;

  Timer? _timer;

  int _resendAttempt = 0;
  int _remainingSeconds = 60;
  bool _isTimerRunning = true;

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

    // TODO(Jiyad): Call resend OTP API here

    _resendAttempt++;

    final int nextDuration = _resendAttempt * 60;

    _startTimer(nextDuration);
  }

  String get formattedTime {
    final int minutes = _remainingSeconds ~/ 60;
    final int seconds = _remainingSeconds % 60;

    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  Widget _buildResendSection() {
    if (_resendAttempt >= 3 && !_isTimerRunning) {
      return const Text(
        'Maximum resend attempts reached.',
        style: TextStyle(color: Colors.red),
      );
    }

    return RichText(
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
    );
  }

  @override
  void initState() {
    super.initState();
    _startTimer(60);
  }

  @override
  void dispose() {
    _otpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Padding(
        padding: const EdgeInsets.all(16.0).copyWith(bottom: 50),
        child: Column(
          mainAxisAlignment: .center,
          crossAxisAlignment: .start,
          spacing: 22,
          children: <Widget>[
            OtpFieldWidget(
              controller: _otpController,
              onCompleted: (String otp) {
                print("OTP: $otp");
                setState(() {
                  isValidOtp = true;
                });
              },
            ),
            _buildResendSection(),
            const Spacer(),
            BlocBuilder<OwnerAuthBloc, OwnerAuthState>(
              builder: (BuildContext context, OwnerAuthState state) {
                return AppButton(
                  label: 'Continue',
                  onPressed: () {
                    if (state.otpResponse == null) {
                      return;
                    }
                    final VerifyOwnerOtpParams requestParam =
                        VerifyOwnerOtpParams(
                          mobileNumber: state.otpResponse!.mobileNumber,
                          otp: _otpController.text.trim(),
                        );
                    context.read<OwnerAuthBloc>().add(
                      OwnerAuthEvent.verifyOwnerOtp(requestParam: requestParam),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
