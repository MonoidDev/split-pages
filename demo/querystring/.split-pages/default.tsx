import React from "react";
import { Switch, Route } from "react-router-dom";
import { NoMatch } from "../src/pages/NoMatch";

import { A as _A } from "../src/pages/A";
import { B as _B } from "../src/pages/B";
import { C as _C } from "../src/pages/C";
import { NoMatch as _NoMatch } from "../src/pages/NoMatch";

export default function Chunk_default() {
  return (
    <Switch>
      <Route path="/A" exact>
        <_A />
      </Route>

      <Route path="/B" exact>
        <_B />
      </Route>

      <Route path="/C" exact>
        <_C />
      </Route>

      <Route path="/NoMatch" exact>
        <_NoMatch />
      </Route>

      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
}
