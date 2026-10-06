import 'package:flutter/material.dart';

import '../api.dart';
import '../widgets/common.dart';

/// Automatic changes (new GitHub projects) that wait for approval, with history.
class ChangesScreen extends StatefulWidget {
  const ChangesScreen({super.key});

  @override
  State<ChangesScreen> createState() => _ChangesScreenState();
}

class _ChangesScreenState extends State<ChangesScreen> {
  bool _history = false;
  bool _checking = false;
  int _reloadToken = 0;

  void _reload() => setState(() => _reloadToken++);

  Future<void> _checkGithub() async {
    setState(() => _checking = true);
    try {
      final result = await apiOf(context).syncChanges();
      if (!mounted) return;
      showSnack(
        context,
        result.createdCode == null
            ? 'Nothing new on GitHub (checked ${result.checked} repositories).'
            : 'Found new projects — change ${result.createdCode} is waiting for your decision.',
      );
      _reload();
    } catch (e) {
      if (mounted) showSnack(context, errorText(e), error: true);
    } finally {
      if (mounted) setState(() => _checking = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Changes to approve'),
        actions: [
          IconButton(
            tooltip: 'Check GitHub now',
            onPressed: _checking ? null : _checkGithub,
            icon: _checking
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                : const Icon(Icons.cloud_sync),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: SegmentedButton<bool>(
              segments: const [
                ButtonSegment(value: false, label: Text('Waiting'), icon: Icon(Icons.hourglass_top)),
                ButtonSegment(value: true, label: Text('History'), icon: Icon(Icons.history)),
              ],
              selected: {_history},
              onSelectionChanged: (s) => setState(() => _history = s.first),
            ),
          ),
          Expanded(
            child: LoadView<List<ChangeProposal>>(
              key: ValueKey('$_history-$_reloadToken'),
              load: (api) => api.changes(status: _history ? 'all' : 'pending'),
              builder: (context, items, reload) => ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(12, 0, 12, 24),
                children: [
                  if (items.isEmpty)
                    Padding(
                      padding: const EdgeInsets.all(32),
                      child: Center(
                        child: Text(
                          _history ? 'No changes yet.' : 'Nothing is waiting for your decision.\nNew GitHub projects show up here.',
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                  for (final change in items) _ChangeCard(change: change, onChanged: () async => _reload()),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ChangeCard extends StatelessWidget {
  const _ChangeCard({required this.change, required this.onChanged});

  final ChangeProposal change;
  final Future<void> Function() onChanged;

  bool get _pending => change.status == 'pending';

  Future<void> _decide(BuildContext context, bool approve) async {
    final ok = await confirm(
      context,
      title: approve ? 'Approve ${change.code}?' : 'Reject ${change.code}?',
      message: approve
          ? 'The projects are added to your portfolio and your CV, the CV is rebuilt and the new PDF is sent to you.'
          : 'Nothing is added. These repositories will not be suggested again.',
      action: approve ? 'Approve' : 'Reject',
    );
    if (!ok || !context.mounted) return;
    try {
      final api = apiOf(context);
      if (approve) {
        await api.approveChange(change.code);
      } else {
        await api.rejectChange(change.code);
      }
      if (context.mounted) showSnack(context, approve ? 'Approved — portfolio updated, CV rebuilding' : 'Rejected');
      await onChanged();
    } catch (e) {
      if (context.mounted) showSnack(context, errorText(e), error: true);
    }
  }

  Future<void> _edit(BuildContext context, int index, ProposedProject project) async {
    final name = TextEditingController(text: project.name);
    final period = TextEditingController(text: project.period);
    final stack = TextEditingController(text: project.stack);
    final description = TextEditingController(text: project.description);
    final saved = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (ctx) => Padding(
        padding: EdgeInsets.fromLTRB(16, 0, 16, MediaQuery.of(ctx).viewInsets.bottom + 16),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Edit before approving', style: Theme.of(ctx).textTheme.titleLarge),
              const SizedBox(height: 12),
              TextField(controller: name, decoration: const InputDecoration(labelText: 'Name', border: OutlineInputBorder())),
              const SizedBox(height: 12),
              TextField(controller: period, decoration: const InputDecoration(labelText: 'Date (e.g. May 2026)', border: OutlineInputBorder())),
              const SizedBox(height: 12),
              TextField(controller: stack, decoration: const InputDecoration(labelText: 'Tech stack', border: OutlineInputBorder())),
              const SizedBox(height: 12),
              TextField(
                controller: description,
                minLines: 3,
                maxLines: 8,
                decoration: const InputDecoration(labelText: 'Description', border: OutlineInputBorder(), alignLabelWithHint: true),
              ),
              const SizedBox(height: 16),
              FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Save')),
            ],
          ),
        ),
      ),
    );
    if (saved != true || !context.mounted) return;
    try {
      await apiOf(context).editChange(change.code, index, {
        'name': name.text.trim(),
        'period': period.text.trim(),
        'stack': stack.text.trim(),
        'description': description.text.trim(),
      });
      await onChanged();
    } catch (e) {
      if (context.mounted) showSnack(context, errorText(e), error: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final statusColor = switch (change.status) {
      'applied' => Colors.green,
      'rejected' => scheme.outline,
      'failed' => scheme.error,
      _ => scheme.primary,
    };
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Chip(label: Text(change.code), visualDensity: VisualDensity.compact),
                const SizedBox(width: 8),
                Text(change.status, style: TextStyle(color: statusColor, fontWeight: FontWeight.w600)),
              ],
            ),
            const SizedBox(height: 6),
            Text(change.summary, style: Theme.of(context).textTheme.titleSmall),
            if (change.error != null) Text(change.error!, style: TextStyle(color: scheme.error)),
            const Divider(height: 20),
            for (var i = 0; i < change.projects.length; i++)
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(change.projects[i].name),
                subtitle: Text(
                  [
                    if (change.projects[i].stack.isNotEmpty) change.projects[i].stack,
                    if (change.projects[i].period.isNotEmpty) change.projects[i].period,
                    if (change.projects[i].description.isNotEmpty) change.projects[i].description,
                  ].join('\n'),
                  maxLines: 5,
                  overflow: TextOverflow.ellipsis,
                ),
                isThreeLine: true,
                trailing: _pending ? IconButton(icon: const Icon(Icons.edit), tooltip: 'Edit', onPressed: () => _edit(context, i, change.projects[i])) : null,
              ),
            if (_pending)
              Row(
                children: [
                  Expanded(child: OutlinedButton.icon(onPressed: () => _decide(context, false), icon: const Icon(Icons.close), label: const Text('Reject'))),
                  const SizedBox(width: 12),
                  Expanded(child: FilledButton.icon(onPressed: () => _decide(context, true), icon: const Icon(Icons.check), label: const Text('Approve'))),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
