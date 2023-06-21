import * as log from "../lib/log";
import { type ObjType } from "./app";
import { cashHandler } from "./handler/cash-handler";
import { msgHandler } from "./handler/msg-handler";
import { Method } from "./method";

export default async function handleMsg(
  obj: ObjType,
  sendFunc: (obj: ObjType, timeout?: number) => Promise<void>
) {
  if (process.env.NODE_ENV === "development")
    log.info("Receive message" + JSON.stringify(obj));

  if (!obj.data) {
    log.silly("Not a message");
    return;
  }
  if (obj.data.fromid === obj.data.myid) {
    obj.data.fromid = obj.data.toid;
  }

  switch (obj.type) {
    //收到文本消息
    case 1:
    case 3:
    case 47:
      await msgHandler(obj, sendFunc);
      break;

    case 49 /** `转账` 小程序 外部链接 {只处理转账} */:
      await cashHandler(obj, sendFunc);
      break;

    //框架过期提示
    case 729:
      await sendFunc(Method.tips("通知", "框架授权即将过期，请重新授权"));
      break;
    default:
      break;
  }
}
