import type { ObjType, SendFunc } from "../app";
import "dotenv/config";
import * as database from "../../database";
import { Method } from "../method";

interface MongooseErrorType extends ErrorConstructor {
  code: number;
}

const adminWxid = process.env.ADMIN_WXID as string;

export async function keyworsHandler(obj: ObjType, sendFunc: SendFunc) {
  const msg = obj.data?.msg as string;
  const keywordAdd = /添加 (.{1,9}) (.{1,300})/.exec(msg);
  const keywordDel = /删除 (.{1,9})/.exec(msg);
  const keywordModify = /修改 (.{1,9}) (.{1,300})/.exec(msg);
  const keywords = await database.model.keyword.keywordModel.find().exec();

  if (keywordAdd) {
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

    return;
  }
  if (keywordDel) {
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
    return;
  }
  if (keywordModify) {
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
    return;
  }
  if (keywords.map((k) => k.keyword).includes(obj.data?.msg as string)) {
    await sendFunc(
      Method.sendText(
        obj.data?.fromid as string,
        keywords[
          keywords.map((k) => k.keyword).indexOf(obj.data?.msg as string)
        ].keywordReply
      )
    );
    return;
  }
  await sendFunc(Method.sendText(obj.data?.fromid as string, "你好"));
  return;
}
