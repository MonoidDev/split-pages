export const meta = [
  {
    url: "/a",
    name: "a",
    isDirectory: false,
    listed: true,
    staffOnly: false,
    superuserOnly: false,
  },

  {
    url: "/nested/nested/b",
    name: "b",
    isDirectory: false,
    listed: true,
    staffOnly: false,
    superuserOnly: false,
  },
];
export type AppUrl = "/a" | "/nested/nested/b";
export const url = (u: AppUrl) => u;
