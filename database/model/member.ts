import { model, Schema } from "mongoose";

type MemberInterface = {
  name: string;
  wxid: string;
  joinDate?: Date;
  role: "administrator" | "paid member" | "permanent membership";
};

const memberSchema = new Schema<MemberInterface>({
  name: String,
  wxid: { unique: true, type: String, required: true },
  joinDate: { type: Date, default: new Date() },
});

export const Member = model("Member", memberSchema);
