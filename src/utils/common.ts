export const setFontSize: () => void = () => {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  let fontSize = (width * 16) / 375;
  fontSize = fontSize > 24 ? 24 : fontSize;
  document.documentElement.style.fontSize = `${fontSize}px`;
};

/**
 * 检查参数是否有效
 * @param arr 参数数组
 * @returns 如果有无效参数返回true，否则返回false
 */
export function paramsInvalid(arr: any[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    const param = arr[i];
    if (param === undefined || param === null) {
      return true;
    }
  }
  return false;
}

/**
 * 安全的字符串转数字
 * @param value 要转换的值
 * @param defaultValue 默认值
 * @returns 转换后的数字
 */
export function safeParseInt(value: any, defaultValue = 0): number {
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? defaultValue : parsed;
}
