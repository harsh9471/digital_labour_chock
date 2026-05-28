import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../constants/app_constants.dart';
import '../storage/secure_storage.dart';

class ApiClient {
  static ApiClient? _instance;
  late final Dio _dio;
  final SecureStorage _storage;

  ApiClient._({required SecureStorage storage}) : _storage = storage {
    _dio = Dio(
      BaseOptions(
        baseUrl: kDebugMode ? AppConstants.apiBaseUrl : AppConstants.apiBaseUrlProd,
        connectTimeout: const Duration(milliseconds: AppConstants.connectTimeout),
        receiveTimeout: const Duration(milliseconds: AppConstants.receiveTimeout),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );
    _setupInterceptors();
  }

  factory ApiClient({required SecureStorage storage}) {
    _instance ??= ApiClient._(storage: storage);
    return _instance!;
  }

  void _setupInterceptors() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.getAccessToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          if (kDebugMode) {
            debugPrint('[API] ${options.method} ${options.path}');
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            final refreshed = await _refreshToken();
            if (refreshed) {
              final token = await _storage.getAccessToken();
              error.requestOptions.headers['Authorization'] = 'Bearer $token';
              final response = await _dio.fetch(error.requestOptions);
              return handler.resolve(response);
            }
          }
          handler.next(error);
        },
        onResponse: (response, handler) {
          if (kDebugMode) {
            debugPrint('[API] Response ${response.statusCode}: ${response.requestOptions.path}');
          }
          handler.next(response);
        },
      ),
    );
  }

  Future<bool> _refreshToken() async {
    try {
      final refreshToken = await _storage.getRefreshToken();
      if (refreshToken == null) return false;

      final response = await Dio().post(
        '${kDebugMode ? AppConstants.apiBaseUrl : AppConstants.apiBaseUrlProd}/auth/refresh',
        data: {'refreshToken': refreshToken},
      );

      if (response.statusCode == 200) {
        final tokens = response.data['data'];
        await _storage.saveTokens(
          accessToken: tokens['accessToken'] as String,
          refreshToken: tokens['refreshToken'] as String,
        );
        return true;
      }
    } catch (e) {
      await _storage.clearAll();
    }
    return false;
  }

  Dio get dio => _dio;
}
