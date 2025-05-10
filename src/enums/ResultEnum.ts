/**
 * 响应码枚举
 */
export const enum ResultEnum {
  /**成功*/
  SUCCESS = 200,
  /**失败*/
  FAIL = 500,
  /** 令牌无效或过期*/
  TOKEN_INVALID = 401,
  /** 无权限*/
  NO_PERMISSION = 403,
  /**数据不存在 */
  DATA_NOT_EXIST = 404,
  /**方法不允许 */
  METHOD_NOT_ALLOWED = 405,
  /**不可接受 */
  NOT_ACCEPTABLE = 406,
  /**请求参数错误 */
  PARAMS_ERROR = 422,
}
/**状态和提示映射 */
export const ResultMsg = {
  [ResultEnum.SUCCESS]: "操作成功",
  [ResultEnum.FAIL]: "服务器代码错误，请联系管理员",
  [ResultEnum.TOKEN_INVALID]: "令牌无效或过期，请重新登录",
  [ResultEnum.NO_PERMISSION]: "权限不足，请联系管理员",
  [ResultEnum.DATA_NOT_EXIST]: "数据不存在，请检查",
  [ResultEnum.METHOD_NOT_ALLOWED]: "方法不允许，请检查",
  [ResultEnum.NOT_ACCEPTABLE]: "不可接受，请检查",
  [ResultEnum.PARAMS_ERROR]: "请求参数错误，请检查",
};
