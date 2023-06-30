import { type ObjType } from "../../src/app";
import { Schema, model } from "mongoose";

type MsgType = {
  fromid: string;
  nickName: string;
  msg: string;
  time: Date;
};

const MsgSchema = new Schema<MsgType>({
  fromid: { type: String, required: true },
  nickName: String,
  msg: String,
  time: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

export const MsgModel = model("Msg", MsgSchema);

/**
 * 在数据库创建聊天记录
 * @param obj
 */
export async function MsgCreateRec(obj: ObjType) {
  return await MsgModel.create({
    fromid: obj.data?.fromid,
    nickName: obj.data?.nickName,
    msg: obj.data?.msg,
  });
}
