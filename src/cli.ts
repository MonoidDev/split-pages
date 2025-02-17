#!/usr/bin/env node
import path from "path";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { SplitPagesInputOptions } from ".";
import { build } from "./build";
import { SplitPagesOptions } from "./types";
import { pathToFileURL } from "url";

interface Argv {
  config: string;
}

const main = () => {
  const finalArgv =
    process.argv[0] === "split-pages"
      ? ["node", ...process.argv]
      : process.argv;

  yargs(hideBin(finalArgv))
    .command(
      "build [config]",
      "build the pages. ",
      ((y: any) => {
        y.positional("config", {
          description: "path to the config, default to be pages.config.js",
          type: "string",
          default: "pages.config.js",
          normalize: true,
        });
      }) as any,
      (async (argv: Argv) => {
        const { config: configPath } = argv;

        let inputOptions: SplitPagesInputOptions;
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          // eslint-disable-next-line import/no-dynamic-require
          inputOptions = require(path.resolve(process.cwd(), configPath));
        } catch (e) {
          if ((e as any).code === "ERR_REQUIRE_ESM") {
            inputOptions = (
              await import(pathToFileURL(path.resolve(process.cwd(), configPath)).toString())
            ).default;
          } else {
            throw e;
          }
        }

        const options: SplitPagesOptions = {
          chunkPrefixes: [],
          outDir: ".split-pages/",
          ...inputOptions,
        };

        await build(options);
      }) as any
    )
    .help()
    .demand(1, "Must provide a valid command")
    .parse();
};

main();
