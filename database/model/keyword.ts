import { Schema, model } from "mongoose";

type Keywords = {
  keyword: string;
  keywordReply: string;
  time?: Date;
};

const keywordSchema = new Schema<Keywords>({
  keyword: { type: String, unique: true, required: true },
  keywordReply: { type: String, required: true },
  time: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

export const keywordModel = model("Keyword", keywordSchema);
export const keywordCreate = async (keyword: Keywords) => {
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
  await keywordModel
    .findOneAndUpdate(
      { keyword },
      { keyword: keyword, keywordReply: keywordReply }
    )
    .exec();
}
