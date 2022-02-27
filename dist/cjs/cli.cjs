#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/cli.ts
var import_path6 = __toESM(require("path"));
var import_yargs = __toESM(require("yargs"));
var import_helpers = require("yargs/helpers");

// src/build.ts
var import_promises4 = __toESM(require("fs/promises"));
var import_path5 = __toESM(require("path"));
var import_walkdir = __toESM(require("walkdir"));

// src/generateChunk.ts
var import_promises = __toESM(require("fs/promises"));
var import_path2 = __toESM(require("path"));

// src/utils.ts
var import_path = __toESM(require("path"));
var import_prettier = __toESM(require("prettier"));
var formatCode = (code) => {
  return import_prettier.default.format(code, { parser: "babel-ts" });
};
var relativeImport = (importer, target) => {
  let importPath = import_path.default.relative(import_path.default.dirname(importer), target).replace(/\.tsx?/, "");
  if (!importPath.startsWith(".")) {
    importPath = `./${importPath}`;
  }
  return importPath;
};

// src/generateChunk.ts
var generateChunk = (options, chunk) => __async(void 0, null, function* () {
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
  yield import_promises.default.mkdir(import_path2.default.dirname(chunk.path), {
    recursive: true
  });
  yield import_promises.default.writeFile(chunk.path, formatCode(code));
});

// src/generateIndex.ts
var import_promises2 = __toESM(require("fs/promises"));
var import_path3 = __toESM(require("path"));
var generateIndex = (options, indexPath, chunks) => __async(void 0, null, function* () {
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
  yield import_promises2.default.mkdir(import_path3.default.dirname(indexPath), {
    recursive: true
  });
  yield import_promises2.default.writeFile(indexPath, formatCode(code));
});

// src/generateMeta.ts
var import_promises3 = __toESM(require("fs/promises"));
var import_path4 = __toESM(require("path"));
var generateMeta = (_options, metaPath, pages) => __async(void 0, null, function* () {
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
    export function url<U extends AppUrl>(pathname: U, props: PageProps[U]) {
      return createUrl(pathname, props);
    }
  `);
  yield import_promises3.default.mkdir(import_path4.default.dirname(metaPath), {
    recursive: true
  });
  const code = lines.join("\n");
  yield import_promises3.default.writeFile(metaPath, formatCode(code));
});

// src/build.ts
var build = (options) => __async(void 0, null, function* () {
  const chunks = /* @__PURE__ */ new Map();
  const pages = [];
  import_walkdir.default.sync(options.pageRoot, (source, stat) => {
    var _a;
    if (stat.isDirectory()) {
      return;
    }
    const ext = import_path5.default.extname(source);
    const url = `/${import_path5.default.relative(options.pageRoot, source).replace(ext, "")}`;
    const importName = `${url.replace(/[/.]/g, "_")}`;
    if (/\.pagemeta\.tsx?$/.test(source)) {
      if (/index\.pagemeta\.tsx?$/.test(import_path5.default.basename(source))) {
        const page = {
          source,
          url: import_path5.default.dirname(url),
          componentName: "",
          isDirectory: true,
          importName
        };
        pages.push(page);
      }
      return;
    }
    if (/\.tsx$/.test(source)) {
      const componentName = import_path5.default.basename(source).replace(ext, "");
      const prefix = (_a = options.chunkPrefixes.find((p) => url.startsWith(p))) != null ? _a : "/";
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
          path: import_path5.default.join(options.outDir, `${filename}.tsx`),
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
    yield import_promises4.default.access(options.outDir);
    yield import_promises4.default.rm(options.outDir, {
      recursive: true
    });
  } catch (_e) {
  }
  for (const [, chunk] of chunks) {
    yield generateChunk(options, chunk);
  }
  yield generateIndex(options, import_path5.default.join(options.outDir, "index.tsx"), [...chunks.values()]);
  yield generateMeta(options, import_path5.default.join(options.outDir, "meta.ts"), pages);
});

// src/cli.ts
var main = () => {
  const finalArgv = process.argv[0] === "split-pages" ? ["node", ...process.argv] : process.argv;
  (0, import_yargs.default)((0, import_helpers.hideBin)(finalArgv)).command("build [config]", "build the pages. ", (y) => {
    y.positional("config", {
      description: "path to the config, default to be pages.config.js",
      type: "string",
      default: "pages.config.js",
      normalize: true
    });
  }, (argv) => __async(exports, null, function* () {
    const { config: configPath } = argv;
    let inputOptions;
    try {
      inputOptions = require(import_path6.default.resolve(process.cwd(), configPath));
    } catch (e) {
      if (e.code === "ERR_REQUIRE_ESM") {
        inputOptions = (yield import(import_path6.default.resolve(process.cwd(), configPath))).default;
      } else {
        throw e;
      }
    }
    const options = __spreadValues({
      chunkPrefixes: [],
      outDir: ".split-pages/"
    }, inputOptions);
    yield build(options);
  })).help().demand(1, "Must provide a valid command").parse();
};
main();
