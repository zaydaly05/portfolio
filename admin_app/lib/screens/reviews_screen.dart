import 'package:flutter/material.dart';

import '../api.dart';
import '../widgets/common.dart';

class ReviewsScreen extends StatelessWidget {
  const ReviewsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return LoadView<List<Review>>(
      load: (api) => api.reviews(),
      builder: (context, reviews, reload) => Scaffold(
        backgroundColor: Colors.transparent,
        floatingActionButton: FloatingActionButton.extended(
          onPressed: () => _edit(context, null, reload),
          icon: const Icon(Icons.add),
          label: const Text('Add'),
        ),
        body: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
          children: [
            Text('Reviews', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 4),
            Text('Tap to edit, swipe left to delete.', style: Theme.of(context).textTheme.bodySmall),
            const SizedBox(height: 12),
            if (reviews.isEmpty) const Padding(padding: EdgeInsets.all(24), child: Center(child: Text('No reviews in the database yet.'))),
            for (final review in reviews)
              Dismissible(
                key: ValueKey(review.id),
                direction: DismissDirection.endToStart,
                background: Container(
                  alignment: Alignment.centerRight,
                  padding: const EdgeInsets.only(right: 20),
                  color: Theme.of(context).colorScheme.error,
                  child: const Icon(Icons.delete, color: Colors.white),
                ),
                confirmDismiss: (_) async {
                  final ok = await confirm(context, title: 'Delete review?', message: 'Remove the review by ${review.name}? This cannot be undone.');
                  if (!ok || !context.mounted) return false;
                  try {
                    await apiOf(context).deleteReview(review.id);
                    if (context.mounted) showSnack(context, 'Review deleted');
                    return true;
                  } catch (e) {
                    if (context.mounted) showSnack(context, errorText(e), error: true);
                    return false;
                  }
                },
                onDismissed: (_) => reload(),
                child: Card(
                  child: ListTile(
                    title: Text(review.name),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${'★' * review.rating}${'☆' * (5 - review.rating)}  ${review.role}', style: const TextStyle(color: Colors.amber)),
                        const SizedBox(height: 4),
                        Text(review.comment, maxLines: 4, overflow: TextOverflow.ellipsis),
                      ],
                    ),
                    onTap: () => _edit(context, review, reload),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Future<void> _edit(BuildContext context, Review? existing, Future<void> Function() reload) async {
    final name = TextEditingController(text: existing?.name ?? '');
    final role = TextEditingController(text: existing?.role ?? '');
    final comment = TextEditingController(text: existing?.comment ?? '');
    var rating = existing?.rating ?? 5;
    final formKey = GlobalKey<FormState>();

    final saved = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setLocal) => Padding(
          padding: EdgeInsets.fromLTRB(16, 0, 16, MediaQuery.of(ctx).viewInsets.bottom + 16),
          child: Form(
            key: formKey,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(existing == null ? 'Add review' : 'Edit review', style: Theme.of(ctx).textTheme.titleLarge),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: name,
                    decoration: const InputDecoration(labelText: 'Name *', border: OutlineInputBorder()),
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(controller: role, decoration: const InputDecoration(labelText: 'Role', border: OutlineInputBorder())),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Text('Rating'),
                      const SizedBox(width: 8),
                      for (var i = 1; i <= 5; i++)
                        IconButton(
                          onPressed: () => setLocal(() => rating = i),
                          icon: Icon(i <= rating ? Icons.star : Icons.star_border, color: Colors.amber),
                        ),
                    ],
                  ),
                  TextFormField(
                    controller: comment,
                    minLines: 3,
                    maxLines: 8,
                    decoration: const InputDecoration(labelText: 'Comment *', border: OutlineInputBorder(), alignLabelWithHint: true),
                    validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
                  ),
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: () {
                      if (formKey.currentState!.validate()) Navigator.pop(ctx, true);
                    },
                    child: const Text('Save'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );

    if (saved != true || !context.mounted) return;
    try {
      final api = apiOf(context);
      if (existing == null) {
        await api.createReview(name.text.trim(), role.text.trim(), rating, comment.text.trim());
      } else {
        await api.updateReview(existing.id, name.text.trim(), role.text.trim(), rating, comment.text.trim());
      }
      await reload();
      if (context.mounted) showSnack(context, 'Review saved');
    } catch (e) {
      if (context.mounted) showSnack(context, errorText(e), error: true);
    }
  }
}
