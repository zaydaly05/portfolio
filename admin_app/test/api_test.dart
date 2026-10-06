import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:portfolio_admin/api.dart';

AdminApi apiWith(MockClientHandler handler) =>
    AdminApi(baseUrl: 'https://site.example/', adminKey: 'secret-key', client: MockClient(handler));

http.Response jsonReply(Object body, [int status = 200]) =>
    http.Response(jsonEncode(body), status, headers: {'content-type': 'application/json'});

void main() {
  test('sends the admin key and JSON headers to the right URL', () async {
    late http.Request seen;
    final api = apiWith((req) async {
      seen = req;
      return jsonReply({'ok': true});
    });
    await api.ping();
    expect(seen.method, 'GET');
    expect(seen.url.toString(), 'https://site.example/api/admin/ping');
    expect(seen.headers['x-admin-key'], 'secret-key');
  });

  test('parses the dashboard summary', () async {
    final api = apiWith((_) async => jsonReply({
          'ok': true,
          'dbConnected': true,
          'overridden': ['projects'],
          'reviews': 3,
          'messages': 7,
          'stars': 52,
        }));
    final summary = await api.summary();
    expect(summary.dbConnected, isTrue);
    expect(summary.overridden, ['projects']);
    expect([summary.reviews, summary.messages, summary.stars], [3, 7, 52]);
  });

  test('saves a section with the data wrapped in {data: ...}', () async {
    late http.Request seen;
    final api = apiWith((req) async {
      seen = req;
      return jsonReply({'ok': true});
    });
    await api.saveSection('projects', [
      {'name': 'A'}
    ]);
    expect(seen.method, 'PUT');
    expect(seen.url.path, '/api/admin/portfolio/projects');
    expect(jsonDecode(seen.body), {
      'data': [
        {'name': 'A'}
      ]
    });
  });

  test('maps reviews and messages', () async {
    final reviews = await apiWith((_) async => jsonReply({
          'ok': true,
          'reviews': [
            {'id': 'a1', 'name': 'Sara', 'role': 'CTO', 'rating': 4, 'comment': 'Great', 'date': '2026-01-01'}
          ]
        })).reviews();
    expect(reviews.single.name, 'Sara');
    expect(reviews.single.rating, 4);

    final messages = await apiWith((_) async => jsonReply({
          'ok': true,
          'messages': [
            {'id': 'm1', 'name': 'Ali', 'email': 'a@b.com', 'message': 'Hi', 'createdAt': '2026-10-01T10:00:00.000Z'}
          ]
        })).messages();
    expect(messages.single.email, 'a@b.com');
    expect(messages.single.createdAt, isNotNull);
  });

  test('review writes send the expected body', () async {
    late http.Request seen;
    final api = apiWith((req) async {
      seen = req;
      return jsonReply({'ok': true});
    });
    await api.updateReview('id9', 'Sara', 'CTO', 5, 'Nice');
    expect(seen.method, 'PUT');
    expect(seen.url.path, '/api/admin/reviews/id9');
    expect(jsonDecode(seen.body), {'name': 'Sara', 'role': 'CTO', 'rating': 5, 'comment': 'Nice'});
    await api.deleteReview('id9');
    expect(seen.method, 'DELETE');
  });

  test('turns failures into readable messages', () async {
    expect(
      () => apiWith((_) async => jsonReply({'ok': false, 'error': 'Invalid admin key.'}, 401)).ping(),
      throwsA(isA<ApiException>().having((e) => e.message, 'message', contains('admin key was rejected'))),
    );
    expect(
      () => apiWith((_) async => jsonReply({'ok': false, 'error': 'Database is not connected.'}, 503)).reviews(),
      throwsA(isA<ApiException>().having((e) => e.message, 'message', 'Database is not connected.')),
    );
    expect(
      () => apiWith((_) async => http.Response('<html>oops</html>', 502)).ping(),
      throwsA(isA<ApiException>().having((e) => e.statusCode, 'status', 502)),
    );
    expect(
      () => apiWith((_) async => http.Response('<html>not the api</html>', 200)).ping(),
      throwsA(isA<ApiException>().having((e) => e.message, 'message', contains('portfolio server'))),
    );
    expect(
      () => apiWith((_) async => throw http.ClientException('no route')).ping(),
      throwsA(isA<ApiException>().having((e) => e.message, 'message', contains('Could not reach'))),
    );
  });

  test('lists new GitHub repositories and imports the chosen ones', () async {
    late http.Request seen;
    final api = apiWith((req) async {
      seen = req;
      if (req.url.path.endsWith('/github/new')) {
        return jsonReply({
          'ok': true,
          'username': 'me',
          'total': 5,
          'repos': [
            {
              'name': 'cool-app',
              'description': 'A cool app',
              'language': 'Dart',
              'stars': 4,
              'project': {'period': 'September 2026', 'stack': 'Dart, Flutter'},
            }
          ],
        });
      }
      return jsonReply({'ok': true, 'added': ['cool-app'], 'total': 12});
    });

    final found = await api.githubNew();
    expect(found.username, 'me');
    expect(found.total, 5);
    expect(found.repos.single.name, 'cool-app');
    expect(found.repos.single.stack, 'Dart, Flutter');
    expect(found.repos.single.period, 'September 2026');

    final added = await api.githubImport(['cool-app']);
    expect(added, ['cool-app']);
    expect(seen.method, 'POST');
    expect(jsonDecode(seen.body), {'repos': ['cool-app']});
  });
}
