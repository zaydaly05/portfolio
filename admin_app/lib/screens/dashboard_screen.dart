import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../api.dart' show CvStatus, Summary;
import '../main.dart';
import '../widgets/common.dart';
import 'changes_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key, required this.onOpenTab});

  final void Function(int tab) onOpenTab;

  @override
  Widget build(BuildContext context) {
    return LoadView<Summary>(
      load: (api) => api.summary(),
      builder: (context, summary, reload) => ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          Text('Portfolio Admin', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text('Pull down to refresh', style: Theme.of(context).textTheme.bodySmall),
          const SizedBox(height: 16),
          _StatusCard(connected: summary.dbConnected),
          const SizedBox(height: 12),
          _ChangesCard(
            pending: summary.pendingChanges ?? 0,
            onOpen: () async {
              await Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ChangesScreen()));
              await reload();
            },
          ),
          const SizedBox(height: 12),
          const _CvCard(),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: _StatTile(icon: Icons.star, label: 'Stars', value: summary.stars, onTap: () => _editStars(context, summary, reload))),
              const SizedBox(width: 12),
              Expanded(child: _StatTile(icon: Icons.rate_review, label: 'Reviews', value: summary.reviews, onTap: () => onOpenTab(2))),
              const SizedBox(width: 12),
              Expanded(child: _StatTile(icon: Icons.mail, label: 'Messages', value: summary.messages, onTap: () => onOpenTab(3))),
            ],
          ),
          const SizedBox(height: 20),
          Text('Quick actions', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          _ActionTile(icon: Icons.edit_note, title: 'Edit portfolio content', subtitle: 'Projects, experience, skills, certificates…', onTap: () => onOpenTab(1)),
          _ActionTile(icon: Icons.mark_email_unread, title: 'Read contact messages', subtitle: 'Messages sent from your website', onTap: () => onOpenTab(3)),
          _ActionTile(icon: Icons.star_half, title: 'Moderate reviews', subtitle: 'Add, edit or remove reviews', onTap: () => onOpenTab(2)),
          const SizedBox(height: 20),
          Text('Sections you have changed', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          if (summary.overridden.isEmpty)
            const Text('Everything still matches the built-in content.')
          else
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [for (final s in summary.overridden) Chip(label: Text(s))],
            ),
        ],
      ),
    );
  }

  Future<void> _editStars(BuildContext context, Summary summary, Future<void> Function() reload) async {
    final controller = TextEditingController(text: '${summary.stars ?? 0}');
    final value = await showDialog<int>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Star count'),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          autofocus: true,
          decoration: const InputDecoration(labelText: 'Stars shown on the website'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, int.tryParse(controller.text.trim())),
            child: const Text('Save'),
          ),
        ],
      ),
    );
    if (value == null || !context.mounted) return;
    try {
      await apiOf(context).setStars(value);
      await reload();
      if (context.mounted) showSnack(context, 'Star count updated');
    } catch (e) {
      if (context.mounted) showSnack(context, errorText(e), error: true);
    }
  }
}

class _StatusCard extends StatelessWidget {
  const _StatusCard({required this.connected});

  final bool connected;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Card(
      color: connected ? scheme.primaryContainer : scheme.errorContainer,
      child: ListTile(
        leading: Icon(connected ? Icons.check_circle : Icons.warning_amber, color: connected ? scheme.primary : scheme.error),
        title: Text(connected ? 'Connected to your database' : 'Database not connected'),
        subtitle: Text(connected
            ? 'Changes are saved and shown on your website.'
            : 'Reviews, messages and stars need MONGODB_URI on the server. Content edits still work but may not persist.'),
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  const _StatTile({required this.icon, required this.label, required this.value, required this.onTap});

  final IconData icon;
  final String label;
  final int? value;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
          child: Column(
            children: [
              Icon(icon, color: Theme.of(context).colorScheme.primary),
              const SizedBox(height: 8),
              Text(value?.toString() ?? '–', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700)),
              Text(label, style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ),
      ),
    );
  }
}

