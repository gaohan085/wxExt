import { RunApp } from "./src/app";
import axios from "axios";
import * as log from "./lib/log";

async function run() {
  return (
    await axios.get<{ [index: string]: string }>(
      "http://127.0.0.1:8203/ext/www/key.ini"
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
  })
  .catch((e) => log.error(JSON.stringify(e)));
