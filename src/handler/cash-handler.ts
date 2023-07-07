import "dotenv/config";
import { XMLParser } from "fast-xml-parser";
import * as database from "../../database";
import { log } from "../../lib";
import { ObjType } from "../app";
import { Method } from "../method";

const archievePath = process.env.ARCHIEVE_PATH as string;

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
      const xmlData = parser.parse(obj.data?.msg as string) as cashXMLtype;
      const transferid = xmlData.msg.appmsg.wcpayinfo.transferid;
      const feedesc = xmlData.msg.appmsg.wcpayinfo.feedesc;
      const feedescNum = feedesc
        .slice(feedesc.indexOf("￥") + 1)
        .replaceAll(",", "");

      const lastMsg = (
        await database.model.msg.MsgModel.find({
          fromid: obj.data?.fromid as string,
        }).exec()
      )
        .sort((a, b) => {
          return a.time.getTime() - b.time.getTime();
        })
        .at(-1);
      log.warn(JSON.stringify(lastMsg));

      await database.model.cash.CashAddRecord({
        wxid: obj.data?.fromid as string,
        nickName: obj.data?.nickName as string,
        transferMount: Number(feedescNum),
        usage: lastMsg?.msg as string,
      });

      await sendFunc(Method.agreeCash(obj.data?.fromid as string, transferid));

      await sendFunc(
        Method.sendFile(
          obj.data?.fromid as string,
          `${archievePath}${lastMsg?.msg}.zip`
        )
      );
    } catch (e) {
      log.error(e as string);
      if (e instanceof TypeError) {
        return;
      }
      return;
    }
  }
  return;
}
