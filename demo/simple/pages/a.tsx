import React from 'react';
import { struct, numberField } from '@monoid-dev/reform';
import { definePage } from '@monoid-dev/split-pages/client';

export const a = definePage(
  {
    props: struct({
      id: numberField(),
    }),
  },
  (props) => {
    const { id } = props;

    return <>{id}</>;
  },
);
