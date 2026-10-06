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

  test('reads the CV build status and asks for a rebuild', () async {
    late http.Request seen;
    final api = apiWith((req) async {
      seen = req;
      if (req.method == 'GET') {
        return jsonReply({
          'ok': true,
          'status': 'requested',
          'version': 3,
          'runnerConfigured': true,
          'reason': 'edited cvSummary',
          'url': '/api/document/resume?v=3',
        });
      }
      return jsonReply({'ok': true, 'dispatched': true});
    });
    final status = await api.cvStatus();
    expect(status.status, 'requested');
    expect(status.version, 3);
    expect(status.runnerConfigured, isTrue);
    expect(status.url, '/api/document/resume?v=3');
    await api.rebuildCv();
    expect(seen.method, 'POST');
    expect(seen.url.path, '/api/admin/cv/rebuild');
  });

  test('saving a section reports whether a CV rebuild was queued', () async {
    final yes = apiWith((_) async => jsonReply({'ok': true, 'cvBuildRequested': true}));
    final no = apiWith((_) async => jsonReply({'ok': true, 'cvBuildRequested': false}));
    expect(await yes.saveSection('cvSummary', {'summary': 'x'}), isTrue);
    expect(await no.saveSection('faq', []), isFalse);
  });

  test('reads pending changes and sends approve / reject / edit / sync', () async {
    final seen = <http.Request>[];
    final api = apiWith((req) async {
      seen.add(req);
      if (req.url.path == '/api/admin/changes' && req.method == 'GET') {
        return jsonReply({
          'ok': true,
          'changes': [
            {
              'code': 'K7Q2',
              'status': 'pending',
              'summary': '1 new GitHub project found.',
              'payload': {
                'projects': [
                  {'name': 'Cool App', 'period': 'September 2026', 'stack': 'Dart', 'description': 'Does things', 'github': 'https://github.com/me/cool-app'}
                ]
              }
            }
          ],
        });
      }
      if (req.url.path == '/api/admin/changes/sync') {
        return jsonReply({'ok': true, 'checked': 12, 'created': {'code': 'K7Q2'}, 'notified': true});
      }
      return jsonReply({'ok': true});
    });

    final changes = await api.changes();
    expect(seen.last.url.query, 'status=pending');
    expect(changes.single.code, 'K7Q2');
    expect(changes.single.projects.single.name, 'Cool App');
    expect(changes.single.projects.single.stack, 'Dart');

    final sync = await api.syncChanges();
    expect(sync.checked, 12);
    expect(sync.createdCode, 'K7Q2');
    expect(sync.notified, isTrue);

    await api.approveChange('K7Q2');
    expect(seen.last.method, 'POST');
    expect(seen.last.url.path, '/api/admin/changes/K7Q2/approve');
    await api.rejectChange('K7Q2');
    expect(seen.last.url.path, '/api/admin/changes/K7Q2/reject');
    await api.editChange('K7Q2', 0, {'name': 'Better Name'});
    expect(seen.last.method, 'PATCH');
    expect(jsonDecode(seen.last.body), {'index': 0, 'fields': {'name': 'Better Name'}});
  });

  test('contacts vault: list, import, edit, trash, restore, export', () async {
    final seen = <http.Request>[];
    final api = apiWith((req) async {
      seen.add(req);
      final path = req.url.path;
      if (path == '/api/admin/contacts' && req.method == 'GET') {
        return jsonReply({
          'ok': true,
          'counts': {'active': 2, 'trashed': 1},
          'contacts': [
            {'id': 'a1', 'phone': '201017741741', 'name': 'Zayd', 'notes': 'me', 'status': 'active', 'history': [{}, {}]},
          ],
        });
      }
      if (path.endsWith('/import')) return jsonReply({'ok': true, 'added': 2, 'restored': 1, 'duplicates': 3, 'invalid': ['12']});
      if (path.endsWith('/export')) return jsonReply({'ok': true, 'filename': 'contacts-2026-10-06.csv', 'count': 2, 'csv': 'name,phone_e164\nZayd,+201017741741\n'});
      return jsonReply({'ok': true});
    });

    final page = await api.contacts(status: 'trashed', query: 'za yd');
    expect(seen.last.url.queryParameters, {'status': 'trashed', 'q': 'za yd'});
    expect([page.active, page.trashed], [2, 1]);
    expect(page.contacts.single.display, '+201017741741');
    expect(page.contacts.single.historyCount, 2);

    final result = await api.importContacts('0100…');
    expect([result.added, result.restored, result.duplicates, result.invalid], [2, 1, 3, ['12']]);
    await api.addContact('0101', 'A', 'n');
    expect(jsonDecode(seen.last.body), {'phone': '0101', 'name': 'A', 'notes': 'n'});
    await api.editContact('a1', name: 'B', phone: '0102', notes: '');
    expect(seen.last.method, 'PUT');
    await api.trashContact('a1');
    expect(seen.last.method, 'DELETE');
    await api.restoreContact('a1');
    expect(seen.last.url.path, '/api/admin/contacts/a1/restore');

    final export = await api.exportContacts();
    expect(export.count, 2);
    expect(export.csv, startsWith('name,phone_e164'));
  });
}
