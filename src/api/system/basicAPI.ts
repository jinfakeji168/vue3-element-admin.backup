import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

export default function init<Query, Form>(BasePath: string) {
  /** 获取列表*/
  function getList(queryParams?: Query) {
    return request<any, PageResult<Form[]>>({
      url: `${BasePath}/index`,
      method: "get",
      params: queryParams,
    });
  }
  /**新增 */
  function add(data: Form) {
    return request<Form>({
      url: `${BasePath}/add`,
      method: "post",
      data,
    });
  }
  /**修改 */
  function edit(data: Form) {
    return request<Form>({
      url: `${BasePath}/edit`,
      method: "put",
      data,
    });
  }
  /**删除 */
  function _delete(ids: number[]) {
    return request({
      url: `${BasePath}/delete`,
      method: "delete",
      data: { ids },
    });
  }

  function changeStatus(id: number, status: StatusEnum) {
    return request<any, any>({
      url: `${BasePath}/edit`,
      method: "put",
      data: {
        id,
        status,
      },
    });
  }
  return {
    getList,
    add,
    edit,
    delete: _delete,
    changeStatus,
  };
}
