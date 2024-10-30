import request from "@/utils/request";

const PERMISSIONS_BASE_URL = "/api/admin/permissions";

const PermissionsAPI = {
  index() {
    return request<any, OptionType[]>({
      url: `${PERMISSIONS_BASE_URL}/`,
      method: "get",
    });
  },

  show(id: number) {
    return request<any, RoleForm>({
      url: `${PERMISSIONS_BASE_URL}/${id}`,
      method: "get",
    });
  },

  store(data: RoleForm) {
    return request({
      url: `${PERMISSIONS_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  update(id: number, data: RoleForm) {
    return request({
      url: `${PERMISSIONS_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  destroy(ids: string) {
    return request({
      url: `${PERMISSIONS_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
};

export default PermissionsAPI;

/** 角色分页查询参数 */
export interface RolePageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
}

/** 角色分页对象 */
export interface RolePageVO {
  /** 角色编码 */
  name?: string;
  /** 角色ID */
  id?: number;
  /** 角色名称 */
  title?: string;
  /** 排序 */
  description?: string;
  /** 角色状态 */
  guard_name?: string;
  /** 创建时间 */
  created_at?: Date;
  /** 修改时间 */
  updated_at?: Date;
}

/** 角色表单对象 */
export interface RoleForm {
  /** 角色ID */
  id?: number;
  /** 角色编码 */
  name: string;
  /** 数据权限 */
  dataScope?: number;
  /** 角色名称 */
  title: string;
  /** 排序 */
  sort?: number;
  /** 角色状态(1-正常；0-停用) */
  status?: number;

  description?: string;
}
