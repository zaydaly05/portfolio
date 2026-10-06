import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../api.dart';
import '../widgets/common.dart';

/// The protected copy of the owner's phone contacts: nothing is deleted for good, edits keep history,
/// and the whole list can be exported as CSV (backup / import into Kapso).
class ContactsScreen extends StatefulWidget {
  const ContactsScreen({super.key});

  @override
  State<ContactsScreen> createState() => _ContactsScreenState();
}

class _ContactsScreenState extends State<ContactsScreen> {
  bool _trash = false;
  String _query = '';
  int _token = 0;

  void _reload() => setState(() => _token++);

  Future<void> _export() async {
    try {
      final export = await apiOf(context).exportContacts();
      if (!mounted) return;
      await showDialog<void>(
        context: context,
        builder: (ctx) => AlertDialog(
          title: Text('Backup: ${export.count} contacts'),
          content: SizedBox(
            width: double.maxFinite,
            child: SingleChildScrollView(
              child: SelectableText(
                export.csv.length > 1500 ? '${export.csv.substring(0, 1500)}…' : export.csv,
                style: const TextStyle(fontFamily: 'monospace', fontSize: 11),
              ),
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
            FilledButton.icon(
              icon: const Icon(Icons.copy),
              label: const Text('Copy CSV'),
              onPressed: () async {
                final messenger = ScaffoldMessenger.of(ctx);
                final navigator = Navigator.of(ctx);
                await Clipboard.setData(ClipboardData(text: export.csv));
                navigator.pop();
                messenger.showSnackBar(SnackBar(
                  content: Text('CSV copied — paste it into a note, email or ${export.filename}'),
                ));
              },
            ),
          ],
        ),
      );
    } catch (e) {
      if (mounted) showSnack(context, errorText(e), error: true);
    }
  }

  Future<void> _import() async {
    final controller = TextEditingController();
    final text = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Import contacts'),
        content: SizedBox(
          width: double.maxFinite,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Paste numbers (one per line, "Name, number" works) or the text of a .vcf export from your phone.'),
              const SizedBox(height: 8),
              TextField(controller: controller, minLines: 5, maxLines: 10, decoration: const InputDecoration(border: OutlineInputBorder())),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton.icon(
                  icon: const Icon(Icons.paste),
                  label: const Text('Paste from clipboard'),
                  onPressed: () async {
                    final data = await Clipboard.getData(Clipboard.kTextPlain);
                    if (data?.text != null) controller.text = data!.text!;
                  },
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          FilledButton(onPressed: () => Navigator.pop(ctx, controller.text), child: const Text('Import')),
        ],
      ),
    );
    if (text == null || text.trim().isEmpty || !mounted) return;
    try {
      final r = await apiOf(context).importContacts(text);
      if (!mounted) return;
      final parts = [
        '${r.added} added',
        if (r.restored > 0) '${r.restored} restored from trash',
        if (r.duplicates > 0) '${r.duplicates} already saved',
        if (r.invalid.isNotEmpty) '${r.invalid.length} not understood',
      ];
      showSnack(context, parts.join(' · '));
      _reload();
    } catch (e) {
      if (mounted) showSnack(context, errorText(e), error: true);
    }
  }

