import { OutputOf } from "@monoid-dev/reform";
import { createUrl } from "@monoid-dev/split-pages/client";
import type { A as _A } from "../src/pages/A";
import type { B as _B } from "../src/pages/B";
import type { C as _C } from "../src/pages/C";
import type { NoMatch as _NoMatch } from "../src/pages/NoMatch";
export type PageProps = {
  "/A": OutputOf<typeof _A["__R"]>;

  "/B": OutputOf<typeof _B["__R"]>;

  "/C": OutputOf<typeof _C["__R"]>;

  "/NoMatch": OutputOf<typeof _NoMatch["__R"]>;
};
export type AppUrl = keyof PageProps;

type OmitIfNotOptional<T extends object> = {
  [Key in keyof T as undefined extends T[Key] ? Key : never]: T[Key];
};

type OmitIfOptional<T extends object> = {
  [Key in keyof T as undefined extends T[Key] ? never : Key]: T[Key];
};

// eslint-disable-next-line @typescript-eslint/ban-types
type PassThroughUnion = String | Number | Date | Function | RegExp; // May be completed with other builtin classes.

export type MakeUndefinableFieldsOptional<
  T,
  ExtraPassThroughTypes = never
> = T extends PassThroughUnion | ExtraPassThroughTypes
  ? T
  : T extends (infer E)[]
  ? MakeUndefinableFieldsOptional<E>[]
  : T extends object
  ? {
      [Key in keyof OmitIfOptional<T>]: MakeUndefinableFieldsOptional<T[Key]>;
    } & {
      [Key in keyof OmitIfNotOptional<T>]?: MakeUndefinableFieldsOptional<
        T[Key]
      >;
    }
  : T;

export function url<U extends AppUrl>(
  pathname: U,
  props: MakeUndefinableFieldsOptional<PageProps[U]>
) {
  return createUrl(pathname, props);
}
