import React from "react";
import { Switch, Route } from "react-router-dom";
import { NoMatch } from "../pages/NoMatch";

import Container from "../components/Container";
import { NoMatch as _NoMatch } from "../pages/NoMatch";
import { a as _a } from "../pages/a";
import { b as _b } from "../pages/b";

export default function Chunk_default() {
  return (
    <Switch>
      <Route path="/NoMatch" exact>
        <Container>
          <_NoMatch />
        </Container>
      </Route>

      <Route path="/a" exact>
        <Container>
          <_a />
        </Container>
      </Route>

      <Route path="/b" exact>
        <Container>
          <_b />
        </Container>
      </Route>

      <Route path="*">
        <Container>
          <NoMatch />
        </Container>
      </Route>
    </Switch>
  );
}
