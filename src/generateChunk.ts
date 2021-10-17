import fs from 'fs/promises';
import path from 'path';

import type { Chunk, Page, SplitPagesOptions } from './types';
import { formatCode, relativeImport } from './utils';

export const generateChunk = async (
  options: SplitPagesOptions,
  chunk: Chunk,
): Promise<void> => {
  const lines: string[] = [];

  const noMatchPath = relativeImport(chunk.path, `${options.pageRoot}/NoMatch`);

  lines.push(`
    import React from 'react';
    import {
      Switch,
      Route,
    } from 'react-router-dom';
    import { NoMatch } from ${JSON.stringify(noMatchPath)};
  `);

  for (const page of chunk.pages) {
    const importPath = relativeImport(chunk.path, page.source);
    lines.push(`import { ${page.componentName} as ${page.importName} } from ${JSON.stringify(importPath)};`);
  }

  const getRouteCode = (page: Page) => {
    return `
      <Route path="${page.url}" exact>
        <${page.importName} />
      </Route>
    `;
  };

  const switchCode = `
    <Switch>
      ${chunk.pages.map(getRouteCode).join('\n')}

      <Route
        path="*"
      >
        <NoMatch />
      </Route>
    </Switch>
  `;

  lines.push(`
    export default function ${chunk.importName}() {
  `);

  lines.push(`
    return (
      ${switchCode}
    );
  `);

  lines.push(`
    }
  `);

  const code = lines.join('\n');

  await fs.mkdir(path.dirname(chunk.path), {
    recursive: true,
  });

  await fs.writeFile(chunk.path, formatCode(code));
};
