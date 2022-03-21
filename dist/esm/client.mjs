// src/clientPage.ts
import React from "react";
import { useLocation } from "react-router-dom";

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
var definePage = (ClientPage, config) => {
  const Page = () => {
    const location = useLocation();
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
      return React.createElement(ClientPage, props.right);
    }
    return React.createElement(ClientPage);
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
export {
  createUrl,
  definePage
};
