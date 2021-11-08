import prettier from 'prettier';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { Macro, TitleFn } from 'ava';

/**
 * format the contents of an astro file
 */
function format(contents: string, options: prettier.Options = {}): string {
  try {
    return prettier.format(contents, {
      parser: 'astro',
      plugins: [fileURLToPath(new URL('../', import.meta.url).toString())],
      ...options,
    });
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    if (typeof e === 'string') {
      throw new Error(e);
    }
  }
  return '';
}

function markdownFormat(contents: string, options: prettier.Options = {}): string {
  try {
    return prettier.format(contents, {
      parser: 'markdown',
      plugins: [fileURLToPath(new URL('../', import.meta.url).toString())],
      ...options,
    });
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    if (typeof e === 'string') {
      throw new Error(e);
    }
  }
  return '';
}

async function readFile(path: string) {
  const res = await fs.readFile(fileURLToPath(new URL(`./fixtures${path}`, import.meta.url).toString()));
  return res.toString().replace(/\r\n/g, '\n');
}

/**
 * Utility to get `[src, out]` files
 */
async function getFiles(name: string) {
  const [src, out] = await Promise.all([readFile(`/${name}/input.astro`), readFile(`/${name}/output.astro`)]);
  return [src, out];
}

async function getOptions(name: string) {
  let options: object;
  try {
    options = JSON.parse(await readFile(`/${name}/options.json`));
  } catch (e) {
    options = {};
  }
  return options;
}

async function getMarkdownFiles(name: string) {
  const [src, out] = await Promise.all([readFile(`/${name}/input.md`), readFile(`/${name}/output.md`)]);
  return [src, out];
}

/**
 * Macro title function for nice formatting
 */
const title: TitleFn<[string]> = (providedTitle, name: string | undefined) => `${providedTitle}:

 - input: fixtures/${name}/input.astro
 - output: fixtures/${name}/output.astro`;

/**
 * Macro for testing fixtures
 */
export const Prettier: Macro<[string]> = {
  exec: async (t, name) => {
    const [src, out] = await getFiles(name);
    t.not(src, out, 'Unformated file and formated file are the same');

    const options = await getOptions(name);

    const formatted = format(src, options);
    t.is(formatted, out, 'Incorrect formating');
    // test that our formatting is idempotent
    const formattedTwice = format(formatted, options);
    t.is(formatted, formattedTwice, 'Formatting is not idempotent');
  },
  title,
};

export const PrettierUnaltered: Macro<[string]> = {
  exec: async (t, name) => {
    const [src, out] = await getFiles(name);
    t.is(src, out, 'Unformated file and formated file are not the same'); // the output should be unchanged

    const options = await getOptions(name);

    const formatted = format(src, options);
    t.is(formatted, out, 'Incorrect formating');
    // test that our formatting is idempotent
    const formattedTwice = format(formatted);
    t.is(formatted, formattedTwice, 'Formatting is not idempotent');
  },
  title,
};

export const PrettierMarkdown: Macro<[string]> = {
  exec: async (t, name) => {
    const [src, out] = await getMarkdownFiles(name);
    t.not(src, out, 'Unformated file and formated file are the same');

    const options = await getOptions(name);

    const formatted = markdownFormat(src, options);
    t.is(formatted, out, 'Incorrect formating');
    // test that our formatting is idempotent
    const formattedTwice = markdownFormat(formatted, options);
    t.is(formatted, formattedTwice, 'Formatting is not idempotent');
  },
  title: (providedTitle, name) => `${providedTitle}:

- input: fixtures/${name}/input.md
- output: fixtures/${name}/output.md`,
};
