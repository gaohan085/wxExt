import { expect } from "chai";
import "dotenv/config";
import * as database from "../database";
import { faker } from "@faker-js/faker";

export default function () {
  describe("create new member test", () => {
    const user: database.model.member.MemberInterface = {
      nickName: faker.internet.userName(),
      wxid: faker.string.uuid(),
      role: "paid member",
    };
    it("create new member", async () => {
      await new database.model.member.MemberModel({
        ...user,
      }).save();
    });

    it("query member", async () => {
      const member = await database.model.member.MemberModel.findOne({
        wxid: user.wxid,
      }).exec();
      expect(member?.nickName).equal(user.nickName);
    });
  });
}
