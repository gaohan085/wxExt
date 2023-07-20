import mongoose from "mongoose";
import * as lib from "../lib";

mongoose.connect(
  `${lib.config.dbUrl as string}${
    process.env.NODE_ENV === "test" ? Math.floor(Math.random() * 1000) : ""
  }`
);
switch (process.env.NODE_ENV) {
  case "development":
    mongoose.set("debug", { shell: true });
    break;
  default:
    break;
}
const connection = mongoose.connection;

connection.once("open", () => {
  lib.log.warn("MongoDB connection established!");
});
connection.on("error", (e) => {
  lib.log.warn(e);
  process.exit(1);
});

export { connection };
