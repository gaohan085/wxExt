import { model, Schema } from "mongoose";

export type DialogState = {
  nickName: string;
  wxid: string;
  dialogState?: "auto" | "artificial";
  time?: Date;
};

const dialogSchema = new Schema<DialogState>({
  nickName: { type: String, required: true },
  wxid: { type: String, required: true, unique: true },
  dialogState: { type: String, default: "auto" },
  time: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

export const dialogStateModel = model("dialogState", dialogSchema);

export async function CreateDialogState(dialog: DialogState) {
  await dialogStateModel.create({ ...dialog });
}

export const UpdateDialogState = async (
  filter:
    | Omit<DialogState, "wxid" | "dialogState">
    | Omit<DialogState, "nickName" | "dialogState">,
  update?: DialogState
) => {
  //[o] TEST
  await dialogStateModel
    .findOneAndUpdate({ ...filter }, { ...update }, { upsert: true })
    .exec();
};

export async function DialogQuery(
  filter:
    | Omit<DialogState, "wxid" | "dialogState">
    | Omit<DialogState, "nickName" | "dialogState">
) {
  return await dialogStateModel.findOne(filter).exec();
}

export async function DialogQueueLength() {
  return (await dialogStateModel.find({ dialogState: "artificial" }).exec())
    .length;
}
