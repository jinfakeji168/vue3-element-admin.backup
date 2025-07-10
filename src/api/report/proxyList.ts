

import init from "../basicAPI";
import request from "@/utils/request";

const BasePath = "/admin/report/agentList";

export default {
  ...init<Query, Form>(BasePath),
  delete: async (uids: number[]) => {
    //进行二次判断
    const res = await ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
      type: "warning",
      beforeClose: async (action, instance, done) => {
        if (action === "confirm") {
          instance.confirmButtonLoading = true;
          await request({
            url: `${BasePath}/delete`,
            method: "delete",
            data: { uids },
          });
        }
        done();
      },
    });
    return res;
  }
};

export interface Query extends PageQuery {

  /** 代理名称(备注字段) */
  agent_name?: string;
  /** 用户账户 */
  account?: string;
  /** 代理类型 1.普通代理 2.总代理 */
  agent_type?: number;
  /** 统计类型 direct:下一级 all_line:整条线 three_levels:到下三级 */
  type?: string;
  /** 状态 1.正常 2.禁用 */
  status?: number;
  /** 创建时间范围 */
  created_at?: [string, string];
}

/** 类型 */
export interface Form {
  /** 代理表单类型 */
  id?: number;
  /** 用户ID */
  uid?: number;
  /** 代理名称 */
  agent_name?: string;
  /** 用户账号 */
  account?: string;
  /** 代理类型 1.普通代理 2.总代理 */
  agent_type?: number;
  /** 代理类型名称 */
  agent_type_name?: string;
  /** 注册人数 */
  register_count?: number;
  /** 总充值人数 */
  total_recharge_count?: number;
  /** 首充人数 */
  first_recharge_count?: number;
  /** 复充人数 */
  repeat_recharge_count?: number;
  /** 提现人数 */
  withdrawal_count?: number;
  /** 总充值金额 */
  total_recharge_amount?: string;
  /** 首充金额 */
  first_recharge_amount?: string;
  /** 复充金额 */
  repeat_recharge_amount?: string;
  /** 提现金额 */
  total_withdrawal_amount?: string;
  /** 充提差 */
  recharge_withdrawal_diff?: string;
  /** 量化余额 */
  quant_balance?: string;
  /** 佣金余额 */
  brokerage_balance?: string;
  /** 备注 */
  remark?: string;
  /** 状态 1.启用 2.禁用 */
  status?: number;
  /** 创建时间 */
  created_at?: string;
}

/** 新增代理表单参数类型 */
export interface AddProxyForm {
  /** 用户账号 */
  account: string;
  /** 代理名称(备注字段) */
  agent_name?: string;
  /** 代理类型 1.总代理 2.普通代理（默认） */
  agent_type?: number;
  /** 备注 */
  remark?: string;
}
