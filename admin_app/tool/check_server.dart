// Verifies that the admin API is reachable and the key works, using the same client as the app.
//
//   dart run tool/check_server.dart https://your-site.vercel.app YOUR_ADMIN_KEY
import 'dart:io';

import 'package:portfolio_admin/api.dart';

Future<void> main(List<String> args) async {
  if (args.length != 2) {
    stderr.writeln('Usage: dart run tool/check_server.dart <site-url> <admin-key>');
    exit(64);
  }
  final api = AdminApi(baseUrl: args[0], adminKey: args[1]);
  var failed = false;

  Future<void> step(String name, Future<String> Function() run) async {
    try {
      stdout.writeln('✔ $name: ${await run()}');
    } on ApiException catch (e) {
      failed = true;
      stdout.writeln('✘ $name: ${e.message}');
    }
  }

  await step('Reach server + key', () async {
    await api.ping();
    return 'ok';
  });
  await step('Dashboard summary', () async {
    final s = await api.summary();
    return 'db=${s.dbConnected} reviews=${s.reviews} messages=${s.messages} stars=${s.stars}';
  });
  await step('Portfolio content', () async {
    final c = await api.portfolio();
    return '${c.sections.length} sections, edited: ${c.overridden.isEmpty ? 'none' : c.overridden.join(', ')}';
  });
  await step('Reviews', () async => '${(await api.reviews()).length} found');
  await step('Messages', () async => '${(await api.messages()).length} found');

  exit(failed ? 1 : 0);
}
