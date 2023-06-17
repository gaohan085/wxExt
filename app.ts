import WebSocket from "ws";
import * as log from "./src/log";
import handleMsg from "./src/handleMsg";

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
  data?: string & { [index: string]: string | number };
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
  const url = `ws://127.0.0.1:8202/wx?name=${encodeURIComponent(
    app.name
  )}&key=${app.key}`;
  log.info(`[url]: ${url}`);
  const ws = new WebSocket(url);

  ws.on("open", () => {
    log.info("Connected to websocket server sucessfully.");
  });

  ws.on("error", (e) => {
    log.error(JSON.stringify(e));
  });

  ws.on("close", () => {
    log.error("Connection closed by server");
  });

  ws.on("message", (data) => {
    try {
      const obj = JSON.parse(data.toString()) as ObjType;
      if (obj.req !== undefined) return msgObj.cb(obj);
      if (obj.cb !== undefined) {
        //cb是服务端请求过来的需要回复,人家等着呢
        return ws.send(JSON.stringify(obj));
      }
      handleMsg(obj, sendFc);
    } catch (e) {
      log.error(JSON.stringify(e));
    }
  });

  const sendFc = async (obj: ObjType, timeout = 1000) => {
    try {
      await new Promise((resolve, reject) => {
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

function init() {
  const args = process.argv;
  let reg;
  args.forEach((arg, i) => {
    if ((reg = /^--(.+)$/.exec(arg))) app[reg[1]] = args[++i];
  });
  log.info(JSON.stringify(app));

  RunApp(app);
}
init();
