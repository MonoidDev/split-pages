import { OutputOf } from "@monoid-dev/reform";
import { createUrl } from "@monoid-dev/split-pages/client";
import type { A as _A } from "../src/pages/A";
import type { B as _B } from "../src/pages/B";
import type { NoMatch as _NoMatch } from "../src/pages/NoMatch";
export type PageProps = {
  "/A": OutputOf<typeof _A["__R"]>;

  "/B": OutputOf<typeof _B["__R"]>;

  "/NoMatch": OutputOf<typeof _NoMatch["__R"]>;
};
export type AppUrl = keyof PageProps;

export function url<U extends AppUrl>(pathname: U, props: PageProps[U]) {
  return createUrl(pathname, props);
}
