import 'dart:convert';

class AuthUser {
  final String id;
  final String firstName;
  final String lastName;
  final String? email;
  final String? phone;
  final String role;
  final String status;
  final String? avatar;
  final bool emailVerified;
  final bool phoneVerified;

  const AuthUser({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.email,
    this.phone,
    required this.role,
    required this.status,
    this.avatar,
    required this.emailVerified,
    required this.phoneVerified,
  });

  String get fullName => '$firstName $lastName';
  String get initials => '${firstName[0]}${lastName.isNotEmpty ? lastName[0] : ''}'.toUpperCase();
  bool get isWorker => role == 'WORKER';
  bool get isContractor => role == 'CONTRACTOR';
  bool get isAdmin => role == 'SUPER_ADMIN';
  bool get isActive => status == 'ACTIVE';

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: json['id'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      role: json['role'] as String,
      status: json['status'] as String,
      avatar: json['avatar'] as String?,
      emailVerified: json['emailVerified'] as bool? ?? false,
      phoneVerified: json['phoneVerified'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'firstName': firstName,
    'lastName': lastName,
    'email': email,
    'phone': phone,
    'role': role,
    'status': status,
    'avatar': avatar,
    'emailVerified': emailVerified,
    'phoneVerified': phoneVerified,
  };

  String toJsonString() => jsonEncode(toJson());

  factory AuthUser.fromJsonString(String jsonStr) => AuthUser.fromJson(jsonDecode(jsonStr) as Map<String, dynamic>);

  AuthUser copyWith({
    String? id,
    String? firstName,
    String? lastName,
    String? email,
    String? phone,
    String? role,
    String? status,
    String? avatar,
    bool? emailVerified,
    bool? phoneVerified,
  }) {
    return AuthUser(
      id: id ?? this.id,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      status: status ?? this.status,
      avatar: avatar ?? this.avatar,
      emailVerified: emailVerified ?? this.emailVerified,
      phoneVerified: phoneVerified ?? this.phoneVerified,
    );
  }
}

class AuthTokens {
  final String accessToken;
  final String refreshToken;
  final int expiresIn;
  final String tokenType;

  const AuthTokens({
    required this.accessToken,
    required this.refreshToken,
    required this.expiresIn,
    this.tokenType = 'Bearer',
  });

  factory AuthTokens.fromJson(Map<String, dynamic> json) {
    return AuthTokens(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
      expiresIn: json['expiresIn'] as int,
      tokenType: json['tokenType'] as String? ?? 'Bearer',
    );
  }
}

class LoginResponse {
  final AuthUser user;
  final AuthTokens tokens;

  const LoginResponse({required this.user, required this.tokens});

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      user: AuthUser.fromJson(json['user'] as Map<String, dynamic>),
      tokens: AuthTokens.fromJson(json['tokens'] as Map<String, dynamic>),
    );
  }
}

class OtpSentResponse {
  final String message;
  final int expiresInMinutes;
  final String phone;

  const OtpSentResponse({
    required this.message,
    required this.expiresInMinutes,
    required this.phone,
  });

  factory OtpSentResponse.fromJson(Map<String, dynamic> json) {
    return OtpSentResponse(
      message: json['message'] as String,
      expiresInMinutes: json['expiresInMinutes'] as int,
      phone: json['phone'] as String,
    );
  }
}
