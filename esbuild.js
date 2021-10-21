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
].map((opts) => build({
  entryPoints: [
    'src/cli.ts',
    'src/index.ts',
  ],
  bundle: true,
  platform: 'node',
  plugins: [nodeExternalsPlugin()],
  ...opts,
}));

