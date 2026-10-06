import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_admin/content_model.dart';
import 'package:portfolio_admin/settings_store.dart';

void main() {
  test('every section has a template containing its title field', () {
    for (final info in sections) {
      expect(info.template.containsKey(info.titleKey), isTrue, reason: info.key);
      if (info.subtitleKey != null) expect(info.template.containsKey(info.subtitleKey), isTrue, reason: info.key);
    }
    expect(sections.map((s) => s.key).toSet().length, sections.length);
  });

  test('field kinds follow the value type', () {
    expect(fieldKindFor('level', 88), FieldKind.number);
    expect(fieldKindFor('featured', true), FieldKind.boolean);
    expect(fieldKindFor('home_intro_text', 'x'), FieldKind.longText);
    expect(fieldKindFor('projects_intro', 'x'), FieldKind.longText);
    expect(fieldKindFor('points', ['a', 'b']), FieldKind.stringList);
    expect(fieldKindFor('points', <String>[]), FieldKind.stringList);
    expect(fieldKindFor('meta', {'a': 1}), FieldKind.json);
    expect(fieldKindFor('description', 'x'), FieldKind.longText);
    expect(fieldKindFor('name', 'x'), FieldKind.text);
    expect(fieldKindFor('name', 'y' * 120), FieldKind.longText);
  });

  test('every section the server knows about is editable in the app', () {
    expect(
      sections.map((s) => s.key).toSet(),
      {
        'profile', 'education', 'activities', 'experience', 'projects', 'featuredStack', 'technicalSkills',
        'softSkills', 'languages', 'certificates', 'site', 'heroPills', 'heroBadges', 'heroSlides', 'stats',
        'gateways', 'faq', 'cvSummary', 'cvExperience', 'cvProjects', 'cvSkills', 'cvSoftSkills', 'cvEducation',
        'cvLanguages',
      },
    );
    expect(sectionByKey('site').isObject, isTrue);
    expect(sections.where((s) => s.group == 'CV (PDF)').length, 7);
    expect(sectionByKey('cvProjects').group, 'CV (PDF)');
    expect(sectionByKey('projects').group, 'Website');
    expect(sectionByKey('profile').isObject, isTrue);
  });

  test('humanizeKey makes readable labels', () {
    expect(humanizeKey('projectsCount'), 'Projects count');
    expect(humanizeKey('name'), 'Name');
    expect(humanizeKey('home_eyebrow'), 'Home_eyebrow');
  });

  test('mergeWithTemplate adds missing fields and keeps extras', () {
    final merged = mergeWithTemplate({'name': 'P', 'extra': 1}, sectionByKey('projects').template);
    expect(merged.keys.first, 'name');
    expect(merged['github'], '');
    expect(merged['extra'], 1);
    final exp = mergeWithTemplate({'company': 'X'}, sectionByKey('experience').template);
    expect(exp['points'], <String>[]);
  });

  test('parseLines and parseNumber', () {
    expect(parseLines('  a \n\n b\n'), ['a', 'b']);
    expect(parseNumber(''), 0);
    expect(parseNumber('12.5'), 12.5);
    expect(parseNumber('abc'), isNull);
  });

  test('cleanItem trims and drops empty optional fields but keeps the required one', () {
    final cleaned = cleanItem(
      {'name': '  Proj ', 'github': '  ', 'points': <String>[], 'level': 0, 'stack': 'Dart'},
      requiredKey: 'name',
    );
    expect(cleaned, {'name': 'Proj', 'level': 0, 'stack': 'Dart'});
  });

  test('server address is normalised', () {
    expect(ServerSettings.normalizeUrl(' my-site.vercel.app/ '), 'https://my-site.vercel.app');
    expect(ServerSettings.normalizeUrl('http://192.168.1.5:3000//'), 'http://192.168.1.5:3000');
    expect(ServerSettings.normalizeUrl(''), '');
    expect(const ServerSettings(baseUrl: 'https://x', adminKey: '').isConfigured, isFalse);
  });
}
