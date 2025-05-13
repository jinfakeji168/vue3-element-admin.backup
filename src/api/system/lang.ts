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
  /**获取开启的语言列表 */
  getOpenOptions() {
    return request<any, Form[]>({
      url: "/admin/global/getLangList?status=1",
      method: "get",
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
  id?: string;
  name?: string;
  mark?: string;
  status?: StatusEnum;
  sort?: number;
  display_name?: string;
}

/**全局content组件vmodel参数 */
export type contentModel = {
  original: string;
  translation: { lang: string; content: string; name: string }[];
};
