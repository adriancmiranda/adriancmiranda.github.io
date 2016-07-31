System.config({
  defaultJSExtensions: true,
  transpiler: "typescript",
  typescriptOptions: {
    "target": "ES5",
    "module": "system",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  paths: {
    "*": "scripts/*.js",
    "github:*": "scripts/vendors/github/*",
    "npm:*": "scripts/vendors/npm/*"
  }
});
