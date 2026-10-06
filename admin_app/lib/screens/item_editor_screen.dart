import 'dart:convert';

import 'package:flutter/material.dart';

import '../content_model.dart';

/// Form for a single item. Pops with the edited map, or null when cancelled.
class ItemEditorScreen extends StatefulWidget {
  const ItemEditorScreen({super.key, required this.info, required this.item, required this.isNew});

  final SectionInfo info;
  final Map<String, dynamic> item;
  final bool isNew;

  @override
  State<ItemEditorScreen> createState() => _ItemEditorScreenState();
}

class _ItemEditorScreenState extends State<ItemEditorScreen> {
  final _formKey = GlobalKey<FormState>();
  late final Map<String, dynamic> _values;
  late final Map<String, FieldKind> _kinds;
  final Map<String, TextEditingController> _controllers = {};

  @override
  void initState() {
    super.initState();
    _values = mergeWithTemplate(widget.item, widget.info.template);
    _kinds = {for (final e in _values.entries) e.key: fieldKindFor(e.key, e.value)};
    for (final entry in _values.entries) {
      if (_kinds[entry.key] == FieldKind.boolean) continue;
      _controllers[entry.key] = TextEditingController(text: _initialText(entry.key, entry.value));
    }
  }

  String _initialText(String key, Object? value) {
    switch (_kinds[key]!) {
      case FieldKind.stringList:
        return (value as List).join('\n');
      case FieldKind.json:
        return const JsonEncoder.withIndent('  ').convert(value);
      case FieldKind.number:
        return value.toString();
      case FieldKind.boolean:
        return '';
      case FieldKind.text:
      case FieldKind.longText:
        return value?.toString() ?? '';
    }
  }

  @override
  void dispose() {
    for (final c in _controllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  void _done() {
    if (!_formKey.currentState!.validate()) return;
    final result = <String, dynamic>{};
    for (final key in _values.keys) {
      if (_kinds[key] == FieldKind.boolean) {
        result[key] = _values[key] == true;
        continue;
      }
      final text = _controllers[key]!.text;
      switch (_kinds[key]!) {
        case FieldKind.text:
        case FieldKind.longText:
          result[key] = text;
        case FieldKind.boolean:
          break;
        case FieldKind.number:
          result[key] = parseNumber(text) ?? 0;
        case FieldKind.stringList:
          result[key] = parseLines(text);
        case FieldKind.json:
          result[key] = jsonDecode(text);
      }
    }
    Navigator.of(context).pop(cleanItem(result, requiredKey: widget.info.titleKey));
  }

  @override
  Widget build(BuildContext context) {
    final info = widget.info;
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.isNew ? 'New ${info.label.toLowerCase()}' : 'Edit'),
        actions: [TextButton(onPressed: _done, child: const Text('Done'))],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          children: [
            for (final key in _values.keys) ...[
              _field(key),
              const SizedBox(height: 14),
            ],
            const SizedBox(height: 8),
            FilledButton(onPressed: _done, child: const Text('Done')),
            const SizedBox(height: 8),
            Text(
              'Done keeps your changes in the list. Press Save on the previous screen to publish them.',
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _field(String key) {
    final kind = _kinds[key]!;
    final label = humanizeKey(key);
    final required = key == widget.info.titleKey;

    if (kind == FieldKind.boolean) {
      return SwitchListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 4),
        title: Text(label),
        value: _values[key] == true,
        onChanged: (v) => setState(() => _values[key] = v),
      );
    }

    final controller = _controllers[key]!;
    switch (kind) {
      case FieldKind.boolean:
        return const SizedBox.shrink();
      case FieldKind.number:
        return TextFormField(
          controller: controller,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          decoration: InputDecoration(labelText: label, border: const OutlineInputBorder()),
          validator: (v) => parseNumber(v ?? '') == null ? 'Enter a number' : null,
        );
      case FieldKind.stringList:
        return TextFormField(
          controller: controller,
          minLines: 3,
          maxLines: 10,
          keyboardType: TextInputType.multiline,
          decoration: InputDecoration(
            labelText: label,
            helperText: 'One entry per line',
            border: const OutlineInputBorder(),
            alignLabelWithHint: true,
          ),
        );
      case FieldKind.json:
        return TextFormField(
          controller: controller,
          minLines: 3,
          maxLines: 10,
          style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
          decoration: InputDecoration(labelText: '$label (JSON)', border: const OutlineInputBorder(), alignLabelWithHint: true),
          validator: (v) {
            try {
              jsonDecode(v ?? '');
              return null;
            } catch (_) {
              return 'Not valid JSON';
            }
          },
        );
      case FieldKind.longText:
        return TextFormField(
          controller: controller,
          minLines: 3,
          maxLines: 10,
          keyboardType: TextInputType.multiline,
          textCapitalization: TextCapitalization.sentences,
          decoration: InputDecoration(labelText: label, border: const OutlineInputBorder(), alignLabelWithHint: true),
        );
      case FieldKind.text:
        return TextFormField(
          controller: controller,
          decoration: InputDecoration(labelText: required ? '$label *' : label, border: const OutlineInputBorder()),
          keyboardType: _keyboardFor(key),
          validator: required ? (v) => (v == null || v.trim().isEmpty) ? 'Required' : null : null,
        );
    }
  }

  TextInputType _keyboardFor(String key) {
    if (key == 'email') return TextInputType.emailAddress;
    if (key == 'phone') return TextInputType.phone;
    if (key == 'image' || key == 'pdf' || key == 'github' || key == 'linkedin') return TextInputType.url;
    return TextInputType.text;
  }
}
