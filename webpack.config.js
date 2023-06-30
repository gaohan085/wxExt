const path = require("path");

const configNode = Object.assign(
  {},
  {
    target: "node",
    entry: "./src/app.ts",
    output: {
      path: path.join(__dirname, ".dist"),
      filename: "app.js",
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /(node_modules)/,
          use: "swc-loader",
        },
      ],
    },

    resolve: {
      extensions: [".ts", ".js"],
    },
  }
);

module.exports = [configNode];
