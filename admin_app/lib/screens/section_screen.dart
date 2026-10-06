import 'dart:convert';

import 'package:flutter/material.dart';

import '../content_model.dart';
import '../widgets/common.dart';
import 'github_import_screen.dart';
import 'item_editor_screen.dart';

/// Edits one section: a reorderable list of items, or the single profile object.
class SectionScreen extends StatefulWidget {
  const SectionScreen({super.key, required this.info, required this.initial});

  final SectionInfo info;
  final Object? initial;

  @override
  State<SectionScreen> createState() => _SectionScreenState();
}

class _SectionScreenState extends State<SectionScreen> {
  late List<Map<String, dynamic>> _items;
  bool _dirty = false;
  bool _saving = false;

  SectionInfo get info => widget.info;

  @override
  void initState() {
    super.initState();
    _items = _decode(widget.initial);
  }

  List<Map<String, dynamic>> _decode(Object? data) {
    if (data is List) {
      return data.map((e) => Map<String, dynamic>.from(e as Map)).toList();
    }
    if (data is Map) return [Map<String, dynamic>.from(data)];
    return [];
  }

  Object get _payload => info.isObject ? (_items.isEmpty ? <String, dynamic>{} : _items.first) : _items;

  Future<void> _editItem(int index) async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(
        builder: (_) => ItemEditorScreen(info: info, item: _items[index], isNew: false),
      ),
    );
    if (result != null) {
      setState(() {
        _items[index] = result;
        _dirty = true;
      });
    }
  }

  Future<void> _addItem() async {
    final result = await Navigator.of(context).push<Map<String, dynamic>>(
      MaterialPageRoute(
        builder: (_) => ItemEditorScreen(info: info, item: const {}, isNew: true),
      ),
    );
    if (result != null) {
      setState(() {
        _items.add(result);
        _dirty = true;
      });
    }
  }

  Future<void> _deleteItem(int index) async {
    final title = '${_items[index][info.titleKey] ?? 'this item'}';
    final ok = await confirm(context, title: 'Delete item?', message: 'Remove "$title" from ${info.label}? It is only removed from the website after you press Save.');
    if (ok) {
      setState(() {
        _items.removeAt(index);
        _dirty = true;
      });
    }
  }

  Future<void> _save() async {
    if (_saving) return;
    setState(() => _saving = true);
    try {
      await apiOf(context).saveSection(info.key, _payload);
      if (!mounted) return;
      setState(() {
        _dirty = false;
        _saving = false;
      });
      showSnack(context, '${info.label} saved — live on your website');
    } catch (e) {
      if (!mounted) return;
      setState(() => _saving = false);
      showSnack(context, errorText(e), error: true);
    }
  }

  Future<void> _reset() async {
    final ok = await confirm(
      context,
      title: 'Reset ${info.label}?',
      message: 'This removes all your edits to ${info.label} and restores the built-in content on the website.',
      action: 'Reset',
    );
    if (!ok || !mounted) return;
    try {
      await apiOf(context).resetSection(info.key);
      if (!mounted) return;
      showSnack(context, '${info.label} restored to the built-in content');
      Navigator.of(context).pop();
    } catch (e) {
      if (mounted) showSnack(context, errorText(e), error: true);
    }
  }

  Future<void> _importFromGithub() async {
    if (_dirty) {
      showSnack(context, 'Save your changes first, then import from GitHub.', error: true);
      return;
    }
    final imported = await Navigator.of(context).push<bool>(MaterialPageRoute(builder: (_) => const GithubImportScreen()));
    if (imported != true || !mounted) return;
    try {
      final content = await apiOf(context).portfolio();
      if (!mounted) return;
      setState(() => _items = _decode(content.sections[info.key]));
    } catch (e) {
      if (mounted) showSnack(context, errorText(e), error: true);
    }
  }

  Future<void> _editJson() async {
    final controller = TextEditingController(text: const JsonEncoder.withIndent('  ').convert(_payload));
    final parsed = await showDialog<Object>(
      context: context,
      builder: (ctx) {
        String? error;
        return StatefulBuilder(
          builder: (ctx, setLocal) => AlertDialog(
            title: Text('${info.label} as JSON'),
            content: SizedBox(
              width: double.maxFinite,
              child: TextField(
                controller: controller,
                maxLines: 16,
                style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
                decoration: InputDecoration(border: const OutlineInputBorder(), errorText: error),
              ),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
              FilledButton(
                onPressed: () {
                  try {
                    final value = jsonDecode(controller.text);
                    if (info.isObject ? value is! Map : value is! List) {
                      throw const FormatException();
                    }
                    Navigator.pop(ctx, value as Object);
                  } catch (_) {
                    setLocal(() => error = info.isObject ? 'Must be a JSON object { … }' : 'Must be a JSON list [ … ]');
                  }
                },
                child: const Text('Apply'),
              ),
            ],
          ),
        );
      },
    );
    if (parsed != null) {
      setState(() {
        _items = _decode(parsed);
        _dirty = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: !_dirty,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        final leave = await confirm(context, title: 'Discard changes?', message: 'You have unsaved changes in ${info.label}.', action: 'Discard');
        if (leave && context.mounted) Navigator.of(context).pop();
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(info.label),
          actions: [
            PopupMenuButton<String>(
              onSelected: (value) {
                if (value == 'github') _importFromGithub();
                if (value == 'json') _editJson();
                if (value == 'reset') _reset();
              },
              itemBuilder: (_) => [
                if (info.key == 'projects') const PopupMenuItem(value: 'github', child: Text('Import from GitHub')),
                const PopupMenuItem(value: 'json', child: Text('Edit as JSON')),
                const PopupMenuItem(value: 'reset', child: Text('Reset to built-in')),
              ],
            ),
          ],
        ),
        floatingActionButton: info.isObject
            ? null
            : FloatingActionButton.extended(onPressed: _addItem, icon: const Icon(Icons.add), label: const Text('Add')),
        bottomNavigationBar: _dirty
            ? SafeArea(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                  child: FilledButton.icon(
                    onPressed: _saving ? null : _save,
                    icon: _saving
                        ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                        : const Icon(Icons.cloud_upload),
                    label: Text(_saving ? 'Saving…' : 'Save changes'),
                  ),
                ),
              )
            : null,
        body: info.isObject ? _buildProfile() : _buildList(),
      ),
    );
  }

  Widget _buildProfile() {
    final item = _items.isEmpty ? <String, dynamic>{} : _items.first;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          child: ListTile(
            title: Text('${item['name'] ?? 'Profile'}'),
            subtitle: Text('${item['title'] ?? ''}'),
            trailing: const Icon(Icons.edit),
            onTap: () async {
              final result = await Navigator.of(context).push<Map<String, dynamic>>(
                MaterialPageRoute(builder: (_) => ItemEditorScreen(info: info, item: item, isNew: false)),
              );
              if (result != null) {
                setState(() {
                  _items = [result];
                  _dirty = true;
                });
              }
            },
          ),
        ),
      ],
    );
  }

  Widget _buildList() {
    if (_items.isEmpty) {
      return const Center(child: Text('Nothing here yet. Tap Add to create the first item.'));
    }
    return ReorderableListView.builder(
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 96),
      itemCount: _items.length,
      onReorderItem: (oldIndex, newIndex) {
        setState(() {
          _items.insert(newIndex, _items.removeAt(oldIndex));
          _dirty = true;
        });
      },
      itemBuilder: (context, index) {
        final item = _items[index];
        final subtitleKey = info.subtitleKey;
        return Card(
          key: ObjectKey(item),
          child: ListTile(
            title: Text('${item[info.titleKey] ?? '(untitled)'}', maxLines: 2, overflow: TextOverflow.ellipsis),
            subtitle: subtitleKey == null ? null : Text('${item[subtitleKey] ?? ''}', maxLines: 1, overflow: TextOverflow.ellipsis),
            onTap: () => _editItem(index),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(icon: const Icon(Icons.delete_outline), tooltip: 'Delete', onPressed: () => _deleteItem(index)),
                ReorderableDragStartListener(index: index, child: const Padding(padding: EdgeInsets.all(8), child: Icon(Icons.drag_handle))),
              ],
            ),
          ),
        );
      },
    );
  }
}
