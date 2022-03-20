#!/usr/bin/env node
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});

// src/cli.ts
import path6 from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// src/build.ts
import fs4 from "fs/promises";
import path5 from "path";
import walk from "walkdir";

// src/generateChunk.ts
import fs from "fs/promises";
import path2 from "path";

// src/utils.ts
import path from "path";
import prettier from "prettier";
var formatCode = (code) => {
  return prettier.format(code, { parser: "babel-ts" });
};
var relativeImport = (importer, target) => {
  let importPath = path.relative(path.dirname(importer), target).replace(/\.tsx?/, "");
  if (!importPath.startsWith(".")) {
    importPath = `./${importPath}`;
  }
  return importPath;
};

// src/generateChunk.ts
var generateChunk = async (options, chunk) => {
  const lines = [];
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
    lines.push(`import { ${page.componentName} as ${page.importName} } from ${JSON.stringify(importPath)};`);
  }
  const getRouteCode = (page) => {
    const child = `<${page.importName} />`;
    return `
      <Route path="${page.url}" exact>
        ${options.containerModule ? `<Container>${child}</Container>` : child}
      </Route>
    `;
  };
  const switchCode = `
    <Switch>
      ${chunk.pages.map(getRouteCode).join("\n")}

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
  const code = lines.join("\n");
  await fs.mkdir(path2.dirname(chunk.path), {
    recursive: true
  });
  await fs.writeFile(chunk.path, formatCode(code));
};

// src/generateIndex.ts
import fs2 from "fs/promises";
import path3 from "path";
var generateIndex = async (options, indexPath, chunks) => {
  const getChunkCode = (page) => {
    return `
      <Route path="${page.prefix}">
        <${page.importName} />
      </Route>
    `;
  };
  const lines = [];
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
      lines.push(`const ${chunk.importName} = React.lazy(() => import(${JSON.stringify(importPath)}))`);
    }
  }
  lines.push("export default function SplitPagesIndex() {");
  lines.push(`
    return (
      <Switch>
        ${options.redirections ? Object.entries(options.redirections).map(([p, target]) => `
          <Route
            path=${JSON.stringify(p)}
            exact
          >
            <Redirect to=${JSON.stringify(target)} />
          </Route>`) : ""}

        ${[...chunks].sort((a, b) => b.prefix.length - a.prefix.length).map(getChunkCode).join("\n")}

        <Route
          path="*"
        >
          <NoMatch />
        </Route>
      </Switch>
    );
  `);
  lines.push("}");
  const code = lines.join("\n");
  await fs2.mkdir(path3.dirname(indexPath), {
    recursive: true
  });
  await fs2.writeFile(indexPath, formatCode(code));
};

// src/generateMeta.ts
import fs3 from "fs/promises";
import path4 from "path";
var generateMeta = async (_options, metaPath, pages) => {
  const lines = [];
  lines.push(`import { OutputOf } from '@monoid-dev/reform';`);
  lines.push(`import { createUrl } from '@monoid-dev/split-pages/client';`);
  for (const page of pages) {
    const importPath = relativeImport(metaPath, page.source);
    lines.push(`import type { ${page.componentName} as ${page.importName} } from ${JSON.stringify(importPath)}`);
  }
  lines.push("export type PageProps = {");
  for (const page of pages) {
    lines.push(`
      ${JSON.stringify(page.url)}: OutputOf<(typeof ${page.importName})['__R']>; 
    `);
  }
  lines.push("};");
  lines.push("export type AppUrl = keyof PageProps;");
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
  await fs3.mkdir(path4.dirname(metaPath), {
    recursive: true
  });
  const code = lines.join("\n");
  await fs3.writeFile(metaPath, formatCode(code));
};

// src/build.ts
var build = async (options) => {
  const chunks = /* @__PURE__ */ new Map();
  const pages = [];
  walk.sync(options.pageRoot, (source, stat) => {
    if (stat.isDirectory()) {
      return;
    }
    const ext = path5.extname(source);
    const url = `/${path5.relative(options.pageRoot, source).replace(ext, "")}`;
    const importName = `${url.replace(/[/.]/g, "_")}`;
    if (/\.pagemeta\.tsx?$/.test(source)) {
      if (/index\.pagemeta\.tsx?$/.test(path5.basename(source))) {
        const page = {
          source,
          url: path5.dirname(url),
          componentName: "",
          isDirectory: true,
          importName
        };
        pages.push(page);
      }
      return;
    }
    if (/\.tsx$/.test(source)) {
      const componentName = path5.basename(source).replace(ext, "");
      const prefix = options.chunkPrefixes.find((p) => url.startsWith(p)) ?? "/";
      const page = {
        source,
        url,
        componentName,
        importName,
        isDirectory: false
      };
      pages.push(page);
      if (!chunks.has(prefix)) {
        const filename = prefix === "/" ? "default" : prefix;
        chunks.set(prefix, {
          prefix,
          path: path5.join(options.outDir, `${filename}.tsx`),
          pages: [],
          importName: `Chunk_${filename.replace(/\//g, "_")}`,
          isLazy: prefix !== "/"
        });
      }
      const chunk = chunks.get(prefix);
      chunk.pages.push(page);
    }
  });
  try {
    await fs4.access(options.outDir);
    await fs4.rm(options.outDir, {
      recursive: true
    });
  } catch (_e) {
  }
  for (const [, chunk] of chunks) {
    await generateChunk(options, chunk);
  }
  await generateIndex(options, path5.join(options.outDir, "index.tsx"), [...chunks.values()]);
  await generateMeta(options, path5.join(options.outDir, "meta.ts"), pages);
};

// src/cli.ts
var main = () => {
  const finalArgv = process.argv[0] === "split-pages" ? ["node", ...process.argv] : process.argv;
  yargs(hideBin(finalArgv)).command("build [config]", "build the pages. ", (y) => {
    y.positional("config", {
      description: "path to the config, default to be pages.config.js",
      type: "string",
      default: "pages.config.js",
      normalize: true
    });
  }, async (argv) => {
    const { config: configPath } = argv;
    let inputOptions;
    try {
      inputOptions = __require(path6.resolve(process.cwd(), configPath));
    } catch (e) {
      if (e.code === "ERR_REQUIRE_ESM") {
        inputOptions = (await import(path6.resolve(process.cwd(), configPath))).default;
      } else {
        throw e;
      }
    }
    const options = {
      chunkPrefixes: [],
      outDir: ".split-pages/",
      ...inputOptions
    };
    await build(options);
  }).help().demand(1, "Must provide a valid command").parse();
};
main();
