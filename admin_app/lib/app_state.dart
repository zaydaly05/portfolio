import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import 'api.dart';
import 'settings_store.dart';

/// Holds the saved server settings and hands out a ready-to-use [AdminApi].
class AppState extends ChangeNotifier {
  AppState({SettingsStore? store, this.clientFactory}) : _store = store ?? SettingsStore();

  final SettingsStore _store;
  final http.Client Function()? clientFactory;

  ServerSettings settings = const ServerSettings();
  bool loaded = false;

  AdminApi? get api {
    if (!settings.isConfigured) return null;
    return AdminApi(
      baseUrl: settings.baseUrl,
      adminKey: settings.adminKey,
      client: clientFactory?.call(),
    );
  }

  Future<void> load() async {
    try {
      settings = await _store.load().timeout(const Duration(seconds: 5));
    } catch (_) {
      // Unreadable storage must never leave the app stuck on the loading screen;
      // fall back to empty settings so the user can enter them again.
      settings = const ServerSettings();
    }
    loaded = true;
    notifyListeners();
  }

  Future<void> update(ServerSettings next) async {
    settings = ServerSettings(
      baseUrl: ServerSettings.normalizeUrl(next.baseUrl),
      adminKey: next.adminKey.trim(),
    );
    await _store.save(settings);
    notifyListeners();
  }
}
