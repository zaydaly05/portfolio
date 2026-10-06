import 'package:flutter/material.dart';

import '../api.dart' show Summary;
import '../widgets/common.dart';

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
