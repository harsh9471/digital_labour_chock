class AppConstants {
  AppConstants._();

  // App Info
  static const String appName = 'Digital Labour Chowk';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';

  // API
  static const String apiBaseUrl = 'http://localhost:3001/api/v1';
  static const String apiBaseUrlProd = 'https://api.digitallabourchowk.com/api/v1';
  static const int connectTimeout = 30000;
  static const int receiveTimeout = 30000;

  // Storage Keys
  static const String accessTokenKey = 'dlc_access_token';
  static const String refreshTokenKey = 'dlc_refresh_token';
  static const String userDataKey = 'dlc_user_data';
  static const String onboardingDoneKey = 'dlc_onboarding_done';
  static const String deviceIdKey = 'dlc_device_id';

  // Routes
  static const String routeSplash = '/';
  static const String routeOnboarding = '/onboarding';
  static const String routeLogin = '/login';
  static const String routeRegister = '/register';
  static const String routeOtp = '/verify-otp';
  static const String routeWorkerDashboard = '/worker';
  static const String routeContractorDashboard = '/contractor';
  static const String routeAdminDashboard = '/admin';

  // Roles
  static const String roleWorker = 'WORKER';
  static const String roleContractor = 'CONTRACTOR';
  static const String roleCompanyAdmin = 'COMPANY_ADMIN';
  static const String roleSuperAdmin = 'SUPER_ADMIN';

  // OTP
  static const int otpLength = 6;
  static const int otpResendSeconds = 60;

  // UI
  static const double borderRadius = 12.0;
  static const double cardRadius = 16.0;
  static const double buttonHeight = 52.0;
  static const double inputHeight = 52.0;
}
