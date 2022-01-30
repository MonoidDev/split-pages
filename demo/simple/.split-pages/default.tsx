import React from "react";
import { Switch, Route } from "react-router-dom";
import { NoMatch } from "../pages/NoMatch";

import { NoMatch as _NoMatch } from "../pages/NoMatch";
import { a as _a } from "../pages/a";
import { b as _b } from "../pages/b";

export default function Chunk_default() {
  return (
    <Switch>
      <Route path="/NoMatch" exact>
        <_NoMatch />
      </Route>

      <Route path="/a" exact>
        <_a />
      </Route>

      <Route path="/b" exact>
        <_b />
      </Route>

      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
}
