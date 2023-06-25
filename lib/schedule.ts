import { scheduleJob } from "node-schedule";
import { ObjType } from "../src/app";
import { Method } from "../src/method";

export function scheduleActivate(
  sendFunc: (obj: ObjType, timeout?: number) => Promise<void>
) {
  scheduleJob({ hour: 11, minute: 50 }, async () => {
    sendFunc(Method.tips("提示", "框架激活即将过期，请及时激活"));
  });
}
