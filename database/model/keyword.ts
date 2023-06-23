import { Schema, model } from "mongoose";
import { log } from "../../lib";

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

/**
 * @returns 返回所有关键词及关键词回复
 */
export const QueryKeywords = async () => {
  return await keywordModel.find().exec();
};

export async function QueryByKeyword(keyword: string) {
  return await keywordModel.findOne({ keyword }).exec();
}

export async function QueryAndDel(keyword: string) {
  return await keywordModel.findOneAndDelete({ keyword }).exec();
}

export async function QueryAndUpdate(keyword: string, keywordReply: string) {
  log.warn(keyword);
  log.warn(keywordReply);
  await keywordModel.findOneAndUpdate(
    { keyword },
    { keyword: keyword, keywordReply: keywordReply },
    { new: true }
  ).exec();
}
