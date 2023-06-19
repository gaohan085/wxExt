const path = require("path");

const configNode = Object.assign(
  {},
  {
    target: "node",
    entry: "./src/app.ts",
    output: {
      path: path.join(__dirname, ".out"),
      filename: "app.js",
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
        },
      ],
    },

    resolve: {
      extensions: [".ts", ".js"],
    },
  }
);

module.exports = [configNode];