class _ActionTile extends StatelessWidget {
  const _ActionTile({required this.icon, required this.title, required this.subtitle, required this.onTap});

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(leading: Icon(icon), title: Text(title), subtitle: Text(subtitle), trailing: const Icon(Icons.chevron_right), onTap: onTap),
    );
  }
}

/// Shows the state of the generated CV and lets the owner rebuild it or copy its link.
class _CvCard extends StatefulWidget {
  const _CvCard();

  @override
  State<_CvCard> createState() => _CvCardState();
}

class _CvCardState extends State<_CvCard> {
  late Future<CvStatus> _future;
  bool _busy = false;
  bool _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_started) {
      _started = true;
      _future = _load();
    }
  }

  Future<CvStatus> _load() => apiOf(context).cvStatus();

  Future<void> _rebuild() async {
    setState(() => _busy = true);
    try {
      await apiOf(context).rebuildCv();
      if (!mounted) return;
      showSnack(context, 'CV rebuild requested');
      setState(() => _future = _load());
    } catch (e) {
      if (mounted) showSnack(context, errorText(e), error: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _copyLink(CvStatus status) async {
    final base = AppScope.of(context).settings.baseUrl;
    await Clipboard.setData(ClipboardData(text: '$base${status.url}'));
    if (mounted) showSnack(context, 'CV link copied');
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<CvStatus>(
      future: _future,
      builder: (context, snapshot) {
        final status = snapshot.data;
        final scheme = Theme.of(context).colorScheme;
        String title = 'CV (PDF)';
        String subtitle = 'Checking…';
        IconData icon = Icons.description_outlined;
        if (snapshot.hasError) {
          subtitle = errorText(snapshot.error!);
          icon = Icons.error_outline;
        } else if (status != null) {
          switch (status.status) {
            case 'requested':
              subtitle = status.runnerConfigured
                  ? 'Rebuilding with your latest changes… this takes a few minutes.'
                  : 'A rebuild is waiting, but the build runner is not set up yet (see README).';
              icon = Icons.sync;
            case 'failed':
              subtitle = 'The last build failed: ${status.error ?? 'unknown error'}';
              icon = Icons.error_outline;
            case 'done':
              subtitle = 'Up to date (version ${status.version}).'
                  '${(status.pages ?? 1) > 1 ? '\n⚠️ The CV is now ${status.pages} pages — it is designed to fit on one. Shorten some entries.' : ''}';
              icon = Icons.check_circle_outline;
            default:
              subtitle = status.version > 0 ? 'Version ${status.version}.' : 'Not generated from the app yet.';
          }
        }
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(icon, color: status?.status == 'failed' ? scheme.error : scheme.primary),
                    const SizedBox(width: 12),
                    Expanded(child: Text(title, style: Theme.of(context).textTheme.titleMedium)),
                  ],
                ),
                const SizedBox(height: 6),
                Text(subtitle),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  children: [
                    FilledButton.tonalIcon(
                      onPressed: _busy ? null : _rebuild,
                      icon: const Icon(Icons.refresh),
                      label: const Text('Rebuild now'),
                    ),
                    if (status?.url != null)
                      OutlinedButton.icon(
                        onPressed: () => _copyLink(status!),
                        icon: const Icon(Icons.link),
                        label: const Text('Copy link'),
                      ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _ChangesCard extends StatelessWidget {
  const _ChangesCard({required this.pending, required this.onOpen});

  final int pending;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Card(
      color: pending > 0 ? scheme.tertiaryContainer : null,
      child: ListTile(
        leading: Icon(pending > 0 ? Icons.notifications_active : Icons.fact_check_outlined),
        title: Text(pending > 0 ? '$pending change${pending == 1 ? '' : 's'} waiting for your approval' : 'Changes to approve'),
        subtitle: Text(pending > 0 ? 'New GitHub projects found. Tap to review.' : 'Nothing waiting. Tap to check GitHub.'),
        trailing: const Icon(Icons.chevron_right),
        onTap: onOpen,
      ),
    );
  }
}
