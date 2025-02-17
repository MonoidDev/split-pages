import React from "react";
import { Switch, Route } from "react-router-dom";
import { NoMatch } from "../pages/NoMatch";

import { a as _a } from "../pages/a";
import { b as _nested_nested_b } from "../pages/nested/nested/b";

export default function Chunk_default() {
  return (
    <Switch>
      <Route path="/a" exact>
        <_a />
      </Route>

      <Route path="/nested/nested/b" exact>
        <_nested_nested_b />
      </Route>

      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
}
