import 'package:equatable/equatable.dart';
import '../../data/models/auth_model.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {
  const AuthInitial();
}

class AuthLoading extends AuthState {
  const AuthLoading();
}

class AuthAuthenticated extends AuthState {
  final AuthUser user;
  const AuthAuthenticated({required this.user});

  @override
  List<Object?> get props => [user];
}

class AuthUnauthenticated extends AuthState {
  const AuthUnauthenticated();
}

class AuthOtpSent extends AuthState {
  final String phone;
  final int expiresInMinutes;

  const AuthOtpSent({required this.phone, required this.expiresInMinutes});

  @override
  List<Object?> get props => [phone, expiresInMinutes];
}

class AuthOtpVerified extends AuthState {
  final AuthUser user;
  const AuthOtpVerified({required this.user});

  @override
  List<Object?> get props => [user];
}

class AuthError extends AuthState {
  final String message;
  final String? code;

  const AuthError({required this.message, this.code});

  @override
  List<Object?> get props => [message, code];
}

class AuthLoggedOut extends AuthState {
  const AuthLoggedOut();
}
