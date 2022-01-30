import * as fs from 'fs';
import * as util from 'util';

import * as babel from '@babel/core';

import { TSDocParser, ParserContext, DocComment } from '@microsoft/tsdoc';

// const inputBuffer: string = fs.readFileSync('demo/simple/pages/a.tsx').toString();

// // NOTE: Optionally, can provide a TSDocConfiguration here
// const tsdocParser: TSDocParser = new TSDocParser();
// const parserContext: ParserContext = tsdocParser.parseString(inputBuffer);

// console.log(parserContext.docComment)

(async () => {
  const inputBuffer = fs.readFileSync('demo/simple/pages/a.tsx').toString();

  const result = await babel.transformAsync(inputBuffer, {
    filename: 'a.tsx',
    presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/preset-env'],
    ast: true,
    parserOpts: {},
  });

  const component = result.ast!.program.body.find((t) => t.type === 'VariableDeclaration');
  // console.log(component);
  const comment = component.leadingComments[0].value;

  const tsdocParser: TSDocParser = new TSDocParser();

  const docResult = tsdocParser.parseString(comment);

  console.log(docResult.docComment);
})();
