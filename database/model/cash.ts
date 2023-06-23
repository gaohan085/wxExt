import { model, Schema } from "mongoose";

type Cash = {
  payerWxid: string;
  payerNickName: string;
  transferMount: number;
  time: Date;
};

const cashSchema = new Schema<Cash>({
  payerWxid: { type: String, required: true },
  payerNickName: String,
  transferMount: Number,
  time: { type: Date, default: new Date() },
});

export const CashModel = model("Cash", cashSchema);

export const CashAddRecord = async (cashRec: Omit<Cash, "time">) => {
  return await CashModel.create({ ...cashRec });
};
