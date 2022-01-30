import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

[
  {
    outdir: 'dist/esm',
    format: 'esm',
    outExtension: {
      '.js': '.mjs',
    },
  },
  {
    outdir: 'dist/cjs',
    format: 'cjs',
    outExtension: {
      '.js': '.cjs',
    },
  },
].map((opts) =>
  build({
    entryPoints: ['src/cli.ts', 'src/index.ts', 'src/client.ts'],
    bundle: true,
    platform: 'node',
    plugins: [
      nodeExternalsPlugin(),
      {
        name: 'run',
        setup(t) {
          t.onEnd(() => console.info('[esbuild] done'));
        },
      },
    ],
    watch: process.env.NODE_ENV === 'development',
    ...opts,
  }),
);
