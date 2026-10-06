import 'package:flutter/material.dart';

import 'app_state.dart';
import 'screens/content_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/messages_screen.dart';
import 'screens/reviews_screen.dart';
import 'screens/settings_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(AdminApp(state: AppState()..load()));
}

/// Gives every screen access to the shared [AppState].
class AppScope extends InheritedNotifier<AppState> {
  const AppScope({super.key, required AppState state, required super.child}) : super(notifier: state);

  static AppState of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<AppScope>();
    assert(scope != null, 'AppScope missing from the widget tree');
    return scope!.notifier!;
  }
}

class AdminApp extends StatelessWidget {
  const AdminApp({super.key, required this.state});

  final AppState state;

  @override
  Widget build(BuildContext context) {
    const seed = Color(0xFF6366F1);
    return AppScope(
      state: state,
      child: MaterialApp(
        title: 'Portfolio Admin',
        debugShowCheckedModeBanner: false,
        themeMode: ThemeMode.system,
        theme: ThemeData(colorSchemeSeed: seed, useMaterial3: true, brightness: Brightness.light),
        darkTheme: ThemeData(colorSchemeSeed: seed, useMaterial3: true, brightness: Brightness.dark),
        home: const HomeShell(),
      ),
    );
  }
}

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _index = 0;
  bool _routedToSettings = false;

  static const _destinations = [
    NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Home'),
    NavigationDestination(icon: Icon(Icons.edit_note_outlined), selectedIcon: Icon(Icons.edit_note), label: 'Content'),
    NavigationDestination(icon: Icon(Icons.star_outline), selectedIcon: Icon(Icons.star), label: 'Reviews'),
    NavigationDestination(icon: Icon(Icons.mail_outline), selectedIcon: Icon(Icons.mail), label: 'Messages'),
    NavigationDestination(icon: Icon(Icons.settings_outlined), selectedIcon: Icon(Icons.settings), label: 'Settings'),
  ];

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);
    if (!state.loaded) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    // First launch: send the user straight to Settings to enter the server address and key.
    if (!state.settings.isConfigured && !_routedToSettings) {
      _routedToSettings = true;
      _index = 4;
    }

    // Screens are keyed by the saved settings so they reload after the server or key changes.
    final settingsKey = ValueKey('${state.settings.baseUrl}|${state.settings.adminKey}');
    final screens = <Widget>[
      DashboardScreen(key: settingsKey, onOpenTab: (i) => setState(() => _index = i)),
      ContentScreen(key: settingsKey),
      ReviewsScreen(key: settingsKey),
      MessagesScreen(key: settingsKey),
      const SettingsScreen(),
    ];

    return Scaffold(
      body: SafeArea(child: IndexedStack(index: _index, children: screens)),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: _destinations,
      ),
    );
  }
}
