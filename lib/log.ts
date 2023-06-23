import colors from "colors";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { cwd } from "node:process";
import { format } from "node:util";

const writeStream = createWriteStream(path.join(cwd(), "wxExt.log"), {
  flags: "a",
});
const writeLog = (msg: string) => {
  writeStream.write(new Date().toLocaleString() + " " +format(msg) + "\n");
};

const log = console.log;
const logError = console.error;

export const silly = (msg: string) => {
  switch (process.env.NODE_ENV as string) {
    case "development":
      log(colors.rainbow(`${new Date().toLocaleString()} [silly] ${msg}`));
      break;
    default:
      writeLog(`[silly] ${msg}`);
      break;
  }
};
export const input = (msg: string) => {
  switch (process.env.NODE_ENV) {
    case "development":
      log(colors.grey(`${new Date().toLocaleString()} [input] ${msg}`));
      break;
    default:
      writeLog(`[input] ${msg}`);
      break;
  }
};
export const verbose = (msg: string) => {
  switch (process.env.NODE_ENV) {
    case "development":
      log(colors.cyan(`${new Date().toLocaleString()} [verbose] ${msg}`));
      break;
    default:
      writeLog(`[verbose] ${msg}`);
      break;
  }
};
export const prompt = (msg: string) => {
  switch (process.env.NODE_ENV) {
    case "development":
      log(colors.grey(`${new Date().toLocaleString()} [prompt] ${msg}`));
      break;
    default:
      writeLog(`[prompt] ${msg}`);
      break;
  }
};
export const info = (msg: string) => {
  switch (process.env.NODE_ENV) {
    case "development":
      log(colors.magenta(`${new Date().toLocaleString()} [info] ${msg}`));
      break;
    default:
      writeLog(`[info] ${msg}`);
      break;
  }
};
export const data = (msg: string) => {
  switch (process.env.NODE_ENV) {
    case "development":
      log(colors.gray(`${new Date().toLocaleString()} [data] ${msg}`));
      break;
    default:
      writeLog(`[data] ${msg}`);
      break;
  }
};
export const help = (msg: string) => {
  switch (process.env.NODE_ENV) {
    case "development":
      log(colors.cyan(`${new Date().toLocaleString()} [help] ${msg}`));
      break;
    default:
      writeLog(`[help] ${msg}`);
      break;
  }
};
export const warn = (msg: string) => {
  switch (process.env.NODE_ENV) {
    case "development":
      log(colors.yellow(`${new Date().toLocaleString()} [warn] ${msg}`));
      break;
    default:
      writeLog(`[warn] ${msg}`);
      break;
  }
};
export const debug = (msg: string) => {
  switch (process.env.NODE_ENV) {
    case "development":
      log(colors.blue(`${new Date().toLocaleString()} [debug] ${msg}`));
      break;
    default:
      writeLog(`[debug] ${msg}`);
      break;
  }
};
export const error = (msg: string) => {
  switch (process.env.NODE_ENV) {
    case "development":
      logError(colors.red(`${new Date().toLocaleString()} [error] ${msg}`));
      break;
    default:
      writeLog(`[error] ${msg}`);
      break;
  }
};
