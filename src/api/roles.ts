import request from "@/utils/request";

const roles = {
  /**
   * Display a listing of the resource.
   */
  index(params?: RoleFilters) {
    return request<any, PaginationResponse<RoleResponse[]>>({
      url: `/api/admin/roles`,
      method: "get",
      params: params,
    });
  },

  /**
   * Store a newly created resource in storage.
   */
  store(data: RoleForm) {
    return request({
      url: `/api/admin/roles`,
      method: "post",
      data: data,
    });
  },

  /**
   * Display the specified resource.
   */
  show(id: number) {
    return request<any, RoleForm>({
      url: `/api/admin/roles/${id}`,
      method: "get",
    });
  },

  /**
   * Update the specified resource in storage.
   */
  update(id: number, data: RoleForm) {
    return request<any, RoleForm>({
      url: `/api/admin/roles/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * Remove the specified resource from storage.
   */
  destroy(id: number) {
    return request({
      url: `/api/admin/roles/${id}`,
      method: "delete",
    });
  },
};

export default roles;

export interface RoleFilters extends PageQuery {
  name?: string;
}

export interface RoleResponse {
  id?: number;
  name?: string;
  title?: string;
  description?: string;
  guard_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface RoleForm {
  id?: number;
  name: string;
  title: string;
  description?: string;
}
