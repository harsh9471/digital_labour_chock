import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'core/constants/app_constants.dart';
import 'core/network/api_client.dart';
import 'core/storage/secure_storage.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/data/repositories/auth_repository.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/auth/presentation/bloc/auth_event.dart';
import 'features/auth/presentation/bloc/auth_state.dart';
import 'features/auth/presentation/screens/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  final storage = SecureStorage();
  final apiClient = ApiClient(storage: storage);
  final authRepository = AuthRepository(apiClient: apiClient, storage: storage);

  runApp(
    MultiRepositoryProvider(
      providers: [
        RepositoryProvider<SecureStorage>(create: (_) => storage),
        RepositoryProvider<ApiClient>(create: (_) => apiClient),
        RepositoryProvider<IAuthRepository>(create: (_) => authRepository),
      ],
      child: MultiBlocProvider(
        providers: [
          BlocProvider<AuthBloc>(
            create: (context) => AuthBloc(
              authRepository: context.read<IAuthRepository>(),
            )..add(const AuthCheckSession()),
          ),
        ],
        child: const DigitalLabourChowkApp(),
      ),
    ),
  );
}

class DigitalLabourChowkApp extends StatelessWidget {
  const DigitalLabourChowkApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, state) {
          if (state is AuthLoading || state is AuthInitial) {
            return const SplashScreen();
          } else if (state is AuthAuthenticated) {
            // Route to role-specific dashboard
            switch (state.user.role) {
              case AppConstants.roleWorker:
                return const WorkerDashboardPlaceholder();
              case AppConstants.roleContractor:
                return const ContractorDashboardPlaceholder();
              default:
                return const LoginScreen();
            }
          }
          return const LoginScreen();
        },
      ),
      routes: {
        AppConstants.routeLogin: (_) => const LoginScreen(),
        AppConstants.routeWorkerDashboard: (_) => const WorkerDashboardPlaceholder(),
        AppConstants.routeContractorDashboard: (_) => const ContractorDashboardPlaceholder(),
      },
    );
  }
}

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppTheme.brandGradient),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 88,
                height: 88,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: const Center(
                  child: Text(
                    'DL',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w800,
                      fontSize: 32,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Digital Labour Chowk',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                "India's #1 Labour Marketplace",
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 48),
              const CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                strokeWidth: 2,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class WorkerDashboardPlaceholder extends StatelessWidget {
  const WorkerDashboardPlaceholder({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.read<AuthBloc>().state;
    final userName = user is AuthAuthenticated ? user.user.firstName : 'Worker';

    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        title: const Text('Worker Dashboard'),
        actions: [
          TextButton(
            onPressed: () => context.read<AuthBloc>().add(const AuthLogout()),
            child: const Text('Logout'),
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.construction, size: 40, color: AppTheme.primary),
            ),
            const SizedBox(height: 20),
            Text(
              'Welcome, $userName! 👋',
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 8),
            const Text(
              'Worker Dashboard Coming Soon',
              style: TextStyle(color: AppTheme.textMuted),
            ),
          ],
        ),
      ),
    );
  }
}

class ContractorDashboardPlaceholder extends StatelessWidget {
  const ContractorDashboardPlaceholder({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        title: const Text('Contractor Dashboard'),
        actions: [
          TextButton(
            onPressed: () => context.read<AuthBloc>().add(const AuthLogout()),
            child: const Text('Logout'),
          ),
        ],
      ),
      body: const Center(
        child: Text('Contractor Dashboard - Coming Soon'),
      ),
    );
  }
}
