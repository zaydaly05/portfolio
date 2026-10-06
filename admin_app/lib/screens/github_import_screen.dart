import 'package:flutter/material.dart';

import '../api.dart';
import '../widgets/common.dart';

/// Lists GitHub repositories that are not in the portfolio yet and imports the chosen ones.
class GithubImportScreen extends StatefulWidget {
  const GithubImportScreen({super.key});

  @override
  State<GithubImportScreen> createState() => _GithubImportScreenState();
}

class _GithubImportScreenState extends State<GithubImportScreen> {
  final Set<String> _selected = {};
  bool _importing = false;

  Future<void> _import() async {
    if (_selected.isEmpty || _importing) return;
    setState(() => _importing = true);
    try {
      final added = await apiOf(context).githubImport(_selected.toList());
      if (!mounted) return;
      showSnack(context, 'Added ${added.length} project${added.length == 1 ? '' : 's'} to your portfolio');
      Navigator.of(context).pop(true);
    } catch (e) {
      if (!mounted) return;
      setState(() => _importing = false);
      showSnack(context, errorText(e), error: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Import from GitHub')),
      bottomNavigationBar: _selected.isEmpty
          ? null
          : SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                child: FilledButton.icon(
                  onPressed: _importing ? null : _import,
                  icon: _importing
                      ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                      : const Icon(Icons.download),
                  label: Text(_importing ? 'Importing…' : 'Import ${_selected.length} selected'),
                ),
              ),
            ),
      body: LoadView<GithubNew>(
        load: (api) => api.githubNew(),
        builder: (context, data, reload) => ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(12),
          children: [
            Padding(
              padding: const EdgeInsets.all(8),
              child: Text(
                data.repos.isEmpty
                    ? 'Everything on github.com/${data.username} (${data.total} repositories) is already in your projects.'
                    : '${data.repos.length} of ${data.total} repositories on github.com/${data.username} are not in your portfolio yet. '
                        'Imported projects get the name, date, stack and description from GitHub; you can polish them afterwards.',
              ),
            ),
            for (final repo in data.repos)
              Card(
                child: CheckboxListTile(
                  value: _selected.contains(repo.name),
                  onChanged: (checked) => setState(() {
                    if (checked == true) {
                      _selected.add(repo.name);
                    } else {
                      _selected.remove(repo.name);
                    }
                  }),
                  title: Text(repo.name),
                  subtitle: Text(
                    [
                      if (repo.stack.isNotEmpty) repo.stack,
                      if (repo.period.isNotEmpty) repo.period,
                      if (repo.description.isNotEmpty) repo.description,
                    ].join('\n'),
                    maxLines: 4,
                    overflow: TextOverflow.ellipsis,
                  ),
                  isThreeLine: true,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
