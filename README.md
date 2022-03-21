# Split Pages CLI

<center>Folder-based Type-safe Router Generator</center>

## Installation


```js
# npm
npm install @monoid-dev/split-pages
# yarn
yarn add @monoid-dev/split-pages
```

## Introduction

Prerequisites: React, React Router V5, TypeScript. This guide also assumes `yarn` to be the package manager.

**split-page** is a tool that builds your navigation based on your file system. To get started, create a `pages.config.js` file at the root of your project:

```js
/**
 * @type {import('@monoid-dev/split-pages').SplitPagesInputOptions}
 */
module.exports = {
  pageRoot: './src/pages',
};
```

You probably want to add `.split-pages/` to your `.gitignore`, too. This is where  we put the auto-generated code by default.

Now, create 3 pages `A`, `B` and `NoMatch` under `./src/pages`, populating them with some content:

```
src/pages
├── A.tsx
├── B.tsx
└── NoMatch.tsx
```

```tsx
// A.tsx

import React from 'react';
import { definePage } from '@monoid-dev/split-pages/client';

export const A = definePage({}, (props) => {
  return <>A</>;
});
```

```tsx
// B.tsx

import React from 'react';
import { definePage } from '@monoid-dev/split-pages/client';

export const B = definePage({}, (props) => {
  return <>B</>;
});
```

```tsx
// NoMatch.tsx

import React from 'react';
import { definePage } from '@monoid-dev/split-pages/client';

export const NoMatch = definePage({}, (props) => {
  return <>NoMatch</>;
});
```

Now you are ready to rock ~ run the command to generate your own type-safe `react-router@5` navigation!

```bash
yarn split-pages build
```

Now you'll notice a new folder born to your project: `.split-pages`. It provides you with a default export `SplitPagesIndex`, and that's the navigation root.

Now you have `App.tsx` as your default entry, put that default export to it:

```tsx
import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import SplitPagesIndex from '../.split-pages';

export function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to={'/A'}>A</Link>
        <Link to={'/B'}>B</Link>
      </nav>
      <SplitPagesIndex />
    </BrowserRouter>
  );
}

```

It's natively `react-router-dom`, but you don't have to define the router by hand, instead it follows your file system.

## Configuration Reference

Currently, the user configuration is defined as a `SplitPagesInputOptions` interface. You can import that by:

```tsx
import { SplitPagesInputOptions } from '@monoid-dev/split-pages'
```

### SplitPagesInputOptions.pageRoot: string

REQUIRED. The folder where you put your pages. The folder can be arbitrarily nested, and the file system path relative to the root will be directly mapped to the URL path, chopping off the extension:

```
./src/pages/path/to/your/Page.tsx
->
http://localhost:3000/path/to/your/Page
```

To add a page, you need to follow the conventions:

1. Export the same name component as your file name. It is treated as the page component.

2. Use `definePage` to create the component. This will have you some advantages to help `split-pages` exploit TypeScript.

### SplitPagesInputOptions.chunkPrefixes?: string[]

OPTIONAL. A list of prefixes that you wish each of them behind an asynchronous `import()` respectively. This will guide the bundler to put only the pages with those prefixes into separate chunks. For example, you might have

```jsx
{
  chunkPrefixes: ['/admin']
}
```

This will put all `/admin` pages into a separate chunk, and other pages into another chunk. When customers login, they don't download the entire `/admin` chunk.

### SplitPagesInputOptions.outDir?: string

OPTIONAL. The output directory where we put the generated TypeScript code. By default, it is treated as `.split-pages`. You probably want to add your `<outDir>/` to your `.gitignore`.

### SplitPagesInputOptions.redirections?: { [path in string]: string; }

OPTIONAL. Each key value pair means "if we have the key as the pathname, we redirect to the value. ". 

### SplitPagesInputOptions.containerModule?: string

OPTIONAL. The component that you want to wrap each of your page component. Might be something you want to share across all of your pages: a navigation bar, an error boundary, or something else.

The value should be a path relative to your project root to the file that `export default`s your container component.

> Due to how `react-router@5` works, the component won't unmount/mount during page navigation, it is either possibly the desired behavior or not. 

## API Reference

This part will introduce the browser-side APIs that we provide. They are defined in `@monoid-dev/split-pages/client` or generated in `.split-pages/meta`.

### definePage

**You should use `definePage` to wrap each of your page component.**

Example:

```tsx
import React from 'react';
import { definePage } from '@monoid-dev/split-pages/client';

export const A = definePage((props) => {
  return <>A</>;
}, {});
```

Usage:

+ Define the type of the query.

To do this, simply provide a `struct` schema to the `props` field of the first parameter:

```tsx
import React from 'react';
import { definePage } from '@monoid-dev/split-pages/client';
import { numberField, struct } from '@monoid-dev/reform';

export const A = definePage(
  ({ a }) => {
    return <>{a}</>;
  },
  {
    props: struct({
      a: numberField(),
    }),
  },
);
```

Here, we introduce [@monoid-dev/reform](https://www.npmjs.com/package/@monoid-dev/reform), a runtime type checking and conversion library. It is similar to `io-ts`, `joi` or `yup`, but more satisfies our needs. Here we ask the URL for page `A` to support queries like `?a=string`, and a non-numeric `a` parameter will result in a thrown error (you probably want to catch that through a `componentDidCatch`). The arguments are passed to the function where you define the page component, and you can render that to your page.

### url

`url` provides a type safe way to build urls. `url` takes the first parameter as the pathname, and the second parameter as the query. Thanks to TypeScript, you CAN'T provide unchecked queries.

Example:


```tsx
import { url } from '../.split-pages/meta';

url('/A', { a: 123 })
url('/B', {})
```

### AppUrl

```tsx
import type { AppUrl } from '../.split-pages/meta';
```

`AppUrl` is the union of all possible paths in your app. It is useful if you want to add additional metadata to each page:

```tsx
import type { AppUrl } from '../.split-pages/meta';

const pageTitles: { [K in AppUrl]: string } = {
  '/A': 'A',
  '/B': 'B',
};

```

## Caveats


1. There are no official ways to support nested routing. If you want to implement that, you have to do that with native react-router.

2. You can't define runtime metadata at each page. Instead, grap the `AppUrl` union from the genereted data and gather them into the same module. This is because we cannot import those data without importing the entire page, if we want full JavaScript flexibility. 

3. No support for react-router other than v5. React router introduces huge incompatibility between major versions and following that is not one of our interests.

4. No support for pure JavaScript. TypeScript is REQUIRED. If your application scales to the size that you need auto navigation generation, you are probably already using TypeScript.
  
## Acknowledgements

Thanks to the guys in [Monoid](https://monoid.co.jp/) to be the first users of this library.
