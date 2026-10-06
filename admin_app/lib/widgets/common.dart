import 'package:flutter/material.dart';

import '../api.dart';
import '../app_state.dart';
import '../main.dart';

void showSnack(BuildContext context, String message, {bool error = false}) {
  final messenger = ScaffoldMessenger.of(context);
  messenger
    ..hideCurrentSnackBar()
    ..showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: error ? Theme.of(context).colorScheme.error : null,
        behavior: SnackBarBehavior.floating,
      ),
    );
}

String errorText(Object error) => error is ApiException ? error.message : 'Something went wrong. Please try again.';

Future<bool> confirm(
  BuildContext context, {
  required String title,
  required String message,
  String action = 'Delete',
}) async {
  final result = await showDialog<bool>(
    context: context,
    builder: (ctx) => AlertDialog(
      title: Text(title),
      content: Text(message),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
        FilledButton(onPressed: () => Navigator.pop(ctx, true), child: Text(action)),
      ],
    ),
  );
  return result ?? false;
}

/// Loads data on first build and on pull-to-refresh, with a friendly error + retry state.
class LoadView<T> extends StatefulWidget {
  const LoadView({super.key, required this.load, required this.builder});

  final Future<T> Function(AdminApi api) load;
  final Widget Function(BuildContext context, T data, Future<void> Function() reload) builder;

  @override
  State<LoadView<T>> createState() => _LoadViewState<T>();
}

class _LoadViewState<T> extends State<LoadView<T>> {
  T? _data;
  Object? _error;
  bool _loading = true;
  bool _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_started) {
      _started = true;
      _reload();
    }
  }

  Future<void> _reload() async {
    final AppState state = AppScope.of(context);
    final api = state.api;
    if (api == null) {
      if (mounted) {
        setState(() {
          _loading = false;
          _error = ApiException('Open Settings and enter your server address and admin key first.');
        });
      }
      return;
    }
    if (mounted) setState(() => _loading = true);
    try {
      final data = await widget.load(api);
      if (!mounted) return;
      setState(() {
        _data = data;
        _error = null;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e;
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading && _data == null) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null && _data == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.cloud_off, size: 48),
              const SizedBox(height: 12),
              Text(errorText(_error!), textAlign: TextAlign.center),
              const SizedBox(height: 16),
              FilledButton.icon(onPressed: _reload, icon: const Icon(Icons.refresh), label: const Text('Try again')),
            ],
          ),
        ),
      );
    }
    return RefreshIndicator(
      onRefresh: _reload,
      child: widget.builder(context, _data as T, _reload),
    );
  }
}

/// Convenience for event handlers: the API for the saved settings.
AdminApi apiOf(BuildContext context) {
  final api = AppScope.of(context).api;
  if (api == null) throw ApiException('Open Settings and enter your server address and admin key first.');
  return api;
}
