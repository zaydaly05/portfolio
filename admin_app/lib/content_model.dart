/// Describes the editable sections of the portfolio and how to turn their JSON into forms.
library;

enum FieldKind { text, longText, number, stringList, json }

class SectionInfo {
  const SectionInfo({
    required this.key,
    required this.label,
    required this.icon,
    required this.titleKey,
    required this.template,
    this.subtitleKey,
    this.isObject = false,
  });

  final String key;
  final String label;
  final String icon;
  final String titleKey;
  final String? subtitleKey;
  final bool isObject;

  /// Typed blank item; defines the fields shown when adding something new.
  final Map<String, dynamic> template;
}

const List<SectionInfo> sections = [
  SectionInfo(
    key: 'projects',
    label: 'Projects',
    icon: '🚀',
    titleKey: 'name',
    subtitleKey: 'period',
    template: {'name': '', 'period': '', 'stack': '', 'image': '', 'github': '', 'description': ''},
  ),
  SectionInfo(
    key: 'experience',
    label: 'Experience',
    icon: '💼',
    titleKey: 'company',
    subtitleKey: 'role',
    template: {'company': '', 'role': '', 'period': '', 'location': '', 'points': <String>[]},
  ),
  SectionInfo(
    key: 'certificates',
    label: 'Certificates',
    icon: '📜',
    titleKey: 'title',
    subtitleKey: 'issuer',
    template: {'title': '', 'issuer': '', 'date': '', 'category': '', 'image': '', 'pdf': '', 'desc': ''},
  ),
  SectionInfo(
    key: 'featuredStack',
    label: 'Featured stack',
    icon: '⚡',
    titleKey: 'name',
    subtitleKey: 'category',
    template: {
      'name': '',
      'category': '',
      'level': 0,
      'color': '#6366f1',
      'icon': '',
      'projectsCount': 0,
      'highlights': '',
    },
  ),
  SectionInfo(
    key: 'technicalSkills',
    label: 'Technical skills',
    icon: '🛠️',
    titleKey: 'category',
    template: {'category': '', 'items': <String>[]},
  ),
  SectionInfo(
    key: 'softSkills',
    label: 'Soft skills',
    icon: '🤝',
    titleKey: 'title',
    template: {'title': '', 'icon': '', 'desc': ''},
  ),
  SectionInfo(
    key: 'languages',
    label: 'Languages',
    icon: '🌍',
    titleKey: 'name',
    subtitleKey: 'level',
    template: {'name': '', 'level': '', 'percent': 0, 'flag': '', 'desc': ''},
  ),
  SectionInfo(
    key: 'education',
    label: 'Education',
    icon: '🎓',
    titleKey: 'institution',
    subtitleKey: 'degree',
    template: {'institution': '', 'degree': '', 'period': ''},
  ),
  SectionInfo(
    key: 'activities',
    label: 'Activities',
    icon: '🏆',
    titleKey: 'name',
    subtitleKey: 'role',
    template: {'name': '', 'role': '', 'period': ''},
  ),
  SectionInfo(
    key: 'profile',
    label: 'Profile',
    icon: '👤',
    titleKey: 'name',
    isObject: true,
    template: {
      'name': '',
      'title': '',
      'location': '',
      'phone': '',
      'email': '',
      'linkedin': '',
      'github': '',
      'summary': '',
    },
  ),
];

SectionInfo sectionByKey(String key) => sections.firstWhere((s) => s.key == key);

const Set<String> _longTextKeys = {'description', 'desc', 'summary', 'highlights', 'comment', 'message'};

FieldKind fieldKindFor(String key, Object? value) {
  if (value is num) return FieldKind.number;
  if (value is List && value.every((e) => e is String)) return FieldKind.stringList;
  if (value is List || value is Map || value is bool) return FieldKind.json;
  if (_longTextKeys.contains(key) || (value is String && value.length > 80)) return FieldKind.longText;
  return FieldKind.text;
}

/// "projectsCount" -> "Projects count"
String humanizeKey(String key) {
  final spaced = key.replaceAllMapped(RegExp(r'([a-z0-9])([A-Z])'), (m) => '${m[1]} ${m[2]}');
  if (spaced.isEmpty) return key;
  return spaced[0].toUpperCase() + spaced.substring(1).toLowerCase();
}

/// Returns a copy of [item] that also has every template field (template fields first, then extras).
Map<String, dynamic> mergeWithTemplate(Map<String, dynamic> item, Map<String, dynamic> template) {
  final merged = <String, dynamic>{};
  for (final entry in template.entries) {
    final existing = item[entry.key];
    merged[entry.key] = item.containsKey(entry.key) ? existing : _blankCopy(entry.value);
  }
  for (final entry in item.entries) {
    merged.putIfAbsent(entry.key, () => entry.value);
  }
  return merged;
}

Object? _blankCopy(Object? value) {
  if (value is List) return <String>[];
  return value;
}

/// Splits multi-line text into a clean list: trims lines and drops empty ones.
List<String> parseLines(String text) =>
    text.split('\n').map((l) => l.trim()).where((l) => l.isNotEmpty).toList();

/// Parses a number field; empty text means 0. Returns null when the text is not a number.
num? parseNumber(String text) {
  final trimmed = text.trim();
  if (trimmed.isEmpty) return 0;
  return num.tryParse(trimmed);
}

/// Prepares an edited item for saving: trims text and drops optional fields left empty.
Map<String, dynamic> cleanItem(Map<String, dynamic> item, {required String requiredKey}) {
  final cleaned = <String, dynamic>{};
  item.forEach((key, value) {
    if (value is String) {
      final trimmed = value.trim();
      if (trimmed.isEmpty && key != requiredKey) return;
      cleaned[key] = trimmed;
    } else if (value is List && value.isEmpty) {
      return;
    } else {
      cleaned[key] = value;
    }
  });
  return cleaned;
}
