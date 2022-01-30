// src/definePage.ts
import { parse } from "querystring";
import React from "react";
import { useLocation } from "react-router-dom";

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
    const location = useLocation();
    const param = parse(location.search.slice(1));
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
export {
  definePage
};
