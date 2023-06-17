const path = require("path");

module.exports = {
  target: "node",
  entry: "./app.ts",
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
};
