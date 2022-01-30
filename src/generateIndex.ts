import fs from 'fs/promises';
import path from 'path';

import { Chunk, SplitPagesOptions } from './types';
import { formatCode, relativeImport } from './utils';

export const generateIndex = async (
  options: SplitPagesOptions,
  indexPath: string,
  chunks: Chunk[],
): Promise<void> => {
  const getChunkCode = (page: Chunk) => {
    return `
      <Route path="${page.prefix}">
        <${page.importName} />
      </Route>
    `;
  };

  const lines: string[] = [];

  const noMatchPath = relativeImport(indexPath, `${options.pageRoot}/NoMatch`);

  lines.push(`
    import React from 'react';
    import {
      Switch,
      Route,
      Redirect,
    } from 'react-router-dom';
    import { NoMatch } from ${JSON.stringify(noMatchPath)};
  `);

  for (const chunk of chunks) {
    if (!chunk.isLazy) {
      const importPath = relativeImport(indexPath, chunk.path);

      lines.push(`import ${chunk.importName} from ${JSON.stringify(importPath)};`);
    }
  }

  for (const chunk of chunks) {
    if (chunk.isLazy) {
      const importPath = relativeImport(indexPath, chunk.path);

      lines.push(
        `const ${chunk.importName} = React.lazy(() => import(${JSON.stringify(importPath)}))`,
      );
    }
  }

  lines.push('export default function SplitPagesIndex() {');

  lines.push(`
    return (
      <Switch>
        ${
          options.redirections
            ? Object.entries(options.redirections).map(
                ([p, target]) => `
          <Route
            path=${JSON.stringify(p)}
            exact
          >
            <Redirect to=${JSON.stringify(target)} />
          </Route>`,
              )
            : ''
        }

        ${[...chunks]
          .sort((a, b) => b.prefix.length - a.prefix.length)
          .map(getChunkCode)
          .join('\n')}

        <Route
          path="*"
        >
          <NoMatch />
        </Route>
      </Switch>
    );
  `);

  lines.push('}');

  const code = lines.join('\n');

  await fs.mkdir(path.dirname(indexPath), {
    recursive: true,
  });

  await fs.writeFile(indexPath, formatCode(code));
};
