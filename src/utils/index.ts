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

/**keys [new key，old key]的二维数组 */
export function deepChangeOption<T = any[]>(list: any[], keys: string[][]): T {
  return list.map((item: any) => {
    return {
      item: item,
      disabled: item.status == StatusEnum.True,
      ...Object.assign(
        {},
        ...keys.map((keyItem) => ({ [keyItem[0]]: item[keyItem[1]] }))
      ),
      children: item.children
        ? deepChangeOption(item.children, keys)
        : item.children,
    };
  }) as T;
}
