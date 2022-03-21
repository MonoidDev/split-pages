import React from 'react';
import { definePage } from '@monoid-dev/split-pages/client';
import { url } from '../.split-pages/meta';

export const b = definePage(
  (props) => {
    return <>
      <a href={url('/a', { id: 1 })}>Go to a</a>    
    </>;
  },
  {},
);
