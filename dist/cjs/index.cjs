var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// src/index.ts
__markAsModule(exports);
__export(exports, {
  build: () => build
});

// src/build.ts
var import_promises4 = __toModule(require("fs/promises"));
var import_path5 = __toModule(require("path"));
var import_walkdir = __toModule(require("walkdir"));

// src/generateChunk.ts
var import_promises = __toModule(require("fs/promises"));
var import_path2 = __toModule(require("path"));

// src/utils.ts
var import_path = __toModule(require("path"));
var import_prettier = __toModule(require("prettier"));
var formatCode = (code) => {
  return import_prettier.default.format(code, {parser: "babel"});
};
var relativeImport = (importer, target) => {
  let importPath = import_path.default.relative(import_path.default.dirname(importer), target).replace(/\.tsx?/, "");
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
  for (const page of chunk.pages) {
    const importPath = relativeImport(chunk.path, page.source);
    lines.push(`import { ${page.componentName} as ${page.importName} } from ${JSON.stringify(importPath)};`);
  }
  const getRouteCode = (page) => {
    return `
      <Route path="${page.url}" exact>
        <${page.importName} />
      </Route>
    `;
  };
  const switchCode = `
    <Switch>
      ${chunk.pages.map(getRouteCode).join("\n")}

      <Route
        path="*"
      >
        <NoMatch />
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
  await import_promises.default.mkdir(import_path2.default.dirname(chunk.path), {
    recursive: true
  });
  await import_promises.default.writeFile(chunk.path, formatCode(code));
};

// src/generateIndex.ts
var import_promises2 = __toModule(require("fs/promises"));
var import_path3 = __toModule(require("path"));
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
  await import_promises2.default.mkdir(import_path3.default.dirname(indexPath), {
    recursive: true
  });
  await import_promises2.default.writeFile(indexPath, formatCode(code));
};

// src/generateMeta.ts
var import_fs = __toModule(require("fs"));
var import_promises3 = __toModule(require("fs/promises"));
var import_path4 = __toModule(require("path"));
var generateMeta = async (_options, metaPath, pages) => {
  const lines = [];
  const importNames = new Set();
  pages.forEach((p) => {
    if (!(0, import_fs.existsSync)(p.source.replace(/\.tsx$/, ".pagemeta.ts"))) {
      return;
    }
    const importPath = relativeImport(metaPath, p.source.replace(".tsx", ".pagemeta.tsx"));
    lines.push(`import { meta as ${p.importName} } from ${JSON.stringify(importPath)};`);
    importNames.add(p.importName);
  });
  lines.push("export const meta = [");
  pages.forEach((p) => {
    let meta;
    if (importNames.has(p.importName)) {
      meta = `...${p.importName}`;
    } else {
      meta = "";
    }
    lines.push(`
      {
        url: '${p.url}',
        name: '${p.componentName}',
        isDirectory: ${p.isDirectory},
        listed: true,
        staffOnly: false,
        superuserOnly: false,
        ${meta}
      },
    `);
  });
  lines.push("];");
  lines.push("export type AppUrl =");
  pages.forEach((p) => {
    lines.push(`| ${JSON.stringify(p.url)}`);
  });
  lines.push(";");
  lines.push("export const url = (u: AppUrl) => u;");
  const code = lines.join("\n");
  await import_promises3.default.mkdir(import_path4.default.dirname(metaPath), {
    recursive: true
  });
  await import_promises3.default.writeFile(metaPath, formatCode(code));
};

// src/build.ts
var build = async (options) => {
  const chunks = new Map();
  const pages = [];
  import_walkdir.default.sync(options.pageRoot, (source, stat) => {
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
    await import_promises4.default.access(options.outDir);
    await import_promises4.default.rm(options.outDir, {
      recursive: true
    });
  } catch (_e) {
  }
  for (const [, chunk] of chunks) {
    await generateChunk(options, chunk);
  }
  await generateIndex(options, import_path5.default.join(options.outDir, "index.tsx"), [...chunks.values()]);
  await generateMeta(options, import_path5.default.join(options.outDir, "meta.ts"), pages);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  build
});
