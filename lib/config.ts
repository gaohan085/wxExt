import "dotenv/config";
import * as log from "./log";

const adminWxid = process.env.ADMIN_WXID;
const dbUrl = process.env.DB_URL;
const historyPkgPrice = process.env.HISTORY_PACKAGE_PRICE;
const permenentMemberPrice = process.env.PERMENENT_MEMBER_PRICE;
const artificialStart = process.env.ARTIFICIAL_START;
const artificialEnd = process.env.ARTIFICIAL_END;
const archievePath = process.env.ARCHIEVE_PATH;
const dailyPrice = process.env.DAILY_PRICE;
const imgPath = process.env.IMG_PATH;

(() => {
  if (
    !adminWxid ||
    !dbUrl ||
    !historyPkgPrice ||
    !permenentMemberPrice ||
    !artificialStart ||
    !artificialEnd ||
    !archievePath ||
    !dailyPrice ||
    !imgPath
  ) {
    log.error(
      "Please define 'ADMIN_WXID', 'DB_URL', 'PERMENENT_MEMBER_PRICE','HISTORY_PACKAGE_PRICE', 'ARTIFICIAL_START','ARTIFICIAL_END', 'ARCHIEVE_PATH', 'DAILY_PRICE' field in .env file"
    );
    process.exit(1);
  }
})();

export {
  adminWxid,
  dbUrl,
  historyPkgPrice,
  permenentMemberPrice,
  artificialStart,
  artificialEnd,
  archievePath,
  dailyPrice,
  imgPath,
};
