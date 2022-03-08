import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { url } from '../.split-pages/meta';
import SplitPagesIndex from '../.split-pages';

export function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to={url('/A', { a: 'Alice' })}>A</Link>
        <Link to={'/B'}>B</Link>
      </nav>
      <SplitPagesIndex />
    </BrowserRouter>
  );
}
