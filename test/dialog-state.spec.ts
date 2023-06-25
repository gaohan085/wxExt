import { faker } from "@faker-js/faker";
import { expect } from "chai";
import { describe } from "mocha";
import {
  CreateDialogState,
  DialogState,
  UpdateDialogState,
  dialogStateModel,
} from "../database/model/dialog-state";

export default function () {
  describe("test dialog state upsert", () => {
    const dialog: DialogState = {
      nickName: faker.internet.userName(),
      wxid: faker.string.uuid(),
    };
    it("test create", async () => {
      await CreateDialogState({
        ...dialog,
      });

      const dialogResult = await dialogStateModel
        .findOne({ wxid: dialog.wxid })
        .exec();

      expect(dialogResult?.nickName).equal(dialog.nickName);
    });

    it("test update", async () => {
      await UpdateDialogState(
        {
          wxid: dialog.wxid,
        },
        {
          nickName: dialog.nickName,
          wxid: dialog.wxid,
          dialogState: "artificial",
        }
      );

      const dialogResult = await dialogStateModel
        .findOne({ wxid: dialog.wxid })
        .exec();

      expect(dialogResult?.dialogState).equal("artificial");
      expect((await dialogStateModel.find({}).exec()).length).equal(1);
    });
  });
}
