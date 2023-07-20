import { XMLParser } from "fast-xml-parser";
import { exec } from "node:child_process";
import { existsSync } from "node:fs";
import * as database from "../../database";
import * as lib from "../../lib";
import { ObjType } from "../app";
import { Method } from "../method";

const archievePath = lib.config.archievePath,
  historyPkgPrice = lib.config.historyPkgPrice,
  permanentMemPrice = lib.config.permenentMemberPrice,
  dailyPrice = lib.config.dailyPrice,
  imgPath = lib.config.imgPath;

export type cashXMLtype = {
  "?xml": string;
  msg: {
    appmsg: {
      titile: string;
      des: string;
      action: string;
      type: number;
      content: string;
      url: string;
      thumburl: string;
      lowurl: string;
      extinfo: string;
      wcpayinfo: {
        paysubtype: number;
        feedesc: string;
        transcationid: string;
        transferid: string;
        invalidtime: number;
        begintransfertime: number;
        effectivedate: number;
        pay_memo: string;
        receiver_username: string;
        payer_username: string;
      };
    };
  };
};

const parser = new XMLParser({
  numberParseOptions: {
    hex: false,
    leadingZeros: true,
    eNotation: false,
  },
});

export async function cashHandler(
  obj: ObjType,
  sendFunc: (obj: ObjType, timeout?: number) => Promise<void>
) {
  if (obj.data?.msg?.includes('<?xml version="1.0"?>')) {
    try {
      const xmlData = parser.parse(obj.data?.msg) as cashXMLtype;
      const transferid = xmlData.msg.appmsg.wcpayinfo.transferid;
      const feedesc = xmlData.msg.appmsg.wcpayinfo.feedesc;
      const feedescNum = feedesc
        .slice(feedesc.indexOf("￥") + 1)
        .replaceAll(",", "");

      const lastMsg = (
        await database.model.msg.MsgModel.find({
          fromid: obj.data?.fromid,
        }).exec()
      )
        .sort((a, b) => {
          return a.time.getTime() - b.time.getTime();
        })
        .at(-1);

      const currDateStr = lib.dateStr();

      if (!lastMsg?.msg) {
        await sendFunc(Method.refuseCash(obj.data.fromid, transferid));
        await sendFunc(
          Method.sendText(obj.data.fromid, "请发送关键词后再按照提示付款")
        );
        return;
      } else {
        const dateStr =
          /^(19|20\d{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/.exec(
            lastMsg.msg
          );
        switch (lastMsg?.msg) {
          case "取图":
            if (Number(historyPkgPrice) !== Number(feedescNum)) {
              await sendFunc(Method.refuseCash(obj.data?.fromid, transferid));
              await sendFunc(
                Method.sendText(obj.data.fromid, "请按照提示付款")
              );
            } else {
              await sendFunc(Method.agreeCash(obj.data?.fromid, transferid));
              await database.model.cash.CashAddRecord({
                wxid: obj.data?.fromid,
                nickName: obj.data?.nickName,
                transferMount: Number(feedescNum),
                usage: lastMsg?.msg,
              });
              await database.model.member.UpdateMemberRole(
                { wxid: obj.data.fromid },
                {
                  nickName: obj.data.nickName,
                  wxid: obj.data.fromid,
                  role: "paid member",
                }
              );
              await sendFunc(
                Method.sendFile(obj.data.fromid, `${archievePath}图包.zip`)
              );
            }
            break;

          case "永久会员":
            if (
              (await database.model.cash.CashModel.findOne({
                wxid: obj.data.fromid,
                usage: "取图",
              }).exec()) &&
              Number(feedescNum) ===
                Number(permanentMemPrice) - Number(historyPkgPrice)
            ) {
              await sendFunc(Method.agreeCash(obj.data?.fromid, transferid));
              await database.model.cash.CashAddRecord({
                wxid: obj.data?.fromid,
                nickName: obj.data?.nickName,
                transferMount: Number(feedescNum),
                usage: lastMsg?.msg,
              });
              await database.model.member.UpdateMemberRole(
                { wxid: obj.data.fromid },
                {
                  wxid: obj.data.fromid,
                  nickName: obj.data.nickName,
                  role: "permanent member",
                }
              );
              await sendFunc(
                Method.sendText(
                  obj.data.fromid,
                  "您已成功成为永久会员，永久会员图包将在每日17：30发送"
                )
              );
            } else if (Number(feedescNum) === Number(permanentMemPrice)) {
              await sendFunc(Method.agreeCash(obj.data?.fromid, transferid));
              await database.model.cash.CashAddRecord({
                wxid: obj.data?.fromid,
                nickName: obj.data?.nickName,
                transferMount: Number(feedescNum),
                usage: lastMsg?.msg,
              });
              await database.model.member.UpdateMemberRole(
                {},
                {
                  wxid: obj.data.fromid,
                  nickName: obj.data.nickName,
                  role: "permanent member",
                }
              );
              await sendFunc(
                Method.sendText(
                  obj.data.fromid,
                  "您已成功成为永久会员，永久会员图包将在每日17：30发送"
                )
              );
            } else {
              await sendFunc(Method.refuseCash(obj.data.fromid, transferid));
              await sendFunc(
                Method.sendText(obj.data.fromid, "请按照提示付款")
              );
            }
            break;

          case "今日图包":
            if (Number(feedescNum) === Number(dailyPrice)) {
              if (
                existsSync(`${imgPath}${currDateStr}`) &&
                !existsSync(`${archievePath}${currDateStr}.zip`)
              ) {
                exec(
                  `7z.exe a -tzip ${archievePath}${currDateStr}.zip ${imgPath}${currDateStr}\\* "-xr!*.txt" "-xr!成稿视频" "-xr!*.mp4"`,
                  async () => {
                    await sendFunc(
                      Method.refuseCash(obj.data?.fromid as string, transferid)
                    );
                    await database.model.cash.CashAddRecord({
                      wxid: obj.data?.fromid as string,
                      nickName: obj.data?.nickName as string,
                      transferMount: Number(feedescNum),
                      usage: lastMsg?.msg,
                    });
                    sendFunc(
                      Method.sendFile(
                        obj.data?.fromid as string,
                        `${archievePath}${currDateStr}.zip`
                      )
                    );
                  }
                );
              } else if (existsSync(`${archievePath}${currDateStr}.zip`)) {
                await sendFunc(
                  Method.refuseCash(obj.data?.fromid as string, transferid)
                );
                await database.model.cash.CashAddRecord({
                  wxid: obj.data?.fromid as string,
                  nickName: obj.data?.nickName as string,
                  transferMount: Number(feedescNum),
                  usage: currDateStr,
                });
                sendFunc(
                  Method.sendFile(
                    obj.data?.fromid as string,
                    `${archievePath}${currDateStr}.zip`
                  )
                );
              } else {
                await sendFunc(
                  Method.refuseCash(obj.data.fromid as string, transferid)
                );
                await sendFunc(Method.sendText(obj.data.fromid, "今日无图包"));
              }
            } else {
              await sendFunc(
                Method.refuseCash(obj.data.fromid as string, transferid)
              );
              await sendFunc(
                Method.sendText(obj.data.fromid, "请按照提示转账")
              );
            }
            break;

          default:
            if (
              !dateStr &&
              Number(feedescNum) ===
                (await database.model.keyword.QueryByKeyword(lastMsg?.msg))
                  ?.price
            ) {
              await sendFunc(Method.agreeCash(obj.data?.fromid, transferid));
              await database.model.cash.CashAddRecord({
                wxid: obj.data?.fromid,
                nickName: obj.data?.nickName,
                transferMount: Number(feedescNum),
                usage: lastMsg?.msg,
              });
              await sendFunc(
                Method.sendFile(
                  obj.data?.fromid,
                  `${archievePath}${lastMsg?.msg}.zip`
                )
              );
            } else if (dateStr && Number(feedescNum) === Number(dailyPrice)) {
              await sendFunc(
                Method.agreeCash(obj.data.fromid as string, transferid)
              );
              await database.model.cash.CashAddRecord({
                wxid: obj.data?.fromid,
                nickName: obj.data?.nickName,
                transferMount: Number(feedescNum),
                usage: lastMsg?.msg,
              });
              await sendFunc(
                Method.sendFile(
                  obj.data.fromid,
                  `${archievePath}${lastMsg?.msg}.zip`
                )
              );
            } else {
              await sendFunc(Method.refuseCash(obj.data?.fromid, transferid));
              await sendFunc(
                Method.sendText(obj.data.fromid, "请按照提示付款")
              );
            }
            break;
        }

        return;
      }
    } catch (e) {
      lib.log.error(e as string);
      if (e instanceof TypeError) {
        return;
      }
      return;
    }
  }
  return;
}
