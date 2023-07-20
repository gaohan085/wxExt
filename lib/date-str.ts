/**
 *
 * @returns 返回当前日期字符串， 格式：yyyyMMdd
 */
export function dateStr() {
  return `${new Date().getFullYear()}${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}`;
}
