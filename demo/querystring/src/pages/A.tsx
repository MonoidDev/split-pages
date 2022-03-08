import React from 'react';
import { definePage } from '@monoid-dev/split-pages/client';
import { stringField, struct } from '@monoid-dev/reform';

export const A = definePage(
  {
    props: struct({
      a: stringField(),
    }),
  },
  ({ a }) => {
    return <>{a}</>;
  },
);
