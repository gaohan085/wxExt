import "dotenv/config";
import path from "path";
import { cwd } from "process";
import * as database from "../../database";
import { ObjType } from "../app";
import { Method } from "../method";
import { artificialHandler } from "./artificial-handler";
import { keyworsHandler } from "./keywords-handler";

export async function msgHandler(
  obj: ObjType,
  sendFunc: (obj: ObjType, timeout?: number) => Promise<void>
) {
  await database.model.msg.MsgCreateRec(obj);
  const keywords = await database.model.keyword.keywordModel.find().exec();
  const adminWxid = process.env.ADMIN_WXID;

  //如果该用户的对话状态为人工，则取消自动回复
  const dialog = await database.model.dialog.DialogQuery({
    wxid: obj.data?.fromid as string,
  });
  if (dialog && dialog.dialogState === "artificial") return;

  switch (obj.data?.msg) {
    case "帮助":
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
      break;

    case "人工":
      await artificialHandler(obj, sendFunc);
      break;

    case "文件":
      await sendFunc(
        Method.sendFile(obj.data?.fromid as string, path.join(cwd(), "ttf.zip"))
      );
      break;

    default:
      await keyworsHandler(obj, sendFunc);
      break;
  }
}
