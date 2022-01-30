import fs from 'fs/promises';
import path from 'path';

import type { Page, SplitPagesOptions } from './types';
import { formatCode, relativeImport } from './utils';

export const generateMeta = async (
  _options: SplitPagesOptions,
  metaPath: string,
  pages: Page[],
): Promise<void> => {
  const lines: string[] = [];

  lines.push(`import { OutputOf } from '@monoid-dev/reform';`);
  lines.push(`import { createUrl } from '@monoid-dev/split-pages/client';`);

  for (const page of pages) {
    const importPath = relativeImport(metaPath, page.source);

    lines.push(
      `import type { ${page.componentName} as ${page.importName} } from ${JSON.stringify(
        importPath,
      )}`,
    );
  }

  lines.push('export type PageProps = {');

  for (const page of pages) {
    lines.push(`
      ${JSON.stringify(page.url)}: OutputOf<(typeof ${page.importName})['__R']>; 
    `);
  }

  lines.push('};');

  lines.push('export type AppUrl = keyof PageProps;');

  lines.push(`
    export function url<U extends AppUrl>(pathname: U, props: PageProps[U]) {
      return createUrl(pathname, props);
    }
  `);

  await fs.mkdir(path.dirname(metaPath), {
    recursive: true,
  });

  const code = lines.join('\n');

  await fs.writeFile(metaPath, formatCode(code));
};
