import { model, Schema } from "mongoose";

export type MemberInterface = {
  nickName: string;
  wxid: string;
  joinDate?: Date;
  role: "administrator" | "paid member" | "permanent member";
};

const memberSchema = new Schema<MemberInterface>({
  nickName: String,
  wxid: { unique: true, type: String, required: true },
  joinDate: { type: Date, default: () => {
    return new Date();
  } },
});

export const MemberModel = model("Member", memberSchema);
export const MemberCreate = async (member: MemberInterface) => {
  return await MemberModel.create({ ...member });
};
