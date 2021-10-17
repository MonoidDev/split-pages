import fs from 'fs/promises';
import path from 'path';

import walk from 'walkdir';

import { generateChunk } from './generateChunk';
import { generateIndex } from './generateIndex';
import { generateMeta } from './generateMeta';
import { Chunk, Page, SplitPagesOptions } from './types';

export const build = async (options: SplitPagesOptions): Promise<void> => {
  const chunks = new Map<string, Chunk>();
  const pages: Page[] = [];

  walk.sync(options.pageRoot, (source, stat) => {
    if (stat.isDirectory()) {
      return;
    }

    const ext = path.extname(source);
    const url = `/${path.relative(options.pageRoot, source).replace(ext, '')}`;
    const importName = `${url.replace(/[/.]/g, '_')}`;

    if (/\.pagemeta\.tsx$/.test(source)) {
      if (/index\.pagemeta\.tsx?$/.test(path.basename(source))) {
        const page: Page = {
          source,
          url: path.dirname(url),
          componentName: '',
          isDirectory: true,
          importName,
        };

        pages.push(page);
      }

      return;
    }

    if (/\.tsx$/.test(source)) {
      const componentName = path.basename(source).replace(ext, '');
      const prefix = options.chunkPrefixes.find((p) => url.startsWith(p)) ?? '/';

      const page: Page = {
        source,
        url,
        componentName,
        importName,
        isDirectory: false,
      };

      pages.push(page);

      if (!chunks.has(prefix)) {
        const filename = prefix === '/' ? 'default' : prefix;
        chunks.set(prefix, {
          prefix,
          path: path.join(options.outDir, `${filename}.tsx`),
          pages: [],
          importName: `Chunk_${filename.replace('/', '_')}`,
          isLazy: prefix !== '/',
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const chunk = chunks.get(prefix)!;
      chunk.pages.push(page);
    }
  });

  try {
    await fs.access(options.outDir);
    await fs.rmdir(options.outDir, {
      recursive: true,
    });
  } catch (_e) {
    //
  }

  for (const [, chunk] of chunks) {
    await generateChunk(options, chunk);
  }

  await generateIndex(
    options,
    path.join(options.outDir, 'index.tsx'),
    [...chunks.values()],
  );

  await generateMeta(
    options,
    path.join(options.outDir, 'meta.ts'),
    pages,
  );
};
