import init from "../basicAPI";
import request from "@/utils/request";
const BasePath = "/admin/report/overview";
const BasePath1 = "/admin/report/wallet";
const BasePath2 = "/admin/report/platform";

export default {
    /**汇总数据 */
    synthesizeReport() {
        return request<any, _SynthesizeReportSummary>({
            url: `${BasePath}/summary`,
            method: "get"
        })
    },
    /**区间数据 */
    synthesizeReportInterval(params: QueryParams) {
        return request<QueryParams, _SynthesizeReportInterval>({
            url: `${BasePath}/period`,
            method: "get",
            params
        })
    },
    /**实时数据 */
    synthesizeReportRealTime() {
        return request<any, _SynthesizeReportRealtime>({
            url: `${BasePath}/realtime`,
            method: "get"
        })
    },
    /**归集钱包余额 */
    synthesizeReportCollectWallet() {
        return request<any, WalletSummary[]>({
            url: `${BasePath1}/collect`,
            method: "get"
        })
    },
    /**打款钱包余额 */
    synthesizeReportPayWallet() {
        return request<any, WalletSummary[]>({
            url: `${BasePath1}/payment`,
            method: "get"
        })
    },
    /**能量平台 */
    synthesizeReportEnergyPlatform() {
        return request<any, TrxPlatform>({
            url: `${BasePath2}/energy`,
            method: "get"
        })
    },
    /**积分平台 */
    synthesizeReportIntegralPlatform() {
        return request<any, Intergal>({
            url: `${BasePath2}/points`,
            method: "get"
        })
    }
}
export type QueryParams = { datetime?: string[] }

/** 汇总币种数据类型 */
export interface _CoinSummary {
    /** 笔数 */
    count: number;
    /** 金额 */
    amount: string;
}

/** 币种类型 */
type CurrencyType = 'trc20_u' | 'trx' | 'bep20_u' | 'bnb' | 'usdc'

/** 汇总明细类型 */
export type _SummaryDetail = {
    /** 总笔数 */
    total_count: number;
    /** 总金额 */
    total_amount: string;
} & {
    /** 各币种数据 */
    [key in CurrencyType]: _CoinSummary;
}

/** 汇总数据类型 */
export interface _SynthesizeReportSummary {
    /** 总会员数 */
    total_members: number;
    /** 充提差（汇总） */
    recharge_withdraw_diff: string;
    /** 汇总充值 */
    recharge_summary: _SummaryDetail;
    /** 汇总提现 */
    withdraw_summary: _SummaryDetail;
    /** 汇总归集 */
    collect_summary: _SummaryDetail;
}

//


/** 区间币种数据类型 */
export interface _IntervalCoinSummary {
    /** 笔数 */
    count: number;
    /** 金额 */
    amount: string;
}


/** 区间归集明细类型 */
export type _IntervalCollectOverview = {
    [key in CurrencyType]: _IntervalCoinSummary;
}

/** 区间数据类型 */
export interface _SynthesizeReportInterval {
    /** 区间内注册人数 */
    register_count: number;
    /** 注册且有量化人数 */
    register_quant_count: number;
    /** 签到人数 */
    signin_user_count: number;
    /** 充值总金额 */
    recharge_total_amount: string;
    /** 充值人数(去重UID) */
    recharge_user_count: number;
    /** 首充人数 */
    first_recharge_user_count: number;
    /** 复充人数 */
    repeat_recharge_users: number;
    /** 提现总金额 */
    withdraw_total_amount: string;
    /** 提现人数 */
    withdraw_user_count: number;
    /** 结算完成量化笔数 */
    quant_complete_count: number;
    /** 结算量化收益 */
    quant_total_commission: string;
    /** 区间归集 */
    collect_period_overview: _IntervalCollectOverview;
}


//
/** 实时数据类型 */
export interface _SynthesizeReportRealtime {
    /** 佣金账户余额汇总（实时） */
    brokerage_balance_total: string;
    /** 用户账户余额总计（实时） */
    user_account_balance: string;
    /** 充值人数（实时） */
    recharge_user_total: number;
    /** 重充人数（实时） */
    repeat_recharge_user_total: number;
    /** 总量化佣金（实时） */
    quant_commission_total: string;
    /** 预计出款金额（实时） */
    predicted_withdraw_amount: string;
    /** 当前在线人数（实时） */
    total_online_count: number;
}


//


/** 钱包汇总类型 */
export interface WalletSummary {
    /** 链类型，如 TRC20 */
    type: string;
    /** 链地址 */
    address: string;
    /** 币种余额列表 */
    currency: {
        /** 币种名称 */
        name: string;
        /** 余额 */
        balance: string;
    }[];
}


/** TRX钱包类型 */
export interface TrxPlatform {
    /** 钱包地址 */
    address: string;
    /** TRX余额 */
    balance: string;
}

/** 积分平台类型 */
export interface Intergal {
    /** 积分余额 */
    points: string;
    /** TRC20 收款地址 */
    trc20_address: string;
    /** BEP20 收款地址 */
    bep20_address: string;
}
