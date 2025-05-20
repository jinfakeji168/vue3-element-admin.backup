import { StatusEnum } from "@/enums/MenuTypeEnum";

/**
 * Check if an element has a class
 * @param {HTMLElement} ele
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: HTMLElement, cls: string) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function addClass(ele: HTMLElement, cls: string) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function removeClass(ele: HTMLElement, cls: string) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

/**
 * 判断是否是外部链接
 *
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal;
}

/**keys [new key，old key]的二维数组  @stone*/
export function deepChangeOption<T = any[]>(list: any[], keys: string[][]): T {
  return list.map((item: any) => {
    return {
      item: item,
      disabled: item.status == StatusEnum.True,
      ...Object.assign({}, ...keys.map((keyItem) => ({ [keyItem[0]]: item[keyItem[1]] }))),
      children: item.children ? deepChangeOption(item.children, keys) : item.children,
    };
  }) as T;
}
export function parserHandler(value: string) {
  //没有小数点的数字
  const reg = /(?<=(^(?!\d\.\d)\d+)$)/;
  //有小数一位的数字
  const reg1 = /(?<=\d+\.\d{1})$/;

  if (value.match(reg)) {
    return value.replace(reg, ".00");
  } else if (value.match(reg1)) {
    return value.replace(reg1, "0");
  } else return value;
}
