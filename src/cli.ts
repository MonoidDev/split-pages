#!/usr/bin/env node
import { build } from './build';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { SplitPagesInputOptions } from '.';
import { SplitPagesOptions } from './types';

import path from 'path';

interface Argv {
  config: string;
}

const main = () => {
  const argv = process.argv[0] === 'split-pages'
    ? ['node', ...process.argv]
    : process.argv;

  yargs(hideBin(argv))
    .command(
      'build [config]',
      'build the pages. ',
      (y) => {
        y
          .positional('config', {
            description: 'path to the config, default to be pages.config.js',
            type: 'string',
            default: 'pages.config.js',
            normalize: true,
          });
      },
      async (argv: Argv) => {
        const {
          config: configPath,
        } = argv;

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const inputOptions: SplitPagesInputOptions = require(path.resolve(process.cwd(), configPath));

        const options: SplitPagesOptions = {
          chunkPrefixes: [],
          outDir: '.split-pages/',
          ...inputOptions,
        };

        await build(options);
      }
    )
    .help()
    .demand(1, "Must provide a valid command")
    .parse();

};

main();
