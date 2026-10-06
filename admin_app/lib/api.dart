import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

/// Thrown for any failed admin request; [message] is safe to show to the user.
class ApiException implements Exception {
  ApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

class Summary {
  const Summary({
    required this.dbConnected,
    required this.overridden,
    this.reviews,
    this.messages,
    this.stars,
    this.pendingChanges,
    this.contacts,
  });

  final bool dbConnected;
  final List<String> overridden;
  final int? reviews;
  final int? messages;
  final int? stars;
  final int? pendingChanges;
  final int? contacts;

  factory Summary.fromJson(Map<String, dynamic> json) => Summary(
        dbConnected: json['dbConnected'] == true,
        overridden: List<String>.from(json['overridden'] ?? const []),
        reviews: (json['reviews'] as num?)?.toInt(),
        messages: (json['messages'] as num?)?.toInt(),
        stars: (json['stars'] as num?)?.toInt(),
        pendingChanges: (json['pendingChanges'] as num?)?.toInt(),
        contacts: (json['contacts'] as num?)?.toInt(),
      );
}

class PortfolioContent {
  const PortfolioContent({required this.sections, required this.overridden});

  /// Section name -> list (most sections) or map (profile).
  final Map<String, dynamic> sections;
  final List<String> overridden;
}

class Review {
  const Review({
    required this.id,
    required this.name,
    required this.role,
    required this.rating,
    required this.comment,
    required this.date,
  });

  final String id;
  final String name;
  final String role;
  final int rating;
  final String comment;
  final String date;

  factory Review.fromJson(Map<String, dynamic> json) => Review(
        id: '${json['id']}',
        name: '${json['name'] ?? ''}',
        role: '${json['role'] ?? ''}',
        rating: (json['rating'] as num?)?.toInt() ?? 5,
        comment: '${json['comment'] ?? ''}',
        date: '${json['date'] ?? ''}',
      );
}

class ContactMessage {
  const ContactMessage({
    required this.id,
    required this.name,
    required this.email,
    required this.message,
    required this.createdAt,
  });

  final String id;
  final String name;
  final String email;
  final String message;
  final DateTime? createdAt;

  factory ContactMessage.fromJson(Map<String, dynamic> json) => ContactMessage(
        id: '${json['id']}',
        name: '${json['name'] ?? ''}',
        email: '${json['email'] ?? ''}',
        message: '${json['message'] ?? ''}',
        createdAt: DateTime.tryParse('${json['createdAt'] ?? ''}'),
      );
}

class LogEntry {
  const LogEntry({required this.level, required this.message, required this.timestamp});

  final String level;
  final String message;
  final DateTime? timestamp;

  factory LogEntry.fromJson(Map<String, dynamic> json) => LogEntry(
        level: '${json['level'] ?? 'info'}',
        message: '${json['message'] ?? ''}',
        timestamp: DateTime.tryParse('${json['timestamp'] ?? ''}'),
      );
}

/// A phone contact in the protected vault.
class VaultContact {
  const VaultContact({
    required this.id,
    required this.phone,
    required this.name,
    required this.notes,
    required this.status,
    required this.historyCount,
  });

  final String id;

  /// Digits only, with country code (e.g. 201017741741).
  final String phone;
  final String name;
  final String notes;

  /// active or trashed
  final String status;
  final int historyCount;

  bool get trashed => status == 'trashed';
  String get display => '+$phone';

  factory VaultContact.fromJson(Map<String, dynamic> json) => VaultContact(
        id: '${json['id']}',
        phone: '${json['phone'] ?? ''}',
        name: '${json['name'] ?? ''}',
        notes: '${json['notes'] ?? ''}',
        status: '${json['status'] ?? 'active'}',
        historyCount: (json['history'] as List?)?.length ?? 0,
      );
}

class ContactsPage {
  const ContactsPage({required this.contacts, required this.active, required this.trashed});

  final List<VaultContact> contacts;
  final int active;
  final int trashed;
}

class ImportResult {
  const ImportResult({required this.added, required this.restored, required this.duplicates, required this.invalid});

  final int added;
  final int restored;
  final int duplicates;
  final List<String> invalid;
}

class ContactsExport {
  const ContactsExport({required this.filename, required this.count, required this.csv});

