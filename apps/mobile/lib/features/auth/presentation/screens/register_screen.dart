import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../core/theme/app_theme.dart';
import '../widgets/auth_button.dart';
import '../widgets/auth_text_field.dart';
import 'otp_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  String _selectedRole = 'WORKER';
  bool _isLoading = false;

  final List<Map<String, dynamic>> _roles = [
    {
      'value': 'WORKER',
      'label': 'Worker',
      'description': 'Find daily wage work',
      'icon': Icons.construction,
      'color': const Color(0xFF2563EB),
    },
    {
      'value': 'CONTRACTOR',
      'label': 'Contractor',
      'description': 'Hire workers for projects',
      'icon': Icons.engineering,
      'color': const Color(0xFFF97316),
    },
    {
      'value': 'COMPANY_ADMIN',
      'label': 'Company',
      'description': 'Manage workforce at scale',
      'icon': Icons.business,
      'color': const Color(0xFF16A34A),
    },
  ];

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleRegister() {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    setState(() => _isLoading = true);

    // Navigate to OTP for phone verification
    Future.delayed(const Duration(milliseconds: 300), () {
      if (!mounted) return;
      setState(() => _isLoading = false);
      final phone = '+91${_phoneController.text.trim()}';
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => OtpScreen(initialPhone: phone, purpose: 'REGISTER'),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        title: const Text('Create Account'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Role Selection
              const Text(
                'I am a',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: _roles.map((role) {
                  final isSelected = _selectedRole == role['value'];
                  final color = role['color'] as Color;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedRole = role['value'] as String),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isSelected ? color.withOpacity(0.08) : AppTheme.surfaceLight,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isSelected ? color : AppTheme.borderColor,
                            width: isSelected ? 2 : 1,
                          ),
                        ),
                        child: Column(
                          children: [
                            Icon(
                              role['icon'] as IconData,
                              color: isSelected ? color : AppTheme.textMuted,
                              size: 28,
                            ),
                            const SizedBox(height: 6),
                            Text(
                              role['label'] as String,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: isSelected ? color : AppTheme.textSecondary,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: 28),

              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceLight,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderColor),
                ),
                child: Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: AuthTextField(
                              controller: _firstNameController,
                              label: 'First Name',
                              hint: 'Rajesh',
                              prefixIcon: const Icon(Icons.person_outline),
                              validator: (v) => (v?.isEmpty ?? true) ? 'Required' : null,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: AuthTextField(
                              controller: _lastNameController,
                              label: 'Last Name',
                              hint: 'Kumar',
                              validator: (v) => (v?.isEmpty ?? true) ? 'Required' : null,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Phone
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Mobile Number',
                            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppTheme.textSecondary),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 14),
                                decoration: BoxDecoration(
                                  border: Border.all(color: AppTheme.borderColor),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Row(
                                  children: [
                                    Text('🇮🇳', style: TextStyle(fontSize: 16)),
                                    SizedBox(width: 4),
                                    Text('+91', style: TextStyle(fontWeight: FontWeight.w600)),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: TextFormField(
                                  controller: _phoneController,
                                  keyboardType: TextInputType.phone,
                                  maxLength: 10,
                                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                                  decoration: InputDecoration(
                                    counterText: '',
                                    hintText: '9876543210',
                                    hintStyle: const TextStyle(color: AppTheme.textMuted),
                                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppTheme.borderColor)),
                                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppTheme.borderColor)),
                                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppTheme.primary, width: 2)),
                                  ),
                                  validator: (v) {
                                    if (v == null || v.length != 10) return 'Valid 10-digit number required';
                                    return null;
                                  },
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      AuthTextField(
                        controller: _emailController,
                        label: 'Email (optional)',
                        hint: 'you@example.com',
                        keyboardType: TextInputType.emailAddress,
                        prefixIcon: const Icon(Icons.email_outlined),
                      ),
                      const SizedBox(height: 16),
                      AuthTextField(
                        controller: _passwordController,
                        label: 'Password',
                        hint: 'Min 8 characters',
                        isPassword: true,
                        prefixIcon: const Icon(Icons.lock_outline),
                        textInputAction: TextInputAction.done,
                        validator: (v) {
                          if (v == null || v.length < 8) return 'Min 8 characters required';
                          return null;
                        },
                      ),
                      const SizedBox(height: 24),
                      AuthButton(
                        label: 'Create Account',
                        onPressed: _handleRegister,
                        isLoading: _isLoading,
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Already have an account? ',
                    style: TextStyle(color: AppTheme.textMuted, fontSize: 14),
                  ),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Text(
                      'Sign In',
                      style: TextStyle(
                        color: AppTheme.primary,
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }
}
