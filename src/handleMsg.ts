import { type ObjType } from "./app";
import * as log from "../lib/log";
import { Method } from "./method";
import * as database from "../database";

export default async function handleMsg(
  obj: ObjType,
  sendFunc: (obj: ObjType, timeout?: number) => Promise<void>
) {
  log.info("Receive message" + JSON.stringify(obj));

  if (!obj.data) {
    log.silly("Not a message");
    return;
  }
  if (obj.data.fromid === obj.data.myid) {
    obj.data.fromid = obj.data.toid;
  }

  if (obj.type === 1) {
    await database.Msg.createMsgRec(obj);
    await sendFunc(Method.sendText(obj.data.fromid as string, "你好"));
  }
}
