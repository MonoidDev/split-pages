import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import SplitPagesIndex from './.split-pages';

export function App() {
  return (
    <BrowserRouter>
      <SplitPagesIndex />
    </BrowserRouter>
  );
}
