import 'package:flutter/material.dart';

import '../api.dart';
import '../main.dart';
import '../settings_store.dart';
import '../widgets/common.dart';
import 'messages_screen.dart' show formatDate;

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final _url = TextEditingController();
  final _key = TextEditingController();
  bool _hideKey = true;
  bool _busy = false;
  bool _filled = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_filled) {
      _filled = true;
      final settings = AppScope.of(context).settings;
      _url.text = settings.baseUrl;
      _key.text = settings.adminKey;
    }
  }

  @override
  void dispose() {
    _url.dispose();
    _key.dispose();
    super.dispose();
  }

  Future<void> _saveAndTest() async {
    final state = AppScope.of(context);
    final url = ServerSettings.normalizeUrl(_url.text);
    final key = _key.text.trim();
    if (url.isEmpty || key.isEmpty) {
      showSnack(context, 'Enter both the server address and the admin key.', error: true);
      return;
    }
    setState(() => _busy = true);
    try {
      await AdminApi(baseUrl: url, adminKey: key).ping();
      await state.update(ServerSettings(baseUrl: url, adminKey: key));
      if (!mounted) return;
      _url.text = url;
      showSnack(context, 'Connected. Settings saved.');
    } catch (e) {
      if (mounted) showSnack(context, errorText(e), error: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final configured = AppScope.of(context).settings.isConfigured;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text('Settings', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700)),
        const SizedBox(height: 12),
        if (!configured)
          Card(
            color: Theme.of(context).colorScheme.tertiaryContainer,
            child: const ListTile(
              leading: Icon(Icons.info_outline),
              title: Text('Connect to your portfolio'),
              subtitle: Text('Enter the website address and the ADMIN_API_KEY you set on the server. This is done only once.'),
            ),
          ),
        const SizedBox(height: 8),
        TextField(
          controller: _url,
          keyboardType: TextInputType.url,
          autocorrect: false,
          decoration: const InputDecoration(
            labelText: 'Website address',
            hintText: 'https://your-portfolio.vercel.app',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 14),
        TextField(
          controller: _key,
          obscureText: _hideKey,
          autocorrect: false,
          enableSuggestions: false,
          decoration: InputDecoration(
            labelText: 'Admin key',
            border: const OutlineInputBorder(),
            suffixIcon: IconButton(
              icon: Icon(_hideKey ? Icons.visibility : Icons.visibility_off),
              onPressed: () => setState(() => _hideKey = !_hideKey),
            ),
          ),
        ),
        const SizedBox(height: 16),
        FilledButton.icon(
          onPressed: _busy ? null : _saveAndTest,
          icon: _busy ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(Icons.link),
          label: Text(_busy ? 'Connecting…' : 'Save & test connection'),
        ),
        const SizedBox(height: 28),
        Text('Tools', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        Card(
          child: ListTile(
            leading: const Icon(Icons.receipt_long),
            title: const Text('Server logs'),
            subtitle: const Text('Recent errors and activity from your website'),
            trailing: const Icon(Icons.chevron_right),
            enabled: configured,
            onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const LogsScreen())),
          ),
        ),
        const SizedBox(height: 20),
        Text(
          'The admin key is stored only on this phone and sent with each request. Anyone with it can change your portfolio, so keep it private.',
          style: Theme.of(context).textTheme.bodySmall,
        ),
      ],
    );
  }
}

class LogsScreen extends StatelessWidget {
  const LogsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Server logs')),
      body: LoadView<List<LogEntry>>(
        load: (api) => api.logs(),
        builder: (context, logs, reload) => ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(12),
          children: [
            Align(
              alignment: Alignment.centerRight,
              child: TextButton.icon(
                onPressed: logs.isEmpty
                    ? null
                    : () async {
                        final ok = await confirm(context, title: 'Clear logs?', message: 'Remove the in-memory server log buffer.', action: 'Clear');
                        if (!ok || !context.mounted) return;
                        try {
                          await apiOf(context).clearLogs();
                          await reload();
                        } catch (e) {
                          if (context.mounted) showSnack(context, errorText(e), error: true);
                        }
                      },
                icon: const Icon(Icons.delete_sweep),
                label: const Text('Clear'),
              ),
            ),
            if (logs.isEmpty) const Padding(padding: EdgeInsets.all(24), child: Center(child: Text('No log entries.'))),
            for (final log in logs)
              Card(
                child: ListTile(
                  dense: true,
                  leading: Icon(
                    log.level == 'error' ? Icons.error : (log.level == 'warn' ? Icons.warning_amber : Icons.info_outline),
                    color: log.level == 'error' ? Theme.of(context).colorScheme.error : null,
                  ),
                  title: Text(log.message, maxLines: 3, overflow: TextOverflow.ellipsis),
                  subtitle: Text(formatDate(log.timestamp)),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
