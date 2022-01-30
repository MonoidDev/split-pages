import { existsSync } from 'fs';
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

  const importNames = new Set<string>();

  pages.forEach((p) => {
    if (!existsSync(p.source.replace(/\.tsx$/, '.pagemeta.ts'))) {
      return;
    }

    const importPath = relativeImport(metaPath, p.source.replace('.tsx', '.pagemeta.tsx'));

    lines.push(`import { meta as ${p.importName} } from ${JSON.stringify(importPath)};`);

    importNames.add(p.importName);
  });

  lines.push('export const meta = [');

  pages.forEach((p) => {
    let meta: string;

    if (importNames.has(p.importName)) {
      meta = `...${p.importName}`;
    } else {
      meta = '';
    }

    lines.push(`
      {
        url: '${p.url}',
        name: '${p.componentName}',
        isDirectory: ${p.isDirectory},
        listed: true,
        staffOnly: false,
        superuserOnly: false,
        ${meta}
      },
    `);
  });

  lines.push('];');

  lines.push('export type AppUrl =');

  pages.forEach((p) => {
    lines.push(`| ${JSON.stringify(p.url)}`);
  });

  lines.push(';');

  lines.push('export const url = (u: AppUrl) => u;');

  const code = lines.join('\n');

  await fs.mkdir(path.dirname(metaPath), {
    recursive: true,
  });

  await fs.writeFile(metaPath, formatCode(code));
};
