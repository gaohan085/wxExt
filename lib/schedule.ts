import { scheduleJob } from "node-schedule";
import type { SendFunc } from "../src/app";
import { Method } from "../src/method";
import { exec } from "node:child_process";
import { log } from ".";
import * as database from "../database";
import { cwd } from "node:process";
import path from "node:path";

export function scheduleArchive(sendFunc: SendFunc) {
  scheduleJob({ hour: 15, minute: 25 }, () => {
    const date = new Date();
    const dayStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}${date.getDate()}`;
    exec(
      '7z.exe u -tzip 图包.zip E:\\workspace\\AI\\成稿\\* "-xr!*.txt" "-xr!成稿视频" "-xr!*.mp4"',
      (stdout) => {
        log.info(JSON.stringify(stdout));
        sendFunc(Method.tips("压缩文件", "压缩历史图包成功"));
      }
    );
  });
}

export function scheduleArchiveToday(sendFunc: SendFunc) {
  scheduleJob({ hour: 20, minute: 5 }, () => {
    const date = new Date();
    const dayStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}${date.getDate()}`;

    exec(
      `7z.exe a -tzip ${dayStr}-今日图包.zip E:\\workspace\\AI\\成稿\\${dayStr}* "-xr!*.txt" "-xr!成稿视频" "-xr!*.mp4"`,
      (stdout) => {
        log.info(JSON.stringify(stdout));
        sendFunc(Method.tips("压缩文件", "压缩今日图包成功"));
      }
    );
  });
}

export function scheduleSendFile(sendFunc: SendFunc) {
  scheduleJob({ hour: 20, minute: 0 }, async () => {
    const date = new Date();
    const dayStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}${date.getDate()}`;
    const permenentMember = await database.model.member.MemberModel.find({
      role: "permanent member",
    }).exec();

    permenentMember.forEach(async (p) => {
      await sendFunc(Method.sendFile(p.wxid, path.join(cwd(), `${dayStr}-今日图包.zip`)));
    });
  });
}
