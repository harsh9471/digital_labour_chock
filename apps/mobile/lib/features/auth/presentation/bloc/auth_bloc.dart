import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/repositories/auth_repository.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final IAuthRepository _authRepository;

  AuthBloc({required IAuthRepository authRepository})
      : _authRepository = authRepository,
        super(const AuthInitial()) {
    on<AuthCheckSession>(_onCheckSession);
    on<AuthLoginWithEmail>(_onLoginWithEmail);
    on<AuthSendOtp>(_onSendOtp);
    on<AuthVerifyOtp>(_onVerifyOtp);
    on<AuthLogout>(_onLogout);
  }

  Future<void> _onCheckSession(
    AuthCheckSession event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    try {
      final isAuth = await _authRepository.isAuthenticated();
      if (isAuth) {
        final user = await _authRepository.getStoredUser();
        if (user != null) {
          emit(AuthAuthenticated(user: user));
        } else {
          emit(const AuthUnauthenticated());
        }
      } else {
        emit(const AuthUnauthenticated());
      }
    } catch (_) {
      emit(const AuthUnauthenticated());
    }
  }

  Future<void> _onLoginWithEmail(
    AuthLoginWithEmail event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    try {
      final response = await _authRepository.loginWithEmail(
        email: event.email,
        password: event.password,
      );
      emit(AuthAuthenticated(user: response.user));
    } on AuthException catch (e) {
      emit(AuthError(message: e.message));
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }

  Future<void> _onSendOtp(
    AuthSendOtp event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    try {
      final response = await _authRepository.sendOtp(
        phone: event.phone,
        purpose: event.purpose,
      );
      emit(AuthOtpSent(
        phone: response.phone,
        expiresInMinutes: response.expiresInMinutes,
      ));
    } on AuthException catch (e) {
      emit(AuthError(message: e.message));
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }

  Future<void> _onVerifyOtp(
    AuthVerifyOtp event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    try {
      final response = await _authRepository.verifyOtp(
        phone: event.phone,
        code: event.code,
        purpose: event.purpose,
      );
      emit(AuthAuthenticated(user: response.user));
    } on AuthException catch (e) {
      emit(AuthError(message: e.message));
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }

  Future<void> _onLogout(
    AuthLogout event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    try {
      await _authRepository.logout();
      emit(const AuthUnauthenticated());
    } catch (_) {
      emit(const AuthUnauthenticated());
    }
  }
}
