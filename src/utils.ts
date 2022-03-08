import path from 'path';

import prettier from 'prettier';

export const formatCode = (code: string): string => {
  return prettier.format(code, { parser: 'babel-ts' });
};

export const relativeImport = (importer: string, target: string): string => {
  let importPath = path.relative(path.dirname(importer), target).replace(/\.tsx?/, '');

  if (!importPath.startsWith('.')) {
    importPath = `./${importPath}`;
  }

  return importPath;
};
