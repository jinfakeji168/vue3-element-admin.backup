import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";
import init from "../basicAPI";

const BasePath = "/admin/system/secondContract";

export default {
  /** @description: 秒合约*/
  getContractConfig() {
    return request<any, Form>({
      url: `${BasePath}/getContractConfig`,
      method: "get",
    });
  },
  setContractConfig(data: Form) {
    return request<Form>({
      url: `${BasePath}/setContractConfig`,
      method: "put",
      data,
    });
  },
  setContractRemark(data: Form) {
    return request<Form>({
      url: `${BasePath}/setContractRemark`,
      method: "put",
      data,
    });
  },
  ...init<any, TimeForm>("/admin/system/secondContract/time"),
};

export interface Form {
  /** 秒合约开关 1 开启 2 关闭 */
  contract_is_enable_contract?: StatusEnum;
  /** 合约结算到账账户 1 佣金账户 2 合约账户 */
  contract_settle_account?: 1 | 2;
  /** 秒合约手续费 */
  contract_second_contract_fee?: number;
  /** 用户初始输赢概率 */
  contract_user_init_win_loss_ratio?: number;
  /** 合约说明设置原文 */
  contract_remark_original?: string;
  /** 合约说明设置译文 */
  contract_remark_translation?: TranslationItem[];
}

export interface TimeForm {
  id?: number;
  second?: string;
  min_amount?: string;
  profit_rate?: number;
}
