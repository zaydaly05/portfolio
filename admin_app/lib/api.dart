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
  });

  final bool dbConnected;
  final List<String> overridden;
  final int? reviews;
  final int? messages;
  final int? stars;

  factory Summary.fromJson(Map<String, dynamic> json) => Summary(
        dbConnected: json['dbConnected'] == true,
        overridden: List<String>.from(json['overridden'] ?? const []),
        reviews: (json['reviews'] as num?)?.toInt(),
        messages: (json['messages'] as num?)?.toInt(),
        stars: (json['stars'] as num?)?.toInt(),
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

class CvStatus {
  const CvStatus({
    required this.status,
    required this.version,
    required this.runnerConfigured,
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
  final String? requestedAt;
  final String? builtAt;
  final String? reason;
  final String? error;
  final String? url;

  factory CvStatus.fromJson(Map<String, dynamic> json) => CvStatus(
        status: '${json['status'] ?? 'idle'}',
        version: (json['version'] as num?)?.toInt() ?? 0,
        runnerConfigured: json['runnerConfigured'] == true,
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
