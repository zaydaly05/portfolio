import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:portfolio_admin/app_state.dart';
import 'package:portfolio_admin/main.dart';
import 'package:portfolio_admin/settings_store.dart';
import 'package:shared_preferences/shared_preferences.dart';

http.Response reply(Object body) => http.Response(jsonEncode(body), 200, headers: {'content-type': 'application/json'});

MockClient fakeServer() => MockClient((req) async {
      switch (req.url.path) {
        case '/api/admin/ping':
          return reply({'ok': true});
        case '/api/admin/cv':
          return reply({'ok': true, 'status': 'done', 'version': 4, 'runnerConfigured': true, 'url': '/api/document/resume?v=4'});
        case '/api/admin/summary':
          return reply({'ok': true, 'dbConnected': true, 'overridden': <String>[], 'reviews': 2, 'messages': 5, 'stars': 61});
        case '/api/admin/portfolio':
          return reply({
            'ok': true,
            'overridden': ['projects'],
            'sections': {
              'projects': [
                {'name': 'Gulf Limousine Booking App', 'period': 'July 2026', 'stack': 'Flutter'}
              ],
              'profile': {'name': 'Zayd', 'title': 'Dev'},
              'education': [],
            },
          });
        default:
          return http.Response('{}', 404);
      }
    });

void main() {
  testWidgets('first launch opens Settings and asks for the server and key', (tester) async {
    SharedPreferences.setMockInitialValues({});
    final state = AppState()..load();
    await tester.pumpWidget(AdminApp(state: state));
    await tester.pumpAndSettle();
    expect(find.text('Connect to your portfolio'), findsOneWidget);
    expect(find.text('Website address'), findsOneWidget);
    expect(find.text('Admin key'), findsOneWidget);
  });

  testWidgets('with saved settings the dashboard shows live numbers and content is editable', (tester) async {
    SharedPreferences.setMockInitialValues({'server_url': 'https://site.example', 'admin_key': 'k' * 24});
    final state = AppState(clientFactory: fakeServer)..load();
    await tester.pumpWidget(AdminApp(state: state));
    await tester.pumpAndSettle();

    expect(find.text('Connected to your database'), findsOneWidget);
    expect(find.text('61'), findsOneWidget);
    expect(find.text('CV (PDF)'), findsOneWidget);
    expect(find.text('Up to date (version 4).'), findsOneWidget);
    expect(find.text('Rebuild now'), findsOneWidget);
    expect(find.text('5'), findsOneWidget);

    await tester.tap(find.text('Content'));
    await tester.pumpAndSettle();
    expect(find.text('Projects'), findsOneWidget);
    expect(find.textContaining('1 items'), findsWidgets);

    await tester.tap(find.text('Projects'));
    await tester.pumpAndSettle();
    expect(find.text('Gulf Limousine Booking App'), findsOneWidget);

    await tester.tap(find.text('Gulf Limousine Booking App'));
    await tester.pumpAndSettle();
    expect(find.text('Name *'), findsOneWidget);
    expect(find.text('Description'), findsOneWidget);
    await tester.enterText(find.widgetWithText(TextFormField, 'Name *'), 'Gulf Limo v2');
    await tester.tap(find.text('Done').first);
    await tester.pumpAndSettle();
    expect(find.text('Gulf Limo v2'), findsOneWidget);
    expect(find.text('Save changes'), findsOneWidget);
  });

  test('settings round-trip through storage', () async {
    SharedPreferences.setMockInitialValues({});
    final store = SettingsStore();
    await store.save(const ServerSettings(baseUrl: 'site.example/', adminKey: ' abc '));
    final loaded = await store.load();
    expect(loaded.baseUrl, 'https://site.example');
    expect(loaded.adminKey, 'abc');
  });
}
