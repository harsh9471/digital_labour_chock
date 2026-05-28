import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/app_constants.dart';

class SecureStorage {
  static const FlutterSecureStorage _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock,
    ),
  );

  Future<String?> getAccessToken() async {
    return _storage.read(key: AppConstants.accessTokenKey);
  }

  Future<String?> getRefreshToken() async {
    return _storage.read(key: AppConstants.refreshTokenKey);
  }

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await Future.wait([
      _storage.write(key: AppConstants.accessTokenKey, value: accessToken),
      _storage.write(key: AppConstants.refreshTokenKey, value: refreshToken),
    ]);
  }

  Future<String?> getUserData() async {
    return _storage.read(key: AppConstants.userDataKey);
  }

  Future<void> saveUserData(String userData) async {
    await _storage.write(key: AppConstants.userDataKey, value: userData);
  }

  Future<void> clearTokens() async {
    await Future.wait([
      _storage.delete(key: AppConstants.accessTokenKey),
      _storage.delete(key: AppConstants.refreshTokenKey),
    ]);
  }

  Future<void> clearAll() async {
    await _storage.deleteAll();
  }

  Future<bool> hasValidSession() async {
    final token = await getAccessToken();
    return token != null && token.isNotEmpty;
  }
}
