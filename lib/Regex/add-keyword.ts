const keywordAddRegex = /^添加 (.{1,9}) (.{1,9})/;

export function isValidKeywordAdd(input: string) {
  return keywordAddRegex.test(input);
}