  final String filename;
  final int count;
  final String csv;
}

/// One project inside a proposed change.
class ProposedProject {
  const ProposedProject({
    required this.name,
    required this.period,
    required this.stack,
    required this.description,
    required this.github,
  });

  final String name;
  final String period;
  final String stack;
  final String description;
  final String github;

  factory ProposedProject.fromJson(Map<String, dynamic> json) => ProposedProject(
        name: '${json['name'] ?? ''}',
        period: '${json['period'] ?? ''}',
        stack: '${json['stack'] ?? ''}',
        description: '${json['description'] ?? ''}',
        github: '${json['github'] ?? ''}',
      );
}

/// An automatic change (new GitHub repositories) waiting for the owner's decision.
class ChangeProposal {
  const ChangeProposal({
    required this.code,
    required this.status,
    required this.summary,
    required this.projects,
    this.error,
  });

  final String code;

  /// pending, applied, rejected or failed
  final String status;
  final String summary;
  final List<ProposedProject> projects;
  final String? error;

  factory ChangeProposal.fromJson(Map<String, dynamic> json) {
    final payload = Map<String, dynamic>.from(json['payload'] ?? const {});
    return ChangeProposal(
      code: '${json['code'] ?? ''}',
      status: '${json['status'] ?? 'pending'}',
      summary: '${json['summary'] ?? ''}',
      error: json['error'] as String?,
      projects: (payload['projects'] as List? ?? const [])
          .map((e) => ProposedProject.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList(),
    );
  }
}

class SyncResult {
  const SyncResult({required this.checked, this.createdCode, this.notified = false});

  final int checked;
  final String? createdCode;
  final bool notified;
}

class CvStatus {
  const CvStatus({
    required this.status,
    required this.version,
    required this.runnerConfigured,
    this.pages,
    this.requestedAt,
    this.builtAt,
    this.reason,
    this.error,
    this.url,
  });

  /// idle, requested, done or failed
  final String status;
  final int version;
  final bool runnerConfigured;

  /// Page count of the last build (the CV is designed to fit on one page).
  final int? pages;
  final String? requestedAt;
  final String? builtAt;
  final String? reason;
  final String? error;
  final String? url;

  factory CvStatus.fromJson(Map<String, dynamic> json) => CvStatus(
        status: '${json['status'] ?? 'idle'}',
        version: (json['version'] as num?)?.toInt() ?? 0,
        runnerConfigured: json['runnerConfigured'] == true,
        pages: (json['pages'] as num?)?.toInt(),
        requestedAt: json['requestedAt'] as String?,
        builtAt: json['builtAt'] as String?,
        reason: json['reason'] as String?,
        error: json['error'] as String?,
        url: json['url'] as String?,
      );
}

class GithubRepo {
  const GithubRepo({
    required this.name,
    required this.description,
    required this.language,
    required this.stars,
    required this.period,
    required this.stack,
  });

  final String name;
  final String description;
  final String language;
  final int stars;
  final String period;
  final String stack;

  factory GithubRepo.fromJson(Map<String, dynamic> json) {
    final project = Map<String, dynamic>.from(json['project'] ?? const {});
    return GithubRepo(
      name: '${json['name'] ?? ''}',
      description: '${json['description'] ?? ''}',
      language: '${json['language'] ?? ''}',
      stars: (json['stars'] as num?)?.toInt() ?? 0,
      period: '${project['period'] ?? ''}',
      stack: '${project['stack'] ?? ''}',
    );
  }
}

class GithubNew {
  const GithubNew({required this.username, required this.total, required this.repos});

  final String username;
  final int total;
  final List<GithubRepo> repos;
}

/// Client for the private `/api/admin/*` endpoints of the portfolio server.
class AdminApi {
  AdminApi({
    required String baseUrl,
    required this.adminKey,
    http.Client? client,
    this.timeout = const Duration(seconds: 20),
  })  : baseUrl = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl,
        _client = client ?? http.Client();

  final String baseUrl;
  final String adminKey;
  final Duration timeout;
  final http.Client _client;

