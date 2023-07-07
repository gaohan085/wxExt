import { faker } from "@faker-js/faker";
import { expect } from "chai";
import * as database from "../database";

export default function () {
  describe("Cash test", () => {
    it("Add getimg cash record", async () => {
      const cashRec = {
        wxid: faker.string.uuid(),
        nickName: faker.internet.userName(),
        transferMount: 6,
      };

      await database.model.cash.CashAddRecord(cashRec);

      const record = await database.model.cash.CashModel.findOne({
        wxid: cashRec.wxid,
      }).exec();

      expect(record?.usage).to.be.equal("getimg");
      expect(record?.transferMount).to.be.equal(6);
      expect(record?.wxid).to.be.equal(cashRec.wxid);
      expect(record?.nickName).to.be.equal(cashRec.nickName);

      const usrRec = await database.model.member.MemberModel.findOne({
        wxid: cashRec.wxid,
      }).exec();

      expect(usrRec?.nickName).equal(cashRec.nickName);
      expect(usrRec?.wxid).equal(cashRec.wxid);
      expect(usrRec?.role).equal("paid member");
    });
  });
}
