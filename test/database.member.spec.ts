import { expect } from "chai";
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

    it("Update without create before @ without filter", async () => {
      const user1: database.model.member.MemberInterface = {
        nickName: faker.internet.userName(),
        wxid: faker.string.uuid(),
        role: "paid member",
      };
      await database.model.member.UpdateMemberRole(
        {},
        {
          ...user1,
        }
      );

      const userExp = await database.model.member.MemberModel.findOne({
        wxid: user1.wxid,
      }).exec();

      expect(userExp?.role).equal(user1.role);
      expect(userExp?.nickName).equal(user1.nickName);
      expect(userExp?.wxid).equal(user1.wxid);
    });

    it("Update without create before @ with filter", async () => {
      const user2: database.model.member.MemberInterface = {
        nickName: faker.internet.userName(),
        wxid: faker.string.uuid(),
        role: "paid member",
      };
      await database.model.member.UpdateMemberRole(
        { wxid: user2.wxid },
        {
          ...user2,
        }
      );

      const userExp = await database.model.member.MemberModel.findOne({
        wxid: user2.wxid,
      }).exec();

      expect(userExp?.role).equal(user2.role);
      expect(userExp?.nickName).equal(user2.nickName);
      expect(userExp?.wxid).equal(user2.wxid);
    });
  });
}
