import { Schema, model } from "mongoose";

type Keywords = {
  keyword: string;
  usage: "file";
  filePath: string;
  time?: Date;
  price: number;
};

const keywordSchema = new Schema<Keywords>({
  keyword: { type: String, unique: true, required: true },
  usage: { type: String, default: "file" },
  filePath: String,
  price: { type: Number, required: true, default: 0 },
  time: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

export const keywordModel = model("Keyword", keywordSchema);
export const keywordCreate = async (
  keyword: Pick<Keywords, "keyword" | "filePath"| "price">
) => {
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
