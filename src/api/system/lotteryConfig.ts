import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";
import init from "../basicAPI";

const BasePath = "/admin/system/lotteryConfig";

const rechargeListPath = "/admin/system/lotteryConfig/gift";
export default {
  /** @description: 获取抽奖配置*/
  getLotteryConfig() {
    return request<any, Form>({
      url: `${BasePath}/getLotteryConfig`,
      method: "get",
    });
  },
  setLotteryConfig(data: Form) {
    return request<Form>({
      url: `${BasePath}/setLotteryConfig`,
      method: "put",
      data,
    });
  },
  setLotteryConfigTranslation(data: Partial<Form>) {
    return request<Form>({
      url: `${BasePath}/setLotteryRemark`,
      method: "put",
      data,
    });
  },
  ...init(rechargeListPath),
};

export interface Form {
  lottery_is_open?: StatusEnum;
  lottery_is_pop?: StatusEnum;
  lottery_pop_num?: StatusEnum;
  /** 抽奖赠送账户 1.量化账户 2.佣金账户 3.合约账户  */
  lottery_give_account?: 1 | 2 | 3;
  /**抽奖形式 1.转盘抽奖，2.宝箱抽奖   */
  lottery_type?: 1 | 2 | 3;
  /**抽奖奖品设置 1.全局，2.局部   */
  lottery_system_lottery_type?: 1 | 2;
  /**抽奖奖品默认显示类型 1.注册奖品，2.邀请奖品 3.充值奖品   */
  lottery_type_default?: 1 | 2 | 3;
  lottery_remark_original?: string;
  lottery_remark_translation?: TranslationItem[];
  lottery_register_give_num?: number;
  lottery_register_prize_set?: lottery_item[];
  lottery_spread_recharge_give?: number;
  lottery_invite_prize_set?: lottery_item[];
  lottery_send_type: number;
  lottery_recharge_prize_set?: lottery_item[];
}

export interface lottery_item {
  prize_id?: number;
  min_prize_num?: number;
  probability?: number;
}

export interface rechargeForm {
  id?: number;
  type?: 1 | 2 | 3;
  gift_num?: number;
  reach_amount?: number;
}
