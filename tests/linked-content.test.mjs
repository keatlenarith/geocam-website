import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/visual-cms/linked-content.ts', import.meta.url), 'utf8')
  .replace(/import \{ translateText \} from "[^"]+";/, 'const translateText = value => "KM:" + value;');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { updateLinkedField, acceptTranslation, approveTranslation, linkedEntry, pageChanges, rebaseDraft } =
  await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));

const text = (value, extra = {}) => ({ kind: 'text', value, ...extra });

test('Bilingual content: preserves manually corrected Khmer when English changes and requires review', () => {
  const before = {
    '/::en': { title: text('Original Title') },
    '/::km': {
      title: text('Manually Corrected Khmer', { manuallyEdited: true, status: 'Approved' }),
      other: text('Other Section', { manuallyEdited: true, status: 'Approved' }),
    },
  };

  // English source changes:
  const changed = updateLinkedField(before, '/::en', 'title', text('Updated English Title'));

  // English is updated:
  assert.equal(changed['/::en'].title.value, 'Updated English Title');

  // Manual Khmer translation is PRESERVED, marked 'Needs Review', with suggested translation attached!
  assert.equal(changed['/::km'].title.value, 'Manually Corrected Khmer');
  assert.equal(changed['/::km'].title.status, 'Needs Review');
  assert.equal(changed['/::km'].title.suggestedValue, 'KM:Updated English Title');
  assert.equal(changed['/::km'].title.sourceValue, 'Updated English Title');

  // Other unrelated Khmer fields remain completely untouched
  assert.deepEqual(changed['/::km'].other, text('Other Section', { manuallyEdited: true, status: 'Approved' }));

  // Accept suggested translation helper:
  const accepted = acceptTranslation(changed, '/', 'title');
  assert.equal(accepted['/::km'].title.value, 'KM:Updated English Title');
  assert.equal(accepted['/::km'].title.status, 'Approved');
  assert.equal(accepted['/::km'].title.suggestedValue, undefined);

  // Or approve current manual translation helper:
  const approved = approveTranslation(changed, '/', 'title');
  assert.equal(approved['/::km'].title.value, 'Manually Corrected Khmer');
  assert.equal(approved['/::km'].title.status, 'Approved');
  assert.equal(approved['/::km'].title.suggestedValue, undefined);
});

test('Administrators edit Khmer independently without modifying English', () => {
  const current = {
    '/::en': { title: text('English Source') },
    '/::km': { title: text('Khmer Translation', { status: 'Needs Review', suggestedValue: 'KM:English Source' }) },
  };

  // Admin edits Khmer text independently:
  const updatedKm = updateLinkedField(current, '/::km', 'title', text('Independent Khmer Edit'));

  // Khmer is updated to 'Independent Khmer Edit' and marked Approved:
  assert.equal(updatedKm['/::km'].title.value, 'Independent Khmer Edit');
  assert.equal(updatedKm['/::km'].title.status, 'Approved');
  assert.equal(updatedKm['/::km'].title.manuallyEdited, true);

  // English source is completely unchanged:
  assert.equal(updatedKm['/::en'].title.value, 'English Source');
});

test('Shared layout and design changes apply to both languages while keeping text separate', () => {
  const current = {
    '/::en': { hero: text('English Headline', { width: '800px', style: 'font-serif' }) },
    '/::km': { hero: text('Khmer Headline', { width: '800px', style: 'font-serif' }) },
  };

  // Updating layout in English (e.g. style change) propagates to Khmer while text remains separate:
  const withStyle = updateLinkedField(current, '/::en', 'hero', text('English Headline', { width: '1200px', style: 'font-sans' }));
  assert.equal(withStyle['/::en'].hero.width, '1200px');
  assert.equal(withStyle['/::en'].hero.value, 'English Headline');
  assert.equal(withStyle['/::km'].hero.width, '1200px');
  assert.equal(withStyle['/::km'].hero.value, 'Khmer Headline'); // Khmer text preserved

  // Updating layout in Khmer propagates to English while text remains separate:
  const fromKm = updateLinkedField(withStyle, '/::km', 'hero', text('Khmer Headline', { width: '100%', style: 'font-sans' }));
  assert.equal(fromKm['/::km'].hero.width, '100%');
  assert.equal(fromKm['/::en'].hero.width, '100%');
  assert.equal(fromKm['/::en'].hero.value, 'English Headline'); // English text untouched
});

test('Images use one English source in both languages; empty text remains intentionally empty', () => {
  const image = { kind: 'image', value: 'https://example.org/geology.png' };
  const changed = updateLinkedField({ '/::km': { photo: { kind: 'image', value: 'old' } } }, '/::km', 'photo', image);
  assert.equal(changed['/::km'].photo, undefined);
  assert.deepEqual(linkedEntry(changed, '/', 'en', 'photo'), image);
  assert.deepEqual(linkedEntry(changed, '/', 'km', 'photo'), image);
  assert.deepEqual(linkedEntry({ '/::en': { title: text('') } }, '/', 'en', 'title'), text(''));
});

test('Page patches exclude unapproved typography and preserve unrelated concurrent fields', () => {
  const live = { '/::en': { title: text('Live'), removed: text('Old') }, __appearance: { englishFont: text('arial') } };
  const draft = { '/::en': { title: text('Revised') }, __appearance: { englishFont: text('georgia') } };
  assert.deepEqual(pageChanges(draft, live), { '/::en': { title: text('Revised'), removed: null } });
  const baseline = { '/::en': { title: text('Live') } };
  const local = { '/::en': { title: text('Local draft') } };
  const server = { '/::en': { title: text('Live'), newer: text('Other editor') } };
  assert.deepEqual(rebaseDraft(server, baseline, local), { '/::en': { title: text('Local draft'), newer: text('Other editor') } });
});

test('Subroutes strictly isolate their content and do not bleed into or inherit from unprefixed keys', () => {
  const tectonicImage = { kind: 'image', value: 'https://example.org/tectonic-map.png' };
  const store = {
    '/research::en': {
      'div:0/article:0/figure:0/img:0': tectonicImage,
      'sub:topic-tectonics:div:0/article:0/figure:0/img:0': tectonicImage,
    },
  };
  // Geochemistry subroute query must NOT inherit the unprefixed tectonicImage
  assert.equal(linkedEntry(store, '/research', 'en', 'sub:topic-geochemistry:div:0/article:0/figure:0/img:0'), undefined);
  // Mineral deposits subroute query must NOT inherit the unprefixed tectonicImage
  assert.equal(linkedEntry(store, '/research', 'en', 'sub:topic-mineral-deposits:div:0/article:0/figure:0/img:0'), undefined);
  // Tectonics query gets its own image
  assert.deepEqual(linkedEntry(store, '/research', 'en', 'sub:topic-tectonics:div:0/article:0/figure:0/img:0'), tectonicImage);
});
