import { RunApp } from "./src/app";
import axios from "axios";
import * as log from "./lib/log";
import "dotenv/config";

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
  })
  .catch((e) => log.error(JSON.stringify(e)));
