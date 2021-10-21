import React from "react";
import { Switch, Route } from "react-router-dom";
import { NoMatch } from "../pages/NoMatch";

import { a as _a } from "../pages/a";

export default function Chunk_default() {
  return (
    <Switch>
      <Route path="/a" exact>
        <_a />
      </Route>

      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
}
