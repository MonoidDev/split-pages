import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { NoMatch } from "../pages/NoMatch";

import Chunk_default from "./default";
export default function SplitPagesIndex() {
  return (
    <Switch>
      <Route path="/xxx" exact>
        <Redirect to="/" />
      </Route>

      <Route path="/">
        <Chunk_default />
      </Route>

      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
}
