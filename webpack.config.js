const path = require("path");

module.exports = {
  target:"node",
  entry: "./app.ts",
  output: {
    path: path.resolve(__dirname),
    filename: "app-output.js",
  },

  rules: [
    {
      test: /\.ts$/,
      use: [{ loader: "ts-loader" }],
    },
  ],

  resolve: {
    extensions: [".ts", ".js"],
  },
};
