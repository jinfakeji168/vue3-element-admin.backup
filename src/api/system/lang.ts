import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

const BasePath = "/admin/system/language";

export default {
  /** 获取列表*/
  getList(queryParams?: Query) {
    return request<any, PageResult<Form[]>>({
      url: `${BasePath}/index`,
      method: "get",
      params: queryParams,
    });
  },
  changeStatus(id: string, status: StatusEnum) {
    return request<any, any>({
      url: `${BasePath}/edit`,
      method: "put",
      data: {
        id,
        status,
      },
    });
  },
};

export interface Query {
  name?: string;
  mark?: string;
  status?: string;
  display_name?: string;
  page: number;
  limit: number;
}

/** 部门类型 */
export interface Form {
  id: string;
  name?: string;
  mark?: string;
  status?: StatusEnum;
  sort?: string;
  display_name?: string;
}
