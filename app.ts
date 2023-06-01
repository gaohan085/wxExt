import WebSocket from "ws";

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
  data?: string | { [index: string]: string | number };
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
    let id = msgObj.id;
    this.callback[id] = {
      cb,
      timeout: setTimeout(function () {
        msgObj.cb({ id, method: "err", msg: "timeout" });
      }, timeout || 3000),
    };
    return id;
  },
};

function RunApp() {
  const url = `ws://127.0.0.1:8202/wx?name=${encodeURIComponent(
    app.name
  )}&key=${app.key}`;
  console.log("[ info ]" + url);
  const ws = new WebSocket(url);

  ws.on("open", () => {
    console.log("[ info ]Connect sucessfully.");
  });

  ws.on("error", (e) => {
    console.error("[ ERROR ]" + e);
  });

  ws.on("close", () => {
    console.error("[ ERROR ]Connection closed by server");
  });

  ws.on("message", (data) => {
    try {
      let obj = JSON.parse(data.toString()) as ObjType;
      if (obj.req !== undefined) return msgObj.cb(obj);
      if (obj.cb !== undefined) {
        //cb是服务端请求过来的需要回复,人家等着呢
        let cbid = obj.cb,
          method = obj.method;
        obj = { data: app.data };
        obj.cb = cbid;
        return ws.send(JSON.stringify(obj));
      }
    } catch (e) {
      console.error("[ ERROR ]" + e);
    }

    // handleMsg(obj, sendFc);

    const sendFc = async (obj: ObjType, timeout: number) => {
      try {
        await new Promise((resolve, reject) => {
          if (!obj || !obj.method)
            return resolve({ method: "err", msg: "invalid method" });
          obj.req = msgObj.add(resolve, timeout);
          const str = JSON.stringify(obj);
          ws.send(str);
          console.log("[INFO] Send Message " + str);
        });
      } catch (e) {
        console.error("[ ERROR ]" + e);
      }
    };
  });
}

function init() {
  let args = process.argv,
    reg;
  args.forEach((arg, i) => {
    if ((reg = /^--(.+)$/.exec(arg))) app[reg[1]] = args[++i];
  });
  console.log("[ info ]", app);

  RunApp()
}
init();
