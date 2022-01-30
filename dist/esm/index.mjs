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
  return prettier.format(code, { parser: "babel" });
};
var relativeImport = (importer, target) => {
  let importPath = path.relative(path.dirname(importer), target).replace(/\.tsx?/, "");
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
  yield fs.mkdir(path2.dirname(chunk.path), {
    recursive: true
  });
  yield fs.writeFile(chunk.path, formatCode(code));
});

// src/generateIndex.ts
import fs2 from "fs/promises";
import path3 from "path";
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
  yield fs2.mkdir(path3.dirname(indexPath), {
    recursive: true
  });
  yield fs2.writeFile(indexPath, formatCode(code));
});

// src/generateMeta.ts
import { existsSync } from "fs";
import fs3 from "fs/promises";
import path4 from "path";
var generateMeta = (_options, metaPath, pages) => __async(void 0, null, function* () {
  const lines = [];
  const importNames = /* @__PURE__ */ new Set();
  pages.forEach((p) => {
    if (!existsSync(p.source.replace(/\.tsx$/, ".pagemeta.ts"))) {
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
  yield fs3.mkdir(path4.dirname(metaPath), {
    recursive: true
  });
  yield fs3.writeFile(metaPath, formatCode(code));
});

// src/build.ts
var build = (options) => __async(void 0, null, function* () {
  const chunks = /* @__PURE__ */ new Map();
  const pages = [];
  walk.sync(options.pageRoot, (source, stat) => {
    var _a;
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
    yield fs4.access(options.outDir);
    yield fs4.rm(options.outDir, {
      recursive: true
    });
  } catch (_e) {
  }
  for (const [, chunk] of chunks) {
    yield generateChunk(options, chunk);
  }
  yield generateIndex(options, path5.join(options.outDir, "index.tsx"), [...chunks.values()]);
  yield generateMeta(options, path5.join(options.outDir, "meta.ts"), pages);
});
export {
  build
};
