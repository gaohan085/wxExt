import "dotenv/config";
import { model, Schema } from "mongoose";

export type Cash = {
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
    usage: cashRec.usage,
  });
  return;
};
