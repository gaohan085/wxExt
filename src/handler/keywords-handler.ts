import type { ObjType, SendFunc } from "../app";
import "dotenv/config";
import * as database from "../../database";
import { Method } from "../method";
import { existsSync } from "fs";

interface MongooseErrorType extends ErrorConstructor {
  code: number;
}

const adminWxid = process.env.ADMIN_WXID as string;
const archievePath = process.env.ARCHIEVE_PATH as string;

export async function keyworsHandler(obj: ObjType, sendFunc: SendFunc) {
  const msg = obj.data?.msg as string;
  const keywordAdd = /添加 (.{1,9}) (.{1,9})/.exec(msg);
  const keywordDel = /删除 (.{1,9})/.exec(msg);
  const keywords = await database.model.keyword.keywordModel.find().exec();

  if (keywordAdd) {
    if (obj.data?.fromid === adminWxid && adminWxid) {
      try {
        if (existsSync(`${archievePath}${keywordAdd[1]}.zip`)) {
          await database.model.keyword.keywordCreate({
            keyword: keywordAdd[1],
            filePath: `${archievePath}${keywordAdd[1]}.zip`,
            price: Number(keywordAdd[2]),
          });
          await sendFunc(
            Method.sendText(
              obj.data?.fromid as string,
              `添加关键词【${keywordAdd[1]}】成功!`
            )
          );
        } else {
          sendFunc(
            Method.sendText(
              obj.data.fromid as string,
              `添加关键词失败。关键词对应资源不存在，请检查`
            )
          );
        }
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
            `删除关键词【${keywordDel[1]}】成功!`
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

  if (keywords.map((k) => k.keyword).includes(obj.data?.msg as string)) {
    //查询数据库中有无对应关键词的转账记录
    const transferRec = await database.model.cash.CashModel.findOne({
      wxid: obj.data?.fromid as string,
      usage: obj.data?.msg,
    }).exec();
    if (!transferRec?.id) {
      const price = keywords.find(
        (k) => k.keyword === (obj.data?.msg as string)
      )?.price;
      await sendFunc(
        Method.sendText(
          obj.data?.fromid as string,
          `该资源售价为${price},转账后自动发送资源文件。\n注意:\n**不支持红包\n**付款后可不限次数发送关键词获取该资源文件\n**系统按照付款前最后一条消息关键词发送文件，请在付款前不要随意发送消息\n**虚拟产品，因可复制，售出概不退款。`
        )
      );
      return;
    } else {
      await sendFunc(
        Method.sendFile(
          obj.data?.fromid as string,
          `${archievePath}${obj.data?.msg}.zip`
        )
      );
      return;
    }
  }

  await sendFunc(Method.sendText(obj.data?.fromid as string, "你好"));
  return;
}
