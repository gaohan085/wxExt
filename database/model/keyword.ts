import { Schema, model } from "mongoose";

type keywords = {
  keyword: string;
  keywordReply: string;
};

const keywordSchema = new Schema<keywords>({
  keyword: { type: String, unique: true, required: true },
  keywordReply: { type: String, required: true },
});

export const keywordModel = model("keyword", keywordSchema);
export const keywordCreate = async (keyword: keywords) => {
  return await keywordModel.create({ ...keyword });
};
