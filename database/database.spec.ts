import { expect } from "chai";
import "dotenv/config";
import * as database from "../database";

describe("create new member test", () => {
  it("create new member", async () => {
    await new database.model.member.MemberModel({
      name: "gaohan085",
      wxid: process.env.admin_wxid as string,
    }).save();
  });

  it("query member", async () => {
    const member = await database.model.member.MemberModel.findOne({
      wxid: process.env.admin_wxid as string,
    }).exec();
    expect(member?.nickName).equal("gaohan085");
  });
});
