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
  definePage: () => definePage
});

// src/definePage.ts
var import_querystring = require("querystring");
var import_react = __toESM(require("react"));
var import_react_router_dom = require("react-router-dom");

// src/errors.ts
var InvalidSearch = class extends Error {
  constructor(message, result) {
    super(message);
    this.result = result;
  }
};

// src/definePage.ts
var definePage = (config, ClientPage) => {
  const Page = () => {
    const location = (0, import_react_router_dom.useLocation)();
    const param = (0, import_querystring.parse)(location.search.slice(1));
    if (config.props) {
      const props = config.props.resolve(param);
      if (props._tag === "left") {
        throw new InvalidSearch("Invalid search parameters", props);
      }
      return import_react.default.createElement(ClientPage, props.right);
    }
    return import_react.default.createElement(ClientPage);
  };
  return Page;
};
module.exports = __toCommonJS(client_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  definePage
});
