import { test } from '../test-utils';

const files = import.meta.glob('/test/fixtures/styles/*/*', {
  assert: { type: 'raw' },
});

// test('can format a basic Astro file with styles',  'with-styles');

test(
  `Can format an Astro file with attributes in the <style> tag`,
  files,
  'styles/style-tag-attributes'
);

// test('can format a basic Astro file with .scss styles',  'with-scss');

test(
  'can format a basic Astro file with .scss styles',
  files,
  'styles/single-style-element-with-scss-lang'
);

test(
  "can clean up whitespace within .sass styles (but can't format them)",
  files,
  'styles/single-style-element-with-sass-lang'
);

// test('can clean up whitespace within .sass styles (but can’t format them)',  'with-sass');

// test('can format a basic Astro file with styles written in .sass',  'with-indented-sass');

// test('Can format nested style tag content',  'format-nested-style-tag-content');

// test('Can format nested sass style tag content',  'format-nested-sass-style-tag-content');
