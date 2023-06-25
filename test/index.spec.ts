import dialogStateTest from "./dialog-state.spec";
import databaseTest from "./database.spec";
import { connection } from "../database/connector";

describe("Test", () => {
  dialogStateTest();
  databaseTest();

  after(() => {
    connection.dropDatabase();
  });
});