  Map<String, String> get _headers => {
        'content-type': 'application/json',
        'accept': 'application/json',
        'x-admin-key': adminKey,
      };

  Future<Map<String, dynamic>> _send(String method, String path, {Object? body}) async {
    final uri = Uri.parse('$baseUrl$path');
    late http.Response response;
    try {
      final request = http.Request(method, uri)..headers.addAll(_headers);
      if (body != null) request.body = jsonEncode(body);
      final streamed = await _client.send(request).timeout(timeout);
      response = await http.Response.fromStream(streamed).timeout(timeout);
    } on TimeoutException {
      throw ApiException('The server did not answer in time. Check your connection.');
    } on FormatException {
      throw ApiException('The server address looks invalid.');
    } on http.ClientException catch (e) {
      throw ApiException('Could not reach the server (${e.message}).');
    } catch (e) {
      throw ApiException('Could not reach the server. Check the address and your connection.');
    }

    Map<String, dynamic> json = const {};
    try {
      final decoded = jsonDecode(utf8.decode(response.bodyBytes));
      if (decoded is Map<String, dynamic>) json = decoded;
    } catch (_) {
      // Non-JSON body (for example an HTML error page) is handled by the status checks below.
    }

    if (response.statusCode >= 200 && response.statusCode < 300 && json.isNotEmpty) {
      return json;
    }
    if (response.statusCode == 401) {
      throw ApiException('The admin key was rejected. Check it in Settings.', statusCode: 401);
    }
    if (response.statusCode == 429) {
      throw ApiException('Too many wrong attempts. Wait a few minutes and try again.', statusCode: 429);
    }
    final serverMessage = json['error'];
    if (serverMessage is String && serverMessage.isNotEmpty) {
      throw ApiException(serverMessage, statusCode: response.statusCode);
    }
    if (response.statusCode >= 200 && response.statusCode < 300) {
      throw ApiException('Unexpected reply. Is this the portfolio server address?', statusCode: response.statusCode);
    }
    throw ApiException('Server error (${response.statusCode}).', statusCode: response.statusCode);
  }

  Future<void> ping() => _send('GET', '/api/admin/ping');

  Future<Summary> summary() async => Summary.fromJson(await _send('GET', '/api/admin/summary'));

  Future<PortfolioContent> portfolio() async {
    final json = await _send('GET', '/api/admin/portfolio');
    return PortfolioContent(
      sections: Map<String, dynamic>.from(json['sections'] ?? const {}),
      overridden: List<String>.from(json['overridden'] ?? const []),
    );
  }

  /// Saves a section; returns true when the change also queued a CV rebuild.
  Future<bool> saveSection(String section, Object data) async {
    final json = await _send('PUT', '/api/admin/portfolio/$section', body: {'data': data});
    return json['cvBuildRequested'] == true;
  }

  Future<void> resetSection(String section) => _send('DELETE', '/api/admin/portfolio/$section');

