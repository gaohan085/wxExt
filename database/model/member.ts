import { model, Schema } from "mongoose";

export type MemberInterface = {
  nickName: string;
  wxid: string;
  joinDate?: Date;
  role:
    | "administrator"
    | "paid member"
    | "permanent member"
    | "onlooker"
    | "visitor";
};

const memberSchema = new Schema<MemberInterface>({
  nickName: String,
  wxid: { unique: true, type: String, required: true },
  joinDate: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  role: { type: String, default: "visitor" },
});

export const MemberModel = model("Member", memberSchema);
export const MemberCreate = async (member: MemberInterface) => {
  return await MemberModel.create({ ...member });
};

/**
 * 更新成员角色
 * @param filter 成员wxid
 * @param updater 成员新的角色
 */
export const UpdateMemberRole = async (
  //DONE test
  filter?: Partial<MemberInterface>,
  updater?: MemberInterface
) => {
  await MemberModel.findOneAndUpdate(filter, updater, { upsert: true }).exec();
};
