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
