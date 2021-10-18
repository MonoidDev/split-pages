/* eslint-disable @typescript-eslint/no-var-requires */
const pkg = require('./package.json');

const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
  entryPoints: ['src/cli.ts'],
  bundle: true,
  platform: 'node',
  outfile: pkg.bin['split-pages'],
  plugins: [nodeExternalsPlugin()],
});