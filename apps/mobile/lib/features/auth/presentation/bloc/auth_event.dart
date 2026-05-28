import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AuthCheckSession extends AuthEvent {
  const AuthCheckSession();
}

class AuthLoginWithEmail extends AuthEvent {
  final String email;
  final String password;

  const AuthLoginWithEmail({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}

class AuthSendOtp extends AuthEvent {
  final String phone;
  final String purpose;

  const AuthSendOtp({required this.phone, this.purpose = 'LOGIN'});

  @override
  List<Object?> get props => [phone, purpose];
}

class AuthVerifyOtp extends AuthEvent {
  final String phone;
  final String code;
  final String purpose;

  const AuthVerifyOtp({
    required this.phone,
    required this.code,
    this.purpose = 'LOGIN',
  });

  @override
  List<Object?> get props => [phone, code, purpose];
}

class AuthLogout extends AuthEvent {
  const AuthLogout();
}

class AuthLogoutAll extends AuthEvent {
  const AuthLogoutAll();
}
