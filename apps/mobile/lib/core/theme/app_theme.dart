import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  AppTheme._();

  // Brand Colors
  static const Color primary = Color(0xFF2563EB);
  static const Color primaryDark = Color(0xFF1D4ED8);
  static const Color primaryLight = Color(0xFF93C5FD);
  static const Color secondary = Color(0xFFF97316);
  static const Color success = Color(0xFF16A34A);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFDC2626);
  static const Color info = Color(0xFF0EA5E9);

  static const Color backgroundLight = Color(0xFFF8FAFC);
  static const Color surfaceLight = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color borderColor = Color(0xFFE2E8F0);
  static const Color dividerColor = Color(0xFFF1F5F9);

  static const LinearGradient brandGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF2563EB), Color(0xFF4F46E5)],
  );

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primary,
        brightness: Brightness.light,
        primary: primary,
        secondary: secondary,
        error: error,
        surface: surfaceLight,
      ),
      scaffoldBackgroundColor: backgroundLight,
      textTheme: GoogleFonts.poppinsTextTheme().copyWith(
        displayLarge: GoogleFonts.poppins(
          fontSize: 32, fontWeight: FontWeight.w700, color: textPrimary,
        ),
        displayMedium: GoogleFonts.poppins(
          fontSize: 28, fontWeight: FontWeight.w700, color: textPrimary,
        ),
        headlineLarge: GoogleFonts.poppins(
          fontSize: 24, fontWeight: FontWeight.w700, color: textPrimary,
        ),
        headlineMedium: GoogleFonts.poppins(
          fontSize: 20, fontWeight: FontWeight.w600, color: textPrimary,
        ),
        titleLarge: GoogleFonts.poppins(
          fontSize: 18, fontWeight: FontWeight.w600, color: textPrimary,
        ),
        titleMedium: GoogleFonts.poppins(
          fontSize: 16, fontWeight: FontWeight.w500, color: textPrimary,
        ),
        titleSmall: GoogleFonts.poppins(
          fontSize: 14, fontWeight: FontWeight.w500, color: textPrimary,
        ),
        bodyLarge: GoogleFonts.poppins(
          fontSize: 16, fontWeight: FontWeight.w400, color: textPrimary,
        ),
        bodyMedium: GoogleFonts.poppins(
          fontSize: 14, fontWeight: FontWeight.w400, color: textSecondary,
        ),
        bodySmall: GoogleFonts.poppins(
          fontSize: 12, fontWeight: FontWeight.w400, color: textMuted,
        ),
        labelLarge: GoogleFonts.poppins(
          fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white,
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: surfaceLight,
        elevation: 0,
        scrolledUnderElevation: 1,
        shadowColor: Colors.black12,
        iconTheme: const IconThemeData(color: textPrimary),
        titleTextStyle: GoogleFonts.poppins(
          fontSize: 18, fontWeight: FontWeight.w600, color: textPrimary,
        ),
        systemOverlayStyle: SystemUiOverlayStyle.dark,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600),
          elevation: 0,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primary,
          minimumSize: const Size(double.infinity, 52),
          side: const BorderSide(color: primary, width: 2),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primary,
          textStyle: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceLight,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: error),
        ),
        hintStyle: GoogleFonts.poppins(color: textMuted, fontSize: 14),
        labelStyle: GoogleFonts.poppins(color: textSecondary, fontSize: 14),
        errorStyle: GoogleFonts.poppins(color: error, fontSize: 12),
      ),
      cardTheme: CardTheme(
        color: surfaceLight,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: borderColor),
        ),
        margin: EdgeInsets.zero,
      ),
      dividerTheme: const DividerThemeData(color: dividerColor, thickness: 1),
      chipTheme: ChipThemeData(
        backgroundColor: const Color(0xFFEFF6FF),
        labelStyle: GoogleFonts.poppins(color: primary, fontSize: 12, fontWeight: FontWeight.w500),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        side: const BorderSide(color: Color(0xFFBFDBFE)),
      ),
    );
  }
}
