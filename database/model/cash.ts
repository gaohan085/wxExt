import "dotenv/config";
import { model, Schema } from "mongoose";
import * as member from "./member";

const { HISTORY_PACKAGE_PRICE, PERMENENT_MEMBER_PRICE } = process.env;

type Cash = {
  wxid: string;
  nickName: string;
  transferMount: number;
  time: Date;
  usage: "getimg" | "paid member" | "permanent member" | string;
};

const cashSchema = new Schema<Cash>({
  wxid: { type: String, required: true },
  nickName: String,
  transferMount: Number,
  time: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  usage: { type: String, default: "visitor" },
});

export const CashModel = model("Cash", cashSchema);

export const CashAddRecord = async (cashRec: Omit<Cash, "time">) => {
  //DONE TEST
  await CashModel.create({
    wxid: cashRec.wxid,
    nickName: cashRec.nickName,
    transferMount: cashRec.transferMount,
    time: new Date(),
    usage: cashRec.usage,
  });

  await member.UpdateMemberRole(cashRec.wxid, {
    nickName: cashRec.nickName,
    wxid: cashRec.wxid,
    role:
      cashRec.transferMount === Number(PERMENENT_MEMBER_PRICE)
        ? "onlooker"
        : cashRec.transferMount === Number(HISTORY_PACKAGE_PRICE)
        ? "paid member"
        : cashRec.transferMount === Number(PERMENENT_MEMBER_PRICE)
        ? "permanent member"
        : "visitor",
  });

  return;
};
