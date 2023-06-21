import { ObjType } from "../app";
import * as database from "../../database";
import { Method } from "../method";
import { log } from "../../lib";

export async function msgHandler(
  obj: ObjType,
  sendFunc: (obj: ObjType, timeout?: number) => Promise<void>
) {
  log.warn(obj.data?.fromid as string)
  await database.model.msg.MsgCreateRec(obj)
  await sendFunc(Method.sendText(obj.data?.fromid as string, "你好"));
}
