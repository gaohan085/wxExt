import { scheduleJob } from "node-schedule";
import * as database from "../../database";
import type { ObjType, SendFunc } from "../app";
import { Method } from "../method";
import * as lib from "../../lib";

const startTime = lib.config.artificialStart,
  endTime = lib.config.artificialEnd;

export async function artificialHandler(obj: ObjType, sendFunc: SendFunc) {
  const timeNow = new Date(),
    currTime = new Date();
  const timeDelay = new Date(timeNow);
  const currDate = `${currTime.getFullYear()}-${String(
    currTime.getMonth() + 1
  ).padStart(2, "0")}-${currTime.getDate()}`;

  const queueLength = await database.model.dialog.DialogQueueLength();

  if (
    currTime > new Date(`${currDate}T${startTime}`) &&
    currTime < new Date(`${currDate}T${endTime}`)
  ) {
    if (queueLength < 5) {
      await database.model.dialog.UpdateDialogState(
        {
          wxid: obj.data?.fromid as string,
        },
        {
          nickName: obj.data?.nickName as string,
          wxid: obj.data?.fromid as string,
          dialogState: "artificial",
        }
      );

      //设置定时任务 5分钟后将设置成 “人工” 状态的对话设置为自动回复
      scheduleJob(timeDelay.setMinutes(timeNow.getMinutes() + 10), async () => {
        await database.model.dialog.UpdateDialogState(
          {
            wxid: obj.data?.fromid as string,
          },
          {
            nickName: obj.data?.nickName as string,
            wxid: obj.data?.fromid as string,
            dialogState: "auto",
          }
        );
        await sendFunc(
          Method.sendText(
            obj.data?.fromid as string,
            "已结束人工服务，如再次需要人工服务请发送【人工】"
          )
        );
      });

      await sendFunc(
        Method.sendText(
          obj.data?.fromid as string,
          "正在转到人工服务。\n提示：人工服务时长为10分钟，10分钟后自动结束人工服务。"
        )
      );
      await sendFunc(
        Method.tips("人工服务", `${obj.data?.nickName} 需要人工服务！`)
      );
      return;
    }
    await sendFunc(
      Method.sendText(
        obj.data?.fromid as string,
        "当前有超过5人正在使用人工服务，请稍后再试，谢谢。"
      )
    );
    return;
  }
  await sendFunc(
    Method.sendText(obj.data?.fromid as string, "该时间无人工服务")
  );
  return;
}
