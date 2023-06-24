import "dotenv/config";
import mongoose from "mongoose";
import * as log from "../lib/log";

const dbUrl = process.env.db_url;
if (dbUrl === undefined) {
  log.error("Invalid db connection url in .env");
  process.exit(1);
}

mongoose.connect(dbUrl);
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
