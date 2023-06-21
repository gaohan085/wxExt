import { model, Schema } from "mongoose";

type cash = {
  payerWxid: string;
  payerNickName: string;
  transferMount: number;
  date?: Date;
};

const cashSchema = new Schema<cash>({
  payerWxid: { type: String, required: true },
  payerNickName: String,
  transferMount: { type: Number },
  date: { type: Date, default: new Date() },
});

export const CashModel = model("cash", cashSchema);

export const CashAddRecord = async (cashRec: cash) => {
  return await CashModel.create({ ...cashRec });
};
