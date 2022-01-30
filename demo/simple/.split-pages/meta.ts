import { OutputOf } from "@monoid-dev/reform";
import { createUrl } from "@monoid-dev/split-pages/client";
import type { NoMatch as _NoMatch } from "../pages/NoMatch";
import type { a as _a } from "../pages/a";
import type { b as _b } from "../pages/b";
export type PageInput = {
  "/NoMatch": OutputOf<typeof _NoMatch["__R"]>;

  "/a": OutputOf<typeof _a["__R"]>;

  "/b": OutputOf<typeof _b["__R"]>;
};
export type AppUrl = keyof PageInput;

export function url<U extends AppUrl>(pathname: U, props: PageInput[U]) {
  return createUrl(pathname, props);
}
