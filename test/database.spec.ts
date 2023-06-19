import { expect } from "chai";
import * as database from "../database";
import "dotenv/config";

describe("create new member test", () => {
  it("create new member", async ()=>{
    await new database.Member({name: "gaohan085", wxid: process.env.admin_wxid as string}).save()
  });

  it("query member", async ()=>{
    const member = await database.Member.findOne({wxid: process.env.admin_wxid as string}).exec()
    expect(member?.name).equal("gaohan085")
  })
});
