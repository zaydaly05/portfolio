import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../api.dart';
import '../widgets/common.dart';

String formatDate(DateTime? date) {
  if (date == null) return '';
  final local = date.toLocal();
  String two(int n) => n.toString().padLeft(2, '0');
  return '${local.year}-${two(local.month)}-${two(local.day)} ${two(local.hour)}:${two(local.minute)}';
}

class MessagesScreen extends StatelessWidget {
  const MessagesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return LoadView<List<ContactMessage>>(
      load: (api) => api.messages(),
      builder: (context, messages, reload) => ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          Text('Messages', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text('Sent from your website contact form.', style: Theme.of(context).textTheme.bodySmall),
          const SizedBox(height: 12),
          if (messages.isEmpty) const Padding(padding: EdgeInsets.all(24), child: Center(child: Text('No messages yet.'))),
          for (final message in messages)
            Card(
              child: ListTile(
                title: Text(message.name),
                subtitle: Text('${message.email}\n${message.message}', maxLines: 3, overflow: TextOverflow.ellipsis),
                isThreeLine: true,
                trailing: Text(formatDate(message.createdAt), style: Theme.of(context).textTheme.bodySmall),
                onTap: () => _open(context, message, reload),
              ),
            ),
        ],
      ),
    );
  }

  Future<void> _open(BuildContext context, ContactMessage message, Future<void> Function() reload) async {
    final action = await showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(message.name, style: Theme.of(ctx).textTheme.titleLarge),
              Text(message.email),
              Text(formatDate(message.createdAt), style: Theme.of(ctx).textTheme.bodySmall),
              const SizedBox(height: 12),
              Flexible(child: SingleChildScrollView(child: SelectableText(message.message))),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(child: OutlinedButton.icon(onPressed: () => Navigator.pop(ctx, 'copy'), icon: const Icon(Icons.copy), label: const Text('Copy email'))),
                  const SizedBox(width: 12),
                  Expanded(
                    child: FilledButton.icon(
                      style: FilledButton.styleFrom(backgroundColor: Theme.of(ctx).colorScheme.error),
                      onPressed: () => Navigator.pop(ctx, 'delete'),
                      icon: const Icon(Icons.delete),
                      label: const Text('Delete'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
    if (!context.mounted) return;
    if (action == 'copy') {
      await Clipboard.setData(ClipboardData(text: message.email));
      if (context.mounted) showSnack(context, 'Email copied');
    } else if (action == 'delete') {
      final ok = await confirm(context, title: 'Delete message?', message: 'Delete the message from ${message.name}? This cannot be undone.');
      if (!ok || !context.mounted) return;
      try {
        await apiOf(context).deleteMessage(message.id);
        await reload();
        if (context.mounted) showSnack(context, 'Message deleted');
      } catch (e) {
        if (context.mounted) showSnack(context, errorText(e), error: true);
      }
    }
  }
}
