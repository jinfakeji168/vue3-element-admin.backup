import request from "@/utils/request";
import type { MenuVO } from "./menu";
import type { StatusEnum } from "@/enums/MenuTypeEnum";
import init from "../basicAPI";
const ROLE_BASE_URL = "/admin/auth/role";

const RoleAPI = {
  ...init(ROLE_BASE_URL),
  /** 获取角色下拉数据源 */
  options() {
    return request<any, OptionType[]>({
      url: `${ROLE_BASE_URL}/index`,
      method: "get",
      params: { limit: 9999 },
    });
  },
  /** 分配菜单权限*/
  updateRoleMenus(roleId: number, permissionIds: number[]) {
    return request({
      url: `${ROLE_BASE_URL}/auth`,
      method: "put",
      data: { id: roleId, permissions: permissionIds, data_range: "all" },
    });
  },
};

export default RoleAPI;

/** 角色分页查询参数 */
export interface RolePageQuery extends PageQuery {
  title?: string;
  name?: string;
  status?: StatusEnum;
}

/** 角色分页对象 */
export interface RolePageVO {
  /** 角色编码 */
  name?: string;
  /** 角色ID */
  id?: number;
  /** 角色名称 */
  title?: string;
  permissions?: MenuVO[];
  /** 排序 */
  description?: string;
  /** 角色状态 */
  guard_name?: string;
  /** 创建时间 */
  created_at?: Date;
  /** 修改时间 */
  updated_at?: Date;
  status?: StatusEnum;
  /** 排序 */
  sort?: number;
}

/** 角色表单对象 */
export interface RoleForm {
  /** 角色ID */
  id?: number;
  /** 角色编码 */
  name?: string;
  /** 数据权限 */
  dataScope?: number;
  /** 角色名称 */
  title?: string;
  /** 排序 */
  sort?: number;
  /** 角色状态(1-正常；0-停用) */
  status?: number;

  description?: string;
}
