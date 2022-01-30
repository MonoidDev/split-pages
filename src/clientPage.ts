import { parse, stringify } from 'querystring';

import React from 'react';

import type { AnyResolver, UnknownResolver, OutputOf } from '@monoid-dev/reform';
import { useLocation } from 'react-router-dom';

import { InvalidSearch } from './errors';
import { ClientPageConfig } from './types';

export const definePage = <R extends AnyResolver = UnknownResolver>(
  config: ClientPageConfig<R>,
  ClientPage: React.VFC<OutputOf<R>>,
): React.VFC & { __R: R } => {
  const Page = () => {
    const location = useLocation();

    const param = parse(location.search.slice(1)); // Removing the '?'

    if (config.props) {
      const props = config.props.resolve(param);

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
  return `${url}?${stringify(props)}`;
};
