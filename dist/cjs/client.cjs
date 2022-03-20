var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// src/client.ts
var client_exports = {};
__export(client_exports, {
  createUrl: () => createUrl,
  definePage: () => definePage
});

// src/clientPage.ts
var import_react = __toESM(require("react"));
var import_react_router_dom = require("react-router-dom");

// src/errors.ts
var InvalidSearch = class extends Error {
  constructor(message, result) {
    super(message);
    this.result = result;
  }
  toString() {
    return `${JSON.stringify(this.message)}: ${this.result}`;
  }
};

// src/clientPage.ts
var definePage = (config, ClientPage) => {
  const Page = () => {
    const location = (0, import_react_router_dom.useLocation)();
    const param = new URLSearchParams(location.search.slice(1));
    let o = {};
    param.forEach((_, key) => {
      const values = param.getAll(key);
      if (values.length > 1) {
        o[key] = values;
      } else {
        o[key] = values[0];
      }
    });
    if (config.props) {
      const props = config.props.resolve(o);
      if (props._tag === "left") {
        throw new InvalidSearch("Invalid search parameters", props);
      }
      return import_react.default.createElement(ClientPage, props.right);
    }
    return import_react.default.createElement(ClientPage);
  };
  return Page;
};
var createUrl = (url, props) => {
  const converted = {};
  for (const [key, value] of Object.entries(props)) {
    if (value != null) {
      converted[key] = value;
    }
  }
  return `${url}?${new URLSearchParams(converted).toString()}`;
};
module.exports = __toCommonJS(client_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUrl,
  definePage
});
