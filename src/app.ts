import "dotenv/config";
import WebSocket from "ws";
import { log } from "../lib";
import handleMsg from "./handle-msg";
import { connection } from "../database";

const { ADMIN_WXID, DB_URL, REMOTE_ADDRESS } = process.env;

if (!ADMIN_WXID || !DB_URL || !REMOTE_ADDRESS) {
  log.error(
    "Please define 'ADMIN_WXID', 'DB_URL', 'REMOTE_ADDRESS' field in .env file"
  );
  process.exit(1);
}

interface MsgObjType {
  _id: number;
  get id(): number;
  callback: {
    [index: number | string]: {
      cb: MsgObjType["cb"];
      timeout?: ReturnType<typeof setTimeout>;
    };
  };
  cb: (obj: ObjType) => void;
  event: typeof console.log;
  req: typeof console.log;
  add: (cb: MsgObjType["cb"], timeout: number) => number;
}

export interface ObjType {
  id?: number;
  req?: number | string;
  method?: string;
  msg?: string;
  cb?: string;
  data?: string & { fromid?: string; toid?: string; msg?: string } & {
    [index: string]: string;
  };
  type?: number;
}

const app: { [index: string]: string } = {};

const msgObj: MsgObjType = {
  _id: 0,
  get id() {
    return msgObj._id > 60000 ? 0 : msgObj._id++;
  },
  callback: {},
  cb: function (obj) {
    if (!msgObj.callback[obj.req as string]) return;
    clearTimeout(msgObj.callback[obj.req as string].timeout);
    msgObj.callback[obj.req as string].cb.call(null, obj);
    delete msgObj.callback[obj.req as string];
  },
  event: console.log,
  req: console.log,
  add: function (cb, timeout) {
    const id = msgObj.id;
    this.callback[id] = {
      cb,
      timeout: setTimeout(function () {
        msgObj.cb({ id, method: "err", msg: "timeout" });
      }, timeout || 3000),
    };
    return id;
  },
};

export async function RunApp(app: { [index: string]: string }) {
  const url = `ws://${
    process.env.REMOTE_ADDRESS
  }:8202/wx?name=${encodeURIComponent(app.name)}&key=${app.key}`;
  log.info(`[url]: ${url}`);
  const ws = new WebSocket(url);

  ws.on("open", () => {
    log.info("Connected to websocket server sucessfully.");
  });

  ws.on("error", (e) => {
    log.error(JSON.stringify(e));
  });

  ws.on("close", (code, reason) => {
    log.error(
      `Connection closed by server with code ${code}: ${reason.toLocaleString()}`
    );
  });

  ws.on("message", async (data) => {
    try {
      const obj = JSON.parse(data.toString()) as ObjType;
      if (obj.req !== undefined) return msgObj.cb(obj);
      if (obj.cb !== undefined) {
        //cb是服务端请求过来的需要回复,人家等着呢
        return ws.send(JSON.stringify(obj));
      }
      await handleMsg(obj, sendFunc);
    } catch (e) {
      log.error(JSON.stringify(e));
    }
  });

  const sendFunc = async (obj: ObjType, timeout = 1000) => {
    try {
      await new Promise((resolve) => {
        if (!obj || !obj.method)
          return resolve({ method: "err", msg: "invalid method" });
        obj.req = msgObj.add(resolve, timeout);
        const str = JSON.stringify(obj);
        ws.send(str);
        log.info(`Send Message "${str}"`);
      });
    } catch (e) {
      log.error(JSON.stringify(e));
    }
  };
}

async function init() {
  log.info("==============================================================");
  log.info("Wechat extension started!");
  const args = process.argv;
  let reg;
  args.forEach((arg, i) => {
    if ((reg = /^--(.+)$/.exec(arg))) app[reg[1]] = args[++i];
  });
  log.info(JSON.stringify(app));

  if (process.env.NODE_ENV === "development") {
    process.on("SIGINT", async () => {
      await connection.dropDatabase();
      process.exit();
    });

    process.once("SIGHUP", async () => {
      await connection.dropDatabase();
    });
  }

  RunApp(app);
}
init();
