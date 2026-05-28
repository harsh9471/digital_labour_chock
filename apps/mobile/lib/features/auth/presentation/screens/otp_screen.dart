import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/constants/app_constants.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';
import '../widgets/auth_button.dart';

class OtpScreen extends StatefulWidget {
  final String? initialPhone;
  final String purpose;

  const OtpScreen({
    super.key,
    this.initialPhone,
    this.purpose = 'LOGIN',
  });

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final _phoneController = TextEditingController();
  final List<TextEditingController> _otpControllers =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (_) => FocusNode());

  bool _otpSent = false;
  String _phone = '';
  int _countdown = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    if (widget.initialPhone != null) {
      _phoneController.text = widget.initialPhone!.replaceAll('+91', '');
    }
  }

  @override
  void dispose() {
    _phoneController.dispose();
    for (final c in _otpControllers) c.dispose();
    for (final f in _focusNodes) f.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startCountdown() {
    setState(() => _countdown = AppConstants.otpResendSeconds);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_countdown > 0) {
        setState(() => _countdown--);
      } else {
        timer.cancel();
      }
    });
  }

  void _sendOtp() {
    final phone = '+91${_phoneController.text.trim()}';
    if (_phoneController.text.length != 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid 10-digit phone number')),
      );
      return;
    }
    _phone = phone;
    context.read<AuthBloc>().add(AuthSendOtp(phone: phone, purpose: widget.purpose));
  }

  void _verifyOtp() {
    final code = _otpControllers.map((c) => c.text).join();
    if (code.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter the complete 6-digit OTP')),
      );
      return;
    }
    context.read<AuthBloc>().add(
      AuthVerifyOtp(phone: _phone, code: code, purpose: widget.purpose),
    );
  }

  void _onOtpDigitChanged(int index, String value) {
    if (value.length == 1 && index < 5) {
      _focusNodes[index + 1].requestFocus();
    } else if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }

    final code = _otpControllers.map((c) => c.text).join();
    if (code.length == 6) {
      _verifyOtp();
    }
  }

  void _navigateByRole(AuthUser user) {
    String route;
    switch (user.role) {
      case AppConstants.roleWorker:
        route = AppConstants.routeWorkerDashboard;
        break;
      case AppConstants.roleContractor:
        route = AppConstants.routeContractorDashboard;
        break;
      default:
        route = AppConstants.routeWorkerDashboard;
    }
    Navigator.of(context).pushReplacementNamed(route);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        title: const Text('OTP Verification'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthOtpSent) {
            setState(() => _otpSent = true);
            _startCountdown();
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('OTP sent to $_phone'),
                backgroundColor: AppTheme.success,
                behavior: SnackBarBehavior.floating,
              ),
            );
          } else if (state is AuthAuthenticated) {
            _navigateByRole(state.user);
          } else if (state is AuthError) {
            // Clear OTP on error
            for (final c in _otpControllers) c.clear();
            _focusNodes[0].requestFocus();
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: AppTheme.error,
                behavior: SnackBarBehavior.floating,
              ),
            );
          }
        },
        child: BlocBuilder<AuthBloc, AuthState>(
          builder: (context, state) {
            final isLoading = state is AuthLoading;

            return SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 20),

                    Center(
                      child: Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.phone_android_rounded,
                          size: 40,
                          color: AppTheme.primary,
                        ),
                      ),
                    ),

                    const SizedBox(height: 28),

                    const Center(
                      child: Text(
                        'Phone Verification',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                    ),

                    const SizedBox(height: 8),

                    Center(
                      child: Text(
                        _otpSent
                            ? 'Enter the OTP sent to ${_phone.replaceRange(3, 9, '******')}'
                            : 'Enter your mobile number to receive OTP',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                    ),

                    const SizedBox(height: 36),

                    if (!_otpSent) ...[
                      // Phone Input
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceLight,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppTheme.borderColor),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Mobile Number',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                color: AppTheme.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                                  decoration: BoxDecoration(
                                    border: Border.all(color: AppTheme.borderColor),
                                    borderRadius: BorderRadius.circular(10),
                                    color: AppTheme.backgroundLight,
                                  ),
                                  child: const Row(
                                    children: [
                                      Text('🇮🇳', style: TextStyle(fontSize: 18)),
                                      SizedBox(width: 6),
                                      Text('+91', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: TextFormField(
                                    controller: _phoneController,
                                    keyboardType: TextInputType.phone,
                                    maxLength: 10,
                                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                                    decoration: InputDecoration(
                                      counterText: '',
                                      hintText: '9876543210',
                                      hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 16),
                                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppTheme.borderColor)),
                                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppTheme.borderColor)),
                                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppTheme.primary, width: 2)),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 20),
                            AuthButton(
                              label: 'Get OTP',
                              onPressed: _sendOtp,
                              isLoading: isLoading,
                            ),
                          ],
                        ),
                      ),
                    ] else ...[
                      // OTP Input
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceLight,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppTheme.borderColor),
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: List.generate(6, (index) {
                                return SizedBox(
                                  width: 46,
                                  height: 56,
                                  child: TextFormField(
                                    controller: _otpControllers[index],
                                    focusNode: _focusNodes[index],
                                    keyboardType: TextInputType.number,
                                    textAlign: TextAlign.center,
                                    maxLength: 1,
                                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                                    onChanged: (v) => _onOtpDigitChanged(index, v),
                                    style: const TextStyle(
                                      fontSize: 22,
                                      fontWeight: FontWeight.w700,
                                      color: AppTheme.primary,
                                    ),
                                    decoration: InputDecoration(
                                      counterText: '',
                                      contentPadding: EdgeInsets.zero,
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: const BorderSide(color: AppTheme.borderColor, width: 1.5),
                                      ),
                                      enabledBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: const BorderSide(color: AppTheme.borderColor, width: 1.5),
                                      ),
                                      focusedBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        borderSide: const BorderSide(color: AppTheme.primary, width: 2.5),
                                      ),
                                      filled: true,
                                      fillColor: _otpControllers[index].text.isNotEmpty
                                          ? AppTheme.primary.withOpacity(0.08)
                                          : AppTheme.surfaceLight,
                                    ),
                                  ),
                                );
                              }),
                            ),

                            const SizedBox(height: 24),

                            AuthButton(
                              label: 'Verify OTP',
                              onPressed: _verifyOtp,
                              isLoading: isLoading,
                            ),

                            const SizedBox(height: 16),

                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Text(
                                  'Didn\'t receive OTP? ',
                                  style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
                                ),
                                _countdown > 0
                                    ? Text(
                                        'Resend in ${_countdown}s',
                                        style: const TextStyle(
                                          color: AppTheme.textMuted,
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      )
                                    : GestureDetector(
                                        onTap: isLoading ? null : _sendOtp,
                                        child: const Text(
                                          'Resend OTP',
                                          style: TextStyle(
                                            color: AppTheme.primary,
                                            fontSize: 13,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                              ],
                            ),

                            const SizedBox(height: 12),

                            TextButton(
                              onPressed: () => setState(() {
                                _otpSent = false;
                                for (final c in _otpControllers) c.clear();
                              }),
                              child: const Text(
                                'Change Phone Number',
                                style: TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
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
