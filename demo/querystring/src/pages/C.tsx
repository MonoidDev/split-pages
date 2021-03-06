import React from 'react';
import { definePage } from '@monoid-dev/split-pages/client';
import { string, struct, omittable } from '@monoid-dev/reform';

export const C = definePage(
  ({ a }) => {
    return <>{a}</>;
  },
  {
    props: struct({
      a: omittable(string()),
    }),
  },
);
