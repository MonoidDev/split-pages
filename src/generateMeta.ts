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
    type OmitIfNotOptional<T extends object> = {
      [Key in keyof T as undefined extends T[Key] ? Key : never]: T[Key];
    };
    
    type OmitIfOptional<T extends object> = {
      [Key in keyof T as undefined extends T[Key] ? never : Key]: T[Key];
    };
    
    // eslint-disable-next-line @typescript-eslint/ban-types
    type PassThroughUnion = String | Number | Date | Function | RegExp; // May be completed with other builtin classes.
    
    export type MakeUndefinableFieldsOptional<
      T,
      ExtraPassThroughTypes = never,
    > = T extends PassThroughUnion | ExtraPassThroughTypes
      ? T
      : T extends (infer E)[]
      ? MakeUndefinableFieldsOptional<E>[]
      : T extends object
      ? {
          [Key in keyof OmitIfOptional<T>]: MakeUndefinableFieldsOptional<T[Key]>;
        } & {
          [Key in keyof OmitIfNotOptional<T>]?: MakeUndefinableFieldsOptional<
            T[Key]
          >;
        }
      : T;

    export function url<U extends AppUrl>(pathname: U, props: MakeUndefinableFieldsOptional<PageProps[U]>) {
      return createUrl(pathname, props);
    }
  `);

  await fs.mkdir(path.dirname(metaPath), {
    recursive: true,
  });

  const code = lines.join('\n');

  await fs.writeFile(metaPath, formatCode(code));
};
