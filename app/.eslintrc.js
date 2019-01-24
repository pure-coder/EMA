module.exports = {
  "parserOptions": {
    "ecmaVersion": "7",
    "sourceType": "module",
  },
  "env": {
    "browser": true, // removes unexpected < token from errors as well as other things
    "es6": true,
    "node": true
  },
  "rules": {
    "no-empty": "error",
    "no-multiple-empty-lines": "warn",
    "no-var": "error",
    "no-console": "warn",
    "prefer-const": "warn"
  },
  "parser": "babel-eslint",
  "extends": "eslint:recommended"
};
