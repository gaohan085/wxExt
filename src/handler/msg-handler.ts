import "dotenv/config";
import { ObjType } from "../app";
import * as database from "../../database";
import { Method } from "../method";
import { scheduleJob } from "node-schedule";

interface MongooseErrorType extends ErrorConstructor {
  code: number;
}

export async function msgHandler(
  obj: ObjType,
  sendFunc: (obj: ObjType, timeout?: number) => Promise<void>
) {
  await database.model.msg.MsgCreateRec(obj);
  const keywords = await database.model.keyword.keywordModel.find().exec();
  const msg = obj.data?.msg as string;
  const adminWxid = process.env.ADMIN_WXID;

  const keywordAdd = /添加 (.{1,9}) (.{1,300})/.exec(msg);
  const keywordDel = /删除 (.{1,9})/.exec(msg);
  const keywordModify = /修改 (.{1,9}) (.{1,300})/.exec(msg);

  //如果该用户的对话状态为人工，则取消自动回复
  const dialog = await database.model.dialog.DialogQuery({
    wxid: obj.data?.fromid as string,
  });
  if (dialog && dialog.dialogState === "artificial") return;

  if (msg === "帮助") {
    await sendFunc(
      Method.sendText(
        obj.data?.fromid as string,
        (obj.data?.fromid as string) === adminWxid
          ? `关键词回复\n添加关键词: 添加 xx xxx\n删除关键词: 删除 xx \n修改关键词: 修改 xx xxx \n当前关键词${keywords
              .map((k) => k.keyword)
              .join(", ")}`
          : `当前关键词\n${keywords.map((k) => k.keyword).join(", ")}`
      )
    );
  } else if (keywords.map((k) => k.keyword).includes(msg)) {
    await sendFunc(
      Method.sendText(
        obj.data?.fromid as string,
        (
          await database.model.keyword.QueryByKeyword(msg)
        )?.keywordReply as string
      )
    );
  } else if (keywordAdd) {
    if (obj.data?.fromid === adminWxid && adminWxid) {
      try {
        await database.model.keyword.keywordCreate({
          keyword: keywordAdd[1],
          keywordReply: keywordAdd[2],
        });
        await sendFunc(
          Method.sendText(
            obj.data?.fromid as string,
            `添加关键词成功!\n关键词：${keywordAdd[1]} 关键词回复：${keywordAdd[2]}`
          )
        );
      } catch (e) {
        const err = e as MongooseErrorType;
        if (err.code === 11000 && err.name === "MongoServerError") {
          await sendFunc(
            Method.sendText(
              obj.data?.fromid as string,
              `关键词已存在，添加失败`
            )
          );
        }
      }
    } else {
      await sendFunc(
        Method.sendText(obj.data?.fromid as string, "非管理员, 添加关键词失败")
      );
    }
  } else if (keywordDel) {
    if (obj.data?.fromid === adminWxid && adminWxid) {
      try {
        await database.model.keyword.QueryAndDel(keywordDel[1]);
        await sendFunc(
          Method.sendText(
            obj.data?.fromid as string,
            `删除关键词成功!\n关键词：${keywordDel[1]}`
          )
        );
      } catch (e) {
        await sendFunc(
          Method.sendText(obj.data?.fromid as string, `关键词不存在`)
        );
      }
    } else {
      await sendFunc(
        Method.sendText(obj.data?.fromid as string, "非管理员, 删除关键词失败")
      );
    }
  } else if (keywordModify) {
    if (obj.data?.fromid === adminWxid && adminWxid) {
      try {
        await database.model.keyword.QueryAndUpdate(
          keywordModify[1],
          keywordModify[2]
        );
        await sendFunc(
          Method.sendText(
            obj.data?.fromid as string,
            `修改关键词成功:\n关键词：${keywordModify[1]} ${keywordModify[2]}`
          )
        );
      } catch (e) {
        console.log(e);
      }
    } else {
      await sendFunc(
        Method.sendText(obj.data?.fromid as string, "非管理员, 修改关键词失败")
      );
    }
  } else if (msg === "人工") {
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

    //设置定时任务 10分钟后将设置成 “人工” 状态的对话设置为自动回复
    const timeNow = new Date();
    const timeDelay = new Date(timeNow);
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
          "已结束人工服务，如再次需要人工服务请发送“人工”"
        )
      );
    });

    await sendFunc(
      Method.sendText(obj.data?.fromid as string, "正在转到人工服务")
    );
    await sendFunc(
      Method.tips("人工服务", `${obj.data?.nickName}需要人工服务！`)
    );
  } else {
    await sendFunc(Method.sendText(obj.data?.fromid as string, "你好"));
  }
}
