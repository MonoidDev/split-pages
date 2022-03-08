import fs from 'fs/promises';
import path from 'path';

import type { Chunk, Page, SplitPagesOptions } from './types';
import { formatCode, relativeImport } from './utils';

export const generateChunk = async (options: SplitPagesOptions, chunk: Chunk): Promise<void> => {
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

  if (options.containerModule) {
    const containerModulePath = relativeImport(chunk.path, options.containerModule);

    lines.push(`import Container from ${JSON.stringify(containerModulePath)}`);
  }

  for (const page of chunk.pages) {
    const importPath = relativeImport(chunk.path, page.source);
    lines.push(
      `import { ${page.componentName} as ${page.importName} } from ${JSON.stringify(importPath)};`,
    );
  }

  const getRouteCode = (page: Page) => {
    const child = `<${page.importName} />`;

    return `
      <Route path="${page.url}" exact>
        ${options.containerModule ? `<Container>${child}</Container>` : child}
      </Route>
    `;
  };

  const switchCode = `
    <Switch>
      ${chunk.pages.map(getRouteCode).join('\n')}

      <Route
        path="*"
      >
      ${options.containerModule ? `<Container><NoMatch /></Container>` : `<NoMatch />`}
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
