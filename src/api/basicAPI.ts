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
  function add<T = Form>(data: T) {
    return request<T>({
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
  async function _delete(ids: number[]) {
    //进行二次判断
    const res = await ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
      type: "warning",
      beforeClose: async (action, instance, done) => {
        if (action === "confirm") {
          instance.confirmButtonLoading = true;
          await request({
            url: `${BasePath}/delete`,
            method: "delete",
            data: { ids },
          });
        }
        done();
      },
    });
    return res;
  }

  function changeStatus(data: Form, status: StatusEnum) {
    return edit({ ...data, status });
  }
  return {
    getList,
    add,
    edit,
    delete: _delete,
    changeStatus,
  };
}
