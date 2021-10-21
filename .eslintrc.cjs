module.exports = {
  extends: ['airbnb', 'airbnb-typescript'],
  ignorePatterns: [
    "**/generated/**",
  ],
  rules: {
    "max-len": ["error", {
      code: 140,
      tabWidth: 2,
      // ignoreComments: true,
      ignoreTrailingComments: true,
      // ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    "react/react-in-jsx-scope": "off",
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "react/jsx-props-no-spreading": "off",
    "react/prop-types": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "no-console": ["error", { allow: ["warn", "error", "info"] }],
    "no-plusplus": "off",
    "arrow-body-style": "off",
    "react/no-array-index-key": "off",
    "react/button-has-type": "off",
    "max-classes-per-file": "off",
    "global-require": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "no-await-in-loop": "off",
    "no-restricted-syntax": "off",
    "import/no-cycle": "off",
    "class-methods-use-this": "off",
    "linebreak-style": "off",
    "quote-props": "off",
    "no-lonely-if": "off",
    "object-curly-newline": "warn",
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal"],
        "pathGroups": [
          {
            "pattern": "@(react|react-native)",
            "group": "external",
            "position": "before"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react"],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
