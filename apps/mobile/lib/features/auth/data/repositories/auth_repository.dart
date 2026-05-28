import 'package:dio/dio.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/storage/secure_storage.dart';
import '../models/auth_model.dart';

abstract class IAuthRepository {
  Future<LoginResponse> loginWithEmail({required String email, required String password});
  Future<OtpSentResponse> sendOtp({required String phone, required String purpose});
  Future<LoginResponse> verifyOtp({required String phone, required String code, required String purpose});
  Future<AuthTokens> refreshTokens({required String refreshToken});
  Future<void> logout();
  Future<AuthUser?> getStoredUser();
  Future<bool> isAuthenticated();
}

class AuthRepository implements IAuthRepository {
  final ApiClient _apiClient;
  final SecureStorage _storage;

  const AuthRepository({
    required ApiClient apiClient,
    required SecureStorage storage,
  }) : _apiClient = apiClient,
       _storage = storage;

  @override
  Future<LoginResponse> loginWithEmail({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiClient.dio.post(
        '/auth/login/email',
        data: {'email': email, 'password': password},
      );
      final data = response.data['data'] as Map<String, dynamic>;
      final loginResponse = LoginResponse.fromJson(data);
      await _saveAuthData(loginResponse);
      return loginResponse;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  @override
  Future<OtpSentResponse> sendOtp({
    required String phone,
    required String purpose,
  }) async {
    try {
      final response = await _apiClient.dio.post(
        '/auth/otp/send',
        data: {'phone': phone, 'purpose': purpose},
      );
      return OtpSentResponse.fromJson(response.data['data'] as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  @override
  Future<LoginResponse> verifyOtp({
    required String phone,
    required String code,
    required String purpose,
  }) async {
    try {
      final response = await _apiClient.dio.post(
        '/auth/otp/verify',
        data: {'phone': phone, 'code': code, 'purpose': purpose},
      );
      final data = response.data['data'] as Map<String, dynamic>;
      final loginResponse = LoginResponse.fromJson(data);
      await _saveAuthData(loginResponse);
      return loginResponse;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  @override
  Future<AuthTokens> refreshTokens({required String refreshToken}) async {
    try {
      final response = await _apiClient.dio.post(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
      );
      final tokens = AuthTokens.fromJson(response.data['data'] as Map<String, dynamic>);
      await _storage.saveTokens(
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      );
      return tokens;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  @override
  Future<void> logout() async {
    try {
      await _apiClient.dio.post('/auth/logout');
    } catch (_) {
      // Ignore logout errors
    } finally {
      await _storage.clearAll();
    }
  }

  @override
  Future<AuthUser?> getStoredUser() async {
    final userData = await _storage.getUserData();
    if (userData == null) return null;
    try {
      return AuthUser.fromJsonString(userData);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<bool> isAuthenticated() async {
    return _storage.hasValidSession();
  }

  Future<void> _saveAuthData(LoginResponse loginResponse) async {
    await Future.wait([
      _storage.saveTokens(
        accessToken: loginResponse.tokens.accessToken,
        refreshToken: loginResponse.tokens.refreshToken,
      ),
      _storage.saveUserData(loginResponse.user.toJsonString()),
    ]);
  }

  Exception _handleDioError(DioException error) {
    final message = error.response?.data?['message'] as String?;
    if (error.response?.statusCode == 401) {
      return AuthException(message ?? 'Invalid credentials');
    } else if (error.response?.statusCode == 404) {
      return AuthException(message ?? 'Account not found');
    } else if (error.response?.statusCode == 400) {
      return AuthException(message ?? 'Invalid request');
    } else if (error.response?.statusCode == 429) {
      return AuthException('Too many requests. Please try again later.');
    } else if (error.type == DioExceptionType.connectionTimeout) {
      return AuthException('Connection timeout. Check your internet connection.');
    } else {
      return AuthException(message ?? 'An unexpected error occurred');
    }
  }
}

class AuthException implements Exception {
  final String message;
  const AuthException(this.message);

  @override
  String toString() => message;
}
