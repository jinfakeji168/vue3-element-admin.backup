import request from "@/utils/request";
import type { MenuVO } from "./menu";
import type { StatusEnum } from "@/enums/MenuTypeEnum";

const ROLE_BASE_URL = "/admin/auth/role";

const RoleAPI = {
  /** 获取角色分页数据 */
  index(queryParams?: RolePageQuery) {
    return request<any, PageResult<RolePageVO[]>>({
      url: `${ROLE_BASE_URL}/index`,
      method: "get",
      params: queryParams,
    });
  },

  /** 获取角色下拉数据源 */
  options() {
    return request<any, OptionType[]>({
      url: `${ROLE_BASE_URL}/index`,
      method: "get",
      params: { limit: 9999 },
    });
  },
  /**
   * 获取角色的菜单ID集合
   *
   * @param roleId 角色ID
   * @returns 角色的菜单ID集合
   */
  menuIds(roleId: number) {
    return request<any, number[]>({
      url: `${ROLE_BASE_URL}/${roleId}/menuIds`,
      method: "get",
    });
  },

  /**
   * 分配菜单权限
   *
   * @param roleId 角色ID
   * @param data 菜单ID集合
   */
  updateRoleMenus(roleId: number, permissionIds: number[]) {
    return request({
      url: `${ROLE_BASE_URL}/auth`,
      method: "put",
      data: { id: roleId, permissions: permissionIds, data_range: "all" },
    });
  },

  /**
   * 获取角色表单数据
   *
   * @param id 角色ID
   * @returns 角色表单数据
   */
  show(id: number) {
    return request<any, RoleForm>({
      url: `${ROLE_BASE_URL}/${id}`,
      method: "get",
    });
  },

  /** 添加角色 */
  add(data: RoleForm) {
    return request({
      url: `${ROLE_BASE_URL}/add`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新角色
   *
   * @param id 角色ID
   * @param data 角色表单数据
   */
  update(id: number, data: RoleForm) {
    return request({
      url: `${ROLE_BASE_URL}/edit`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除角色，多个以英文逗号(,)分割
   *
   * @param ids 角色ID字符串，多个以英文逗号(,)分割
   */
  delete(ids: string) {
    return request({
      url: `${ROLE_BASE_URL}/delete`,
      method: "delete",
      data: { ids: ids },
    });
  },
};

export default RoleAPI;

/** 角色分页查询参数 */
export interface RolePageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  title: string;
  name: string;
}

/** 角色分页对象 */
export interface RolePageVO {
  /** 角色编码 */
  name?: string;
  /** 角色ID */
  id?: number;
  /** 角色名称 */
  title?: string;
  permissions: MenuVO[];
  /** 排序 */
  description?: string;
  /** 角色状态 */
  guard_name?: string;
  /** 创建时间 */
  created_at?: Date;
  /** 修改时间 */
  updated_at?: Date;
  status: StatusEnum;
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
