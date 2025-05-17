import request from "@/utils/request";
// 菜单基础URL
const MENU_BASE_URL = "/admin/auth/menu";

const MenuAPI = {
  /**
   * 获取当前用户的路由列表
   * <p/>
   * 无需传入角色，后端解析token获取角色自行判断是否拥有路由的权限
   *
   * @returns 路由列表
   */
  getRoutes() {
    return request<any, { permissions: string[]; menu: RouteVO[] }>({
      url: `/admin/auth/menu/my`,
      method: "get",
    });
  },

  /**
   * 获取菜单树形列表
   *
   * @param queryParams 查询参数
   * @returns 菜单树形列表
   */
  index(queryParams: MenuQuery & { is_tree?: 1 | 2 }) {
    return request<any, MenuVO[]>({
      url: `${MENU_BASE_URL}/index`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 获取菜单下拉数据源
   *
   * @returns 菜单下拉数据源
   */
  option(onlyParent?: boolean) {
    return request<any, OptionType[]>({
      url: `${MENU_BASE_URL}/options`,
      method: "get",
      params: { onlyParent: onlyParent },
    });
  },

  /**
   * 添加菜单
   *
   * @param data 菜单表单数据
   * @returns 请求结果
   */
  add(data: MenuForm) {
    return request({
      url: `${MENU_BASE_URL}/add`,
      method: "post",
      data: data,
    });
  },

  /**
   * 修改菜单
   *
   * @param id 菜单ID
   * @param data 菜单表单数据
   * @returns 请求结果
   */
  update(id: string, data: MenuForm) {
    return request({
      url: `${MENU_BASE_URL}/edit?id=${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 删除菜单
   *
   * @param id 菜单ID
   * @returns 请求结果
   */
  deleteById(ids: number[]) {
    return request({
      url: `${MENU_BASE_URL}/delete`,
      method: "delete",
      data: { ids },
    });
  },
};

export default MenuAPI;

import type { MenuTypeEnum } from "@/enums/MenuTypeEnum";

/** 菜单查询参数 */
export interface MenuQuery {
  /** 搜索关键字 */
  keywords?: string;
  title?: string;
  name?: string;
  page?: number;
}

/** 基础菜单对象 */
export interface baseM {
  /** 菜单ID */
  id?: number | string;
  /** 父菜单ID */
  parent_id?: number;
  /** 菜单权限/名称 */
  name?: string;
  /** 权限标识 */
  perm?: string;
  /**名称 */
  title?: string;
  /** ICON */
  icon?: string;
  /** 排序 */
  sort?: number;
  /** 菜单类型 */
  type?: MenuTypeEnum;
  /** 菜单是否可见(1:显示;2:隐藏) */
  hidden?: 1 | 2;
  /** 路由名称 */
  routeName?: string;
  /** 路由路径 */
  path?: string;
  /** 组件路径 */
  component?: string;
  /** 跳转路由路径 */
  redirect?: string;
}

/** 菜单视图对象 */
export interface MenuVO extends baseM {
  /** 子菜单 */
  children?: MenuVO[];
}

/** 菜单表单对象 */
export interface MenuForm extends baseM {
  /** 【菜单】是否开启页面缓存 */
  keepAlive?: number;
  /** 【目录】只有一个子路由是否始终显示 */
  alwaysShow?: number;
  /** 参数 */
  params?: KeyValue[];
}

/** RouteVO，路由对象 */
export interface RouteVO {
  /** 子路由列表 */
  children: RouteVO[];
  /** 组件路径 */
  component?: string;
  /** 路由属性 */
  meta?: Meta;
  /** 路由名称 */
  name?: string;
  /** 路由路径 */
  path?: string;
  /** 跳转链接 */
  redirect?: string;
}
interface KeyValue {
  key: string;
  value: string;
}
/** Meta，路由属性 */
export interface Meta {
  /** 【目录】只有一个子路由是否始终显示 */
  alwaysShow?: boolean;
  /** 是否隐藏(true-是 false-否) */
  hidden?: boolean;
  /** ICON */
  icon?: string;
  /** 【菜单】是否开启页面缓存 */
  keepAlive?: boolean;
  /** 路由title */
  title?: string;
}
