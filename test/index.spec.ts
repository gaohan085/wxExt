import dialogStateTest from "./dialog-state.spec";
import memberTest from "./database.member.spec";
import { connection } from "../database/connector";
import cashTest from "./database.cash.spec";

describe("Test", () => {
  dialogStateTest();
  memberTest();
  cashTest();

  after(async () => {
    await connection.dropDatabase();
  });
});
