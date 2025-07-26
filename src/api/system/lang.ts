import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";
import init from "../basicAPI";
const BasePath = "/admin/system/language";

export default {
  ...init(BasePath),

  // changeStatus(id: string, status: StatusEnum) {
  //   return request<any, any>({
  //     url: `${BasePath}/edit`,
  //     method: "put",
  //     data: {
  //       id,
  //       status,
  //     },
  //   });
  // },
  /**获取开启的语言列表  1启用 2禁用 不传全部*/
  getOptions(type?: 1 | 2) {
    return request<any, Form[]>({
      url: `/admin/global/getLangList${!type ? "" : `?status=${type}`}`,
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

/** 语言类型 */
export interface Form {
  id?: number;
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
