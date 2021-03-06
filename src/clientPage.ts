import React from 'react';

import type { AnyResolver, UnknownResolver, OutputOf } from '@monoid-dev/reform';
import { useLocation } from 'react-router-dom';

import { InvalidSearch } from './errors';
import { ClientPageConfig } from './types';

export const definePage = <R extends AnyResolver = UnknownResolver>(
  ClientPage: React.VFC<OutputOf<R>>,
  config: ClientPageConfig<R>,
): React.VFC & { __R: R } => {
  const Page = () => {
    const location = useLocation();

    const param = new URLSearchParams(location.search.slice(1)); // Removing the '?'

    let o: Record<string, string | string[]> = {};

    param.forEach((_, key) => {
      const values = param.getAll(key);
      if (values.length > 1) {
        o[key] = values;
      } else {
        o[key] = values[0];
      }
    });

    if (config.props) {
      const props = config.props.resolve(o);

      if (props._tag === 'left') {
        throw new InvalidSearch('Invalid search parameters', props);
      }

      return React.createElement(ClientPage, props.right);
    }
    return React.createElement(ClientPage);
  };

  return Page as any;
};

export const createUrl = (url: string, props: any) => {
  const converted: any = {};

  for (const [key, value] of Object.entries(props)) {
    if (value != null) {
      converted[key] = value;
    }
  }

  return `${url}?${new URLSearchParams(converted).toString()}`;
};
