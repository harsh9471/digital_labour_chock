import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/constants/app_constants.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';
import '../widgets/auth_button.dart';
import '../widgets/auth_text_field.dart';
import 'otp_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _useOtp = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    if (_formKey.currentState?.validate() ?? false) {
      context.read<AuthBloc>().add(
        AuthLoginWithEmail(
          email: _emailController.text.trim(),
          password: _passwordController.text,
        ),
      );
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
      case AppConstants.roleSuperAdmin:
        route = AppConstants.routeAdminDashboard;
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
      body: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthAuthenticated) {
            _navigateByRole(state.user);
          } else if (state is AuthError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: AppTheme.error,
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
            );
          }
        },
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 40),

                // Logo & Brand
                Center(
                  child: Column(
                    children: [
                      Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          gradient: AppTheme.brandGradient,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.primary.withOpacity(0.3),
                              blurRadius: 20,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Text(
                            'DL',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w800,
                              fontSize: 24,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Digital Labour Chowk',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'India\'s #1 Labour Marketplace',
                        style: TextStyle(
                          fontSize: 13,
                          color: AppTheme.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 48),

                // Card
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceLight,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.borderColor),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 24,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Welcome back',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Sign in to continue',
                        style: TextStyle(fontSize: 13, color: AppTheme.textMuted),
                      ),
                      const SizedBox(height: 24),

                      // Toggle
                      Container(
                        decoration: BoxDecoration(
                          color: AppTheme.backgroundLight,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.all(4),
                        child: Row(
                          children: [
                            Expanded(
                              child: GestureDetector(
                                onTap: () => setState(() => _useOtp = false),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  padding: const EdgeInsets.symmetric(vertical: 10),
                                  decoration: BoxDecoration(
                                    color: !_useOtp ? AppTheme.surfaceLight : Colors.transparent,
                                    borderRadius: BorderRadius.circular(10),
                                    boxShadow: !_useOtp
                                        ? [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8)]
                                        : null,
                                  ),
                                  child: Text(
                                    'Email Login',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: !_useOtp ? AppTheme.primary : AppTheme.textMuted,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            Expanded(
                              child: GestureDetector(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (_) => const OtpScreen()),
                                  );
                                },
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  padding: const EdgeInsets.symmetric(vertical: 10),
                                  decoration: BoxDecoration(
                                    color: _useOtp ? AppTheme.surfaceLight : Colors.transparent,
                                    borderRadius: BorderRadius.circular(10),
                                    boxShadow: _useOtp
                                        ? [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8)]
                                        : null,
                                  ),
                                  child: const Text(
                                    'OTP Login',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: AppTheme.textMuted,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 24),

                      Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            AuthTextField(
                              controller: _emailController,
                              label: 'Email Address',
                              hint: 'you@example.com',
                              keyboardType: TextInputType.emailAddress,
                              prefixIcon: const Icon(Icons.email_outlined),
                              validator: (value) {
                                if (value == null || value.isEmpty) return 'Email is required';
                                if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) return 'Invalid email';
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),
                            AuthTextField(
                              controller: _passwordController,
                              label: 'Password',
                              hint: '••••••••',
                              isPassword: true,
                              prefixIcon: const Icon(Icons.lock_outline),
                              textInputAction: TextInputAction.done,
                              validator: (value) {
                                if (value == null || value.isEmpty) return 'Password is required';
                                if (value.length < 6) return 'Min 6 characters';
                                return null;
                              },
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 8),

                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton(
                          onPressed: () {},
                          child: const Text('Forgot Password?', style: TextStyle(fontSize: 13)),
                        ),
                      ),

                      const SizedBox(height: 8),

                      BlocBuilder<AuthBloc, AuthState>(
                        builder: (context, state) => AuthButton(
                          label: 'Sign In',
                          onPressed: _handleLogin,
                          isLoading: state is AuthLoading,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      "Don't have an account? ",
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 14),
                    ),
                    GestureDetector(
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const RegisterScreen()),
                      ),
                      child: const Text(
                        'Register',
                        style: TextStyle(
                          color: AppTheme.primary,
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
