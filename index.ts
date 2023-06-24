import { RunApp } from "./src/app";
import axios from "axios";
import * as log from "./lib/log";
import "dotenv/config"

async function run() {
  return (
    await axios.get<{ [index: string]: string }>(
      `http://${process.env.REMOTE_ADDRESS}:8203/ext/www/key.ini`
    )
  ).data;
}

run()
  .then((data) => {
    const app: { [index: string]: string } = {};

    for (const index in data) {
      app[index] = data[index];
    }
    RunApp(app);
    log.info(process.env.NODE_ENV as string);
  })
  .catch((e) => log.error(JSON.stringify(e)));
