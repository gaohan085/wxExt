import axios from "axios";
import "dotenv/config";
import * as log from "./lib/log";
import { RunApp } from "./src/app";
import * as database from "./database";

(async function () {
  return (
    await axios.get<{ [index: string]: string }>(
      `http://127.0.0.1:8203/ext/www/key.ini`
    )
  ).data;
})()
  .then((data) => {
    const app: { [index: string]: string } = {};

    for (const index in data) {
      app[index] = data[index];
    }
    RunApp(app);
    log.info(process.env.NODE_ENV as string);

    if (process.env.NODE_ENV === "development") {
      process.on("SIGINT", async () => {
        await database.connection.dropDatabase();
        process.exit();
      });

      process.once("SIGHUP", async () => {
        await database.connection.dropDatabase();
      });
    }
  })
  .catch((e) => log.error(JSON.stringify(e)));
