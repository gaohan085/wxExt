import "dotenv/config";
import * as database from "../../database";
import { ObjType } from "../app";
import { Method } from "../method";
import { artificialHandler } from "./artificial-handler";
import { keyworsHandler } from "./keywords-handler";

const historyPkgPrice = process.env.HISTORY_PACKAGE_PRICE;
const permanentMemPrice = process.env.PERMENENT_MEMBER_PRICE as string;

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
            ? `回复关键词按照提示即可取资源\n关键词回复\n添加关键词: 添加 xx {售价}\n删除关键词: 删除 xx \n当前资源关键词: \n${keywords
                .map((k) => k.keyword)
                .join("\n")}`
            : `**回复关键词按照提示即可取资源，\n当前资源关键词: \n${keywords
                .map((k) => k.keyword)
                .join("\n")}\n`
        )
      );
      break;

    case "人工":
      await artificialHandler(obj, sendFunc);
      break;

    case "取图":
      await sendFunc(
        Method.sendText(
          obj.data.fromid,
          `历史图包价格为${historyPkgPrice}元，付款后自动发送历史图包\n*建议成为永久会员获取永久更新，永久会员价格为${permanentMemPrice},想要成为永久会员请发送【永久会员】。\n注意:\n**不支持红包\n**历史图包不支持重复获取\n**系统按照付款前最后一条消息关键词发送文件，请在付款前不要发送其他无关消息\n**虚拟产品，因可复制，售出概不退款。`
        )
      );
      break;

    case "永久会员":
      if (
        await database.model.cash.CashModel.findOne({
          wxid: obj.data.fromid,
          usage: "取图",
        }).exec()
      ) {
        await sendFunc(
          Method.sendText(
            obj.data.fromid,
            `您已有取图历史记录，只需补齐差价即可成为永久会员，差价为${
              Number(permanentMemPrice) - Number(historyPkgPrice)
            }`
          )
        );
      } else {
        await sendFunc(
          Method.sendText(
            obj.data.fromid,
            `永久会员价格为${permanentMemPrice}}。\n注意:\n**不支持红包\n**永久会员图包每日17：30发送\n**系统按照付款前最后一条消息关键词发送文件，请在付款前不要发送其他无关消息\n**虚拟产品，因可复制，售出概不退款。`
          )
        );
      }
      break;

    default:
      await keyworsHandler(obj, sendFunc);
      break;
  }
}
