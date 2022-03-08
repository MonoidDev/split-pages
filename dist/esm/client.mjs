// src/clientPage.ts
import React from "react";
import { useLocation } from "react-router-dom";

// src/errors.ts
var InvalidSearch = class extends Error {
  constructor(message, result) {
    super(message);
    this.result = result;
  }
};

// src/clientPage.ts
var definePage = (config, ClientPage) => {
  const Page = () => {
    const location = useLocation();
    const param = new URLSearchParams(location.search.slice(1));
    let o = {};
    param.forEach((_, key) => {
      const values = param.getAll(key);
      if (values.length > 0) {
        o[key] = values;
      } else {
        o[key] = values[0];
      }
    });
    if (config.props) {
      const props = config.props.resolve(param);
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
  return `${url}?${new URLSearchParams(props).toString()}`;
};
export {
  createUrl,
  definePage
};
