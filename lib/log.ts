import colors from "colors";

const log = console.log;
const logError = console.error

export const silly = (msg: string) => log(colors.rainbow(`[silly] ${msg}`));
export const input = (msg: string) => log(colors.grey(`[input] ${msg}`));
export const verbose = (msg: string) => log(colors.cyan(`[verbose] ${msg}`));
export const prompt = (msg: string) => log(colors.grey(`[prompt] ${msg}`));
export const info = (msg: string) => log(colors.magenta(`[info] ${msg}`));
export const data = (msg: string) => log(colors.gray(`[data] ${msg}`));
export const help = (msg: string) => log(colors.cyan(`[help] ${msg}`));
export const warn = (msg: string) => log(colors.yellow(`[warn] ${msg}`));
export const debug = (msg: string) => log(colors.blue(`[debug] ${msg}`));
export const error = (msg: string) => logError(colors.red(`[error] ${msg}`));
