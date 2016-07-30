System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "es7.decorators",
      "es7.classProperties"
    ]
  },
  paths: {
    "*": "scripts/*.js",
    "github:*": "scripts/vendors/github/*",
    "npm:*": "scripts/vendors/npm/*"
  }
});
