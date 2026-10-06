import 'package:shared_preferences/shared_preferences.dart';

/// Server address and admin key, kept on the phone only.
class ServerSettings {
  const ServerSettings({this.baseUrl = '', this.adminKey = ''});

  final String baseUrl;
  final String adminKey;

  bool get isConfigured => baseUrl.isNotEmpty && adminKey.isNotEmpty;

  /// Normalises what the user typed: trims spaces, adds https:// and drops trailing slashes.
  static String normalizeUrl(String input) {
    var url = input.trim();
    if (url.isEmpty) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://$url';
    }
    while (url.endsWith('/')) {
      url = url.substring(0, url.length - 1);
    }
    return url;
  }
}

class SettingsStore {
  static const _urlKey = 'server_url';
  static const _keyKey = 'admin_key';

  Future<ServerSettings> load() async {
    final prefs = await SharedPreferences.getInstance();
    return ServerSettings(
      baseUrl: prefs.getString(_urlKey) ?? '',
      adminKey: prefs.getString(_keyKey) ?? '',
    );
  }

  Future<void> save(ServerSettings settings) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_urlKey, ServerSettings.normalizeUrl(settings.baseUrl));
    await prefs.setString(_keyKey, settings.adminKey.trim());
  }
}
