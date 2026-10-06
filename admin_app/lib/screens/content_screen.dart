import 'package:flutter/material.dart';

import '../api.dart';
import '../content_model.dart';
import '../widgets/common.dart';
import 'section_screen.dart';

/// Lists every editable section of the portfolio.
class ContentScreen extends StatelessWidget {
  const ContentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return LoadView<PortfolioContent>(
      load: (api) => api.portfolio(),
      builder: (context, content, reload) => ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          Text('Content', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text('Tap a section to edit what visitors see on your website.', style: Theme.of(context).textTheme.bodySmall),
          const SizedBox(height: 12),
          for (final info in sections)
            Card(
              child: ListTile(
                leading: Text(info.icon, style: const TextStyle(fontSize: 26)),
                title: Text(info.label),
                subtitle: Text(_subtitle(info, content)),
                trailing: const Icon(Icons.chevron_right),
                onTap: () async {
                  await Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => SectionScreen(info: info, initial: content.sections[info.key]),
                    ),
                  );
                  await reload();
                },
              ),
            ),
        ],
      ),
    );
  }

  String _subtitle(SectionInfo info, PortfolioContent content) {
    final data = content.sections[info.key];
    final count = info.isObject ? null : (data is List ? data.length : 0);
    final edited = content.overridden.contains(info.key) ? ' · edited' : '';
    return info.isObject ? 'Name, bio and contact links$edited' : '$count items$edited';
  }
}
