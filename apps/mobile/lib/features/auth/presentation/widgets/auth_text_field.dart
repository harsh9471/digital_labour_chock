import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class AuthTextField extends StatefulWidget {
  final TextEditingController controller;
  final String label;
  final String? hint;
  final Widget? prefixIcon;
  final bool isPassword;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;
  final TextInputAction textInputAction;
  final bool enabled;
  final int maxLines;

  const AuthTextField({
    super.key,
    required this.controller,
    required this.label,
    this.hint,
    this.prefixIcon,
    this.isPassword = false,
    this.keyboardType = TextInputType.text,
    this.validator,
    this.onChanged,
    this.textInputAction = TextInputAction.next,
    this.enabled = true,
    this.maxLines = 1,
  });

  @override
  State<AuthTextField> createState() => _AuthTextFieldState();
}

class _AuthTextFieldState extends State<AuthTextField> {
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.label,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: AppTheme.textSecondary,
          ),
        ),
        const SizedBox(height: 6),
        TextFormField(
          controller: widget.controller,
          obscureText: widget.isPassword && _obscureText,
          keyboardType: widget.keyboardType,
          validator: widget.validator,
          onChanged: widget.onChanged,
          textInputAction: widget.textInputAction,
          enabled: widget.enabled,
          maxLines: widget.isPassword ? 1 : widget.maxLines,
          style: const TextStyle(
            fontSize: 15,
            color: AppTheme.textPrimary,
            fontWeight: FontWeight.w400,
          ),
          decoration: InputDecoration(
            hintText: widget.hint,
            hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 14),
            prefixIcon: widget.prefixIcon != null
                ? Padding(
                    padding: const EdgeInsets.all(14),
                    child: IconTheme(
                      data: const IconThemeData(color: AppTheme.textMuted, size: 20),
                      child: widget.prefixIcon!,
                    ),
                  )
                : null,
            suffixIcon: widget.isPassword
                ? IconButton(
                    onPressed: () => setState(() => _obscureText = !_obscureText),
                    icon: Icon(
                      _obscureText ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                      color: AppTheme.textMuted,
                      size: 20,
                    ),
                  )
                : null,
            filled: true,
            fillColor: AppTheme.surfaceLight,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppTheme.borderColor),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppTheme.borderColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppTheme.primary, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppTheme.error),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppTheme.error, width: 2),
            ),
            errorStyle: const TextStyle(fontSize: 11, color: AppTheme.error),
          ),
        ),
      ],
    );
  }
}