  Future<void> _edit(VaultContact? contact) async {
    final name = TextEditingController(text: contact?.name ?? '');
    final phone = TextEditingController(text: contact?.display ?? '');
    final notes = TextEditingController(text: contact?.notes ?? '');
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
              Text(contact == null ? 'Add contact' : 'Edit contact', style: Theme.of(ctx).textTheme.titleLarge),
              const SizedBox(height: 12),
              TextField(controller: name, textCapitalization: TextCapitalization.words, decoration: const InputDecoration(labelText: 'Name', border: OutlineInputBorder())),
              const SizedBox(height: 12),
              TextField(
                controller: phone,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(labelText: 'Phone (e.g. 0101 774 1741 or +20 …)', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              TextField(controller: notes, decoration: const InputDecoration(labelText: 'Notes', border: OutlineInputBorder())),
              if (contact != null) ...[
                const SizedBox(height: 8),
                Text('${contact.historyCount} change${contact.historyCount == 1 ? '' : 's'} recorded — previous values are kept.', style: Theme.of(ctx).textTheme.bodySmall),
              ],
              const SizedBox(height: 16),
              FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Save')),
            ],
          ),
        ),
      ),
    );
    if (saved != true || !mounted) return;
    try {
      final api = apiOf(context);
      if (contact == null) {
        await api.addContact(phone.text.trim(), name.text.trim(), notes.text.trim());
      } else {
        await api.editContact(contact.id, name: name.text.trim(), phone: phone.text.trim(), notes: notes.text.trim());
      }
      _reload();
    } catch (e) {
      if (mounted) showSnack(context, errorText(e), error: true);
    }
  }

  Future<void> _trashOrRestore(VaultContact contact) async {
    try {
      final api = apiOf(context);
      if (contact.trashed) {
        await api.restoreContact(contact.id);
        if (mounted) showSnack(context, '${contact.name.isEmpty ? contact.display : contact.name} restored');
      } else {
        await api.trashContact(contact.id);
        if (!mounted) return;
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(
            SnackBar(
              content: const Text('Moved to trash — you can restore it any time'),
              action: SnackBarAction(
                label: 'Undo',
                onPressed: () async {
                  try {
                    await api.restoreContact(contact.id);
                    _reload();
                  } catch (_) {}
                },
              ),
            ),
          );
      }
      _reload();
    } catch (e) {
      if (mounted) showSnack(context, errorText(e), error: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Contacts vault'),
        actions: [
          IconButton(tooltip: 'Import', icon: const Icon(Icons.upload_file), onPressed: _import),
          IconButton(tooltip: 'Export backup (CSV)', icon: const Icon(Icons.download), onPressed: _export),
        ],
      ),
      floatingActionButton: _trash ? null : FloatingActionButton.extended(onPressed: () => _edit(null), icon: const Icon(Icons.person_add), label: const Text('Add')),
      body: LoadView<ContactsPage>(
        key: ValueKey('$_trash-$_query-$_token'),
        load: (api) => api.contacts(status: _trash ? 'trashed' : 'active', query: _query),
        builder: (context, page, reload) => ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(12, 8, 12, 96),
          children: [
            SegmentedButton<bool>(
              segments: [
                ButtonSegment(value: false, label: Text('Contacts (${page.active})'), icon: const Icon(Icons.people)),
                ButtonSegment(value: true, label: Text('Trash (${page.trashed})'), icon: const Icon(Icons.delete_outline)),
              ],
              selected: {_trash},
              onSelectionChanged: (s) => setState(() => _trash = s.first),
            ),
            const SizedBox(height: 8),
            TextField(
              decoration: const InputDecoration(prefixIcon: Icon(Icons.search), hintText: 'Search name or number', border: OutlineInputBorder(), isDense: true),
              onSubmitted: (v) => setState(() => _query = v.trim()),
            ),
            const SizedBox(height: 8),
            Card(
              color: Theme.of(context).colorScheme.secondaryContainer,
              child: const ListTile(
                dense: true,
                leading: Icon(Icons.shield_outlined),
                title: Text('Protected copy'),
                subtitle: Text('Nothing is deleted for good and every edit keeps the old values. Export a CSV backup before each monthly broadcast.'),
              ),
            ),
            if (page.contacts.isEmpty)
              Padding(padding: const EdgeInsets.all(32), child: Center(child: Text(_trash ? 'The trash is empty.' : 'No contacts yet. Tap Add or Import.'))),
            for (final c in page.contacts)
              Card(
                child: ListTile(
                  leading: CircleAvatar(child: Text(c.name.isEmpty ? '#' : c.name.characters.first.toUpperCase())),
                  title: Text(c.name.isEmpty ? c.display : c.name),
                  subtitle: Text([if (c.name.isNotEmpty) c.display, if (c.notes.isNotEmpty) c.notes].join(' · ')),
                  onTap: () => _edit(c),
                  trailing: IconButton(
                    tooltip: c.trashed ? 'Restore' : 'Move to trash',
                    icon: Icon(c.trashed ? Icons.restore_from_trash : Icons.delete_outline),
                    onPressed: () => _trashOrRestore(c),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
