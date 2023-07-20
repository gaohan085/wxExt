import { scheduleJob } from "node-schedule";
import { exec } from "node:child_process";
import * as database from "../database";
import type { SendFunc } from "../src/app";
import { Method } from "../src/method";
import * as config from "./config";
import { dateStr } from "./date-str";

const archievePath = config.archievePath,
  imgPath = config.imgPath,
  adminWxid = config.adminWxid;

export function scheduleArchive(sendFunc: SendFunc) {
  scheduleJob({ hour: 17, minute: 15 }, () => {
    exec(
      `7z.exe u -tzip ${archievePath}图包.zip ${imgPath}* "-xr!*.txt" "-xr!成稿视频" "-xr!*.mp4"`,
      () => {
        sendFunc(Method.sendText(adminWxid as string, "压缩历史图包成功"));
      }
    );
  });
}

export function scheduleArchiveToday(sendFunc: SendFunc) {
  scheduleJob({ hour: 17, minute: 20 }, () => {
    exec(
      `7z.exe u -tzip ${archievePath}${dateStr()}.zip ${imgPath}${dateStr()}\\* "-xr!*.txt" "-xr!成稿视频" "-xr!*.mp4"`,
      () => {
        sendFunc(Method.sendText(adminWxid as string, "压缩今日图包成功"));
      }
    );
  });
}

export function scheduleSendFile(sendFunc: SendFunc) {
  scheduleJob({ hour: 17, minute: 25 }, async () => {
    const permenentMember = await database.model.member.MemberModel.find({
      role: "permanent member",
    }).exec();

    permenentMember.forEach(async (p) => {
      await sendFunc(
        Method.sendFile(p.wxid, `${archievePath}${dateStr()}.zip`)
      );
    });
  });
}