  Future<List<ChangeProposal>> changes({String status = 'pending'}) async {
    final json = await _send('GET', '/api/admin/changes?status=$status');
    return (json['changes'] as List? ?? const [])
        .map((e) => ChangeProposal.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  /// Looks at GitHub now; a new proposal is created when there are new repositories.
  Future<SyncResult> syncChanges() async {
    final json = await _send('POST', '/api/admin/changes/sync');
    final created = json['created'];
    return SyncResult(
      checked: (json['checked'] as num?)?.toInt() ?? 0,
      createdCode: created is Map ? '${created['code']}' : null,
      notified: json['notified'] == true,
    );
  }

  Future<void> approveChange(String code) => _send('POST', '/api/admin/changes/$code/approve');

  Future<void> rejectChange(String code) => _send('POST', '/api/admin/changes/$code/reject');

  Future<void> editChange(String code, int index, Map<String, String> fields) =>
      _send('PATCH', '/api/admin/changes/$code', body: {'index': index, 'fields': fields});

  Future<ContactsPage> contacts({String status = 'active', String query = ''}) async {
    final json = await _send('GET', '/api/admin/contacts?status=$status&q=${Uri.encodeQueryComponent(query)}');
    final counts = Map<String, dynamic>.from(json['counts'] ?? const {});
    return ContactsPage(
      contacts: (json['contacts'] as List? ?? const [])
          .map((e) => VaultContact.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList(),
      active: (counts['active'] as num?)?.toInt() ?? 0,
      trashed: (counts['trashed'] as num?)?.toInt() ?? 0,
    );
  }

  Future<void> addContact(String phone, String name, String notes) =>
      _send('POST', '/api/admin/contacts', body: {'phone': phone, 'name': name, 'notes': notes});

  Future<ImportResult> importContacts(String text) async {
    final json = await _send('POST', '/api/admin/contacts/import', body: {'text': text});
    return ImportResult(
      added: (json['added'] as num?)?.toInt() ?? 0,
      restored: (json['restored'] as num?)?.toInt() ?? 0,
      duplicates: (json['duplicates'] as num?)?.toInt() ?? 0,
      invalid: List<String>.from(json['invalid'] ?? const []),
    );
  }

  Future<void> editContact(String id, {required String name, required String phone, required String notes}) =>
      _send('PUT', '/api/admin/contacts/$id', body: {'name': name, 'phone': phone, 'notes': notes});

  /// Moves a contact to the trash (it can always be restored; nothing is deleted for good).
  Future<void> trashContact(String id) => _send('DELETE', '/api/admin/contacts/$id');

  Future<void> restoreContact(String id) => _send('POST', '/api/admin/contacts/$id/restore');

  Future<ContactsExport> exportContacts() async {
    final json = await _send('GET', '/api/admin/contacts/export');
    return ContactsExport(
      filename: '${json['filename'] ?? 'contacts.csv'}',
      count: (json['count'] as num?)?.toInt() ?? 0,
      csv: '${json['csv'] ?? ''}',
    );
  }

  Future<CvStatus> cvStatus() async => CvStatus.fromJson(await _send('GET', '/api/admin/cv'));

  Future<void> rebuildCv() => _send('POST', '/api/admin/cv/rebuild');

  /// Public repositories on GitHub that are not in the portfolio's projects yet.
  Future<GithubNew> githubNew() async {
    final json = await _send('GET', '/api/admin/github/new');
    return GithubNew(
      username: '${json['username'] ?? ''}',
      total: (json['total'] as num?)?.toInt() ?? 0,
      repos: (json['repos'] as List? ?? const [])
          .map((e) => GithubRepo.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList(),
    );
  }

  /// Adds the named repositories to the projects; returns the names that were added.
  Future<List<String>> githubImport(List<String> repoNames) async {
    final json = await _send('POST', '/api/admin/github/import', body: {'repos': repoNames});
    return List<String>.from(json['added'] ?? const []);
  }

  Future<List<Review>> reviews() async {
    final json = await _send('GET', '/api/admin/reviews');
    return (json['reviews'] as List? ?? const [])
        .map((e) => Review.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  Map<String, dynamic> _reviewBody(String name, String role, int rating, String comment) =>
      {'name': name, 'role': role, 'rating': rating, 'comment': comment};

  Future<void> createReview(String name, String role, int rating, String comment) =>
      _send('POST', '/api/admin/reviews', body: _reviewBody(name, role, rating, comment));

  Future<void> updateReview(String id, String name, String role, int rating, String comment) =>
      _send('PUT', '/api/admin/reviews/$id', body: _reviewBody(name, role, rating, comment));

  Future<void> deleteReview(String id) => _send('DELETE', '/api/admin/reviews/$id');

  Future<List<ContactMessage>> messages() async {
    final json = await _send('GET', '/api/admin/messages');
    return (json['messages'] as List? ?? const [])
        .map((e) => ContactMessage.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  Future<void> deleteMessage(String id) => _send('DELETE', '/api/admin/messages/$id');

  Future<void> setStars(int stars) => _send('PUT', '/api/admin/stars', body: {'stars': stars});

  Future<List<LogEntry>> logs({int limit = 100}) async {
    final json = await _send('GET', '/api/logs?limit=$limit');
    return (json['logs'] as List? ?? const [])
        .map((e) => LogEntry.fromJson(Map<String, dynamic>.from(e as Map)))
        .toList();
  }

  Future<void> clearLogs() => _send('DELETE', '/api/logs');
}
