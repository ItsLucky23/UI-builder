
//@ts-expect-error
import * as Babel from "@babel/standalone";
import React from "react";

export function compileTSX(code: string) {
  try {
    const compiled = Babel.transform(code, {
      presets: [
        ["env", { modules: "commonjs" }],
        "react",
        "typescript",
      ],
      filename: 'file.tsx', // helpful for error reporting
    }).code;
    // console.log('Compiled code:', compiled);
    return compiled;
  } catch (error) {
    console.error('Babel compilation error:', error);
    return '';
  }
}

// export function loadModule(jsCode: string) {
//   const module = { exports: {} };
//   // const fn = new Function("module", "exports", "React", jsCode);
//   const fn = new Function("React", `return ${jsCode}`);
//   return fn(React);
//   // fn(module, module.exports, React);

//   // if ('default' in module.exports) {
//   //   return module.exports.default
//   // } else {
//   //   return module.exports;
//   // }
// }
export function loadModule(code: string) {
  if (!code) return () => React.createElement("div", { style: { color: "red" } }, "Compilation Failed");

  try {
    const module = { exports: {} };
    const fn = new Function("module", "exports", "require", code);
    fn(module, module.exports, (name: string) => {
      if (name === "react") return React;
      throw new Error("Unsupported require: " + name);
    });

    if ('default' in module.exports) {
      return module.exports.default
    } else {
      return module.exports;
    }
  } catch (e) {
    console.error("Module loading error:", e);
    return () => React.createElement("div", { style: { color: "red" } }, "Runtime Error: " + (e as Error).message);
  }
}
