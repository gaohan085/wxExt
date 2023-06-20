import { type ObjType } from "../../src/app";
import { Schema, model } from "mongoose";

type MsgType = {
  fromid: string;
  msg: string;
  time: Date;
};

const MsgSchema = new Schema<MsgType>({
  fromid: { type: String, required: true },
  msg: String,
  time: { type: Date, default: new Date() },
});

export const MsgModel = model("Msg", MsgSchema);

/**
 * 在数据库创建聊天记录
 * @param obj 
 */
export async function createMsgRec(obj: ObjType) {
  await MsgModel.create({ fromid: obj.data?.fromid, msg: obj.data?.msg });
}
