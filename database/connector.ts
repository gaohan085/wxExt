import "dotenv/config";
import mongoose from "mongoose";
import * as log from "../lib/log";

const dbUrl = process.env.DB_URL;

mongoose.connect(
  `${dbUrl as string}${
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
  log.warn("MongoDB connection established!");
});
connection.on("error", (e) => {
  log.warn(e);
  process.exit(1);
});

export { connection };
