<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <span>系统时间GMT{{ date.timeZone > 0 ? "+" : "-" }}{{ date.timeZone }}({{ date.time }})</span>
      </template>
      <template #default>
        <div class="flex flex-row gap-10 flex-wrap w-full" v-loading="loading[0]">
          <div class="flex-grow-1" v-for="item in list" :key="item.name">
            <el-tooltip placement="top" :disabled="!item.tooltip">
              <template #default>
                <div class="dataItem">
                  <el-image fit="contain" :src="item.img" />
                  <span>{{ item.value }}</span>
                  <span>{{ item.name }}</span>
                </div>
              </template>
              <template #content>
                <div v-html="item.tooltip"></div>
              </template>
            </el-tooltip>
          </div>
        </div>
        <div class="seach_row">
          <el-date-picker
            v-model="queryParams.datetime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
          <el-button type="primary" @click="getsynthesizeReportInterval" :loading="loading[1]">查询</el-button>
        </div>
        <div class="flex flex-row gap-10 mt-10 flex-wrap" v-loading="loading[1]">
          <div class="dataItem" v-for="item in list2" :key="item.name">
            <el-image fit="contain" :src="item.img" />
            <span>{{ item.value }}</span>
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div class="flex flex-row gap-4 mt-20 flex-wrap">
          <div class="dataCard Custom">
            <span>充值人数</span>
            <div>实时</div>
            <span>{{ realTimeData?.recharge_user_total }}</span>
            <span>{{ realTimeData?.repeat_recharge_user_total }}</span>
            <span>总充人数</span>
            <span>复充人数</span>
          </div>
          <div class="dataCard">
            <span>总量化佣金</span>
            <div>实时</div>
            <span>{{ realTimeData?.quant_commission_total }}</span>
          </div>
          <div class="dataCard">
            <span>用户佣金账户余额</span>
            <div>实时</div>
            <span>{{ realTimeData?.brokerage_balance_total }}</span>
          </div>
          <div class="dataCard">
            <span>预计出款金额</span>
            <div>实时</div>
            <span>{{ realTimeData?.predicted_withdraw_amount }}</span>
          </div>
        </div>
        <div class="flex flex-row gap-4 mt-20 flex-wrap">
          <div class="dataContent flex flex-col gap-3" v-loading="loading[2]">
            <div class="flex flex-row gap-3">
              <span>归集钱包</span>
              <el-button size="small" type="primary" @click="getCollectWallet" :loading="loading[2]">点击刷新</el-button>
            </div>
            <template v-for="item of paymentWallet" :key="item">
              <div class="flex flex-row gap-3">
                <span>{{ item.type }}</span>
                <span>{{ item.address || "--" }}</span>
              </div>
              <div class="flex flex-row flex-wrap gap-x-4">
                <div class="flex flex-row" v-for="inner of item.currency" :key="inner.name">
                  <span>{{ item.type }}-{{ inner.name }}余额</span>
                  <span>{{ inner.balance }}</span>
                </div>
              </div>
            </template>
          </div>
          <div class="dataContent flex flex-col gap-3" v-loading="loading[3]">
            <div class="flex flex-row gap-3">
              <span>打款钱包</span>
              <el-button size="small" type="primary" @click="getPaymentWallet">点击刷新</el-button>
            </div>
            <template v-for="item of paymentWallet" :key="item">
              <div class="flex flex-row gap-3">
                <span>{{ item.type }}</span>
                <span>{{ item.address || "--" }}</span>
              </div>
              <div class="flex flex-row flex-wrap gap-x-4">
                <div class="flex flex-row" v-for="inner of item.currency" :key="inner.name">
                  <span>{{ item.type }}-{{ inner.name }}余额</span>
                  <span>{{ inner.balance }}</span>
                </div>
              </div>
            </template>
            <div class="flex flex-row gap-3">
              <div class="flex flex-row gap-3">
                <span>打款钱包能量</span>
                <span>--/--</span>
                <a>能量网站</a>
                <a>Telegram</a>
              </div>
            </div>
            <div style="color: red; font-size: 14px">
              当前剩余能量大约可以支付0笔转账的能量消耗
              <el-tooltip
                content="波场USDT转账规则:对方地址中有USDT，每笔转账消耗64285能量，没有能量则燃烧13.3959TRX；对方地址中没有USDT，每笔转账消耗64895能量，没有能量则燃烧27.2559TRX"
              >
                <el-icon class="cursor-pointer"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <div class="flex flex-row">
              <span style="white-space: nowrap">快速购买出款能量</span>
              <el-input placeholder="请输入购买数量" />
            </div>
            <div class="flex flex-row gap-1">
              <el-select>
                <el-option label="1天" value="1" />
                <el-option label="3天" value="3" />
              </el-select>
              <el-button type="primary">购买</el-button>
            </div>
          </div>
          <div class="dataContent flex flex-col gap-3" v-loading="loading[4]">
            <div class="flex flex-row gap-3">
              <span>能量平台</span>
              <el-button size="small" type="primary" @click="getEnergyPlatform">点击刷新</el-button>
            </div>
            <div class="flex flex-row gap-3">
              <span>能量平台余额</span>
              <span>{{ energyPlatForm?.balance }}</span>
            </div>
            <div class="flex flex-row gap-3">
              <span>充值二维码,仅支持trx,勿充其他虚拟币</span>
            </div>
            <div class="flex flex-row gap-3">
              <span>充值地址</span>
              <span>{{ energyPlatForm?.address || "--" }}</span>
            </div>
            <div class="flex flex-row gap-3">
              <qrcode :value="energyPlatForm?.address || '--'" :width="100"></qrcode>
            </div>
            <div>
              <el-button type="primary">充值完成</el-button>
            </div>
          </div>
          <div class="dataContent flex flex-col gap-3" v-loading="loading[5]">
            <div class="flex flex-row gap-3">
              <span class="flex-center">
                积分
                <el-tooltip content="预计出款金额计算： 排除测试账户，根据当前可提款用户的佣金总额+可做任务用户产生的收益来预估">
                  <el-icon class="cursor-pointer"><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
              <el-button size="small" type="primary" @click="getIntegral">点击刷新</el-button>
            </div>
            <div class="flex flex-row gap-3">
              <span>系统剩余积分</span>
              <span>{{ integral?.points }}</span>
            </div>
            <div class="flex flex-row gap-3">
              <span>tron地址</span>
              <span>{{ integral?.trc20_address || "--" }}</span>
            </div>
            <div class="flex flex-row gap-3">
              <span>BEP20地址</span>
              <span>{{ integral?.bep20_address || "--" }}</span>
            </div>
            <div class="flex flex-row gap-3">
              <qrcode :value="integral?.trc20_address || '--'" :width="100"></qrcode>
              <qrcode :value="integral?.bep20_address || '--'" :width="100"></qrcode>
            </div>
            <div>
              <el-button type="primary">充值完成</el-button>
            </div>
          </div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { _CoinSummary, _SynthesizeReportRealtime, Intergal, TrxPlatform, WalletSummary } from "@/api/report/synthesizeReport";
import { dayjs } from "element-plus";
import qrcode from "vue-qrcode";

const list = reactive([
  { name: "总会员数", value: "--", img: "/images/report_a1.png" },
  { name: "提充差", value: "--", img: "/images/report_a2.png" },
  { name: "总充值", value: "--", img: "/images/report_a2.png", tooltip: "" },
  { name: "总提现", value: "--", img: "/images/report_a2.png", tooltip: "" },
  { name: "总归集", value: "--", img: "/images/report_a3.png", tooltip: "" },
]);
const list2 = reactive([
  { name: "注册", value: 666, img: "/images/report_a4.png" },
  { name: "注册有做量化", value: 666, img: "/images/report_a4.png" },
  { name: "归集TRC20-U", value: "0(0笔)", img: "/images/report_a3.png" },
  { name: "归集TRX", value: "0(0笔)", img: "/images/report_a3.png" },
  { name: "归集BEP20-U", value: "0(0笔)", img: "/images/report_a3.png" },
  { name: "归集BNB", value: "0(0笔)", img: "/images/report_a3.png" },
  { name: "充值金额", value: "0(0人)", img: "/images/report_a5.png" },
  { name: "提现金额", value: "0(0人)", img: "/images/report_a5.png" },
  { name: "首充人数", value: "0", img: "/images/report_a5.png" },
  { name: "签到人数", value: "0", img: "/images/report_a5.png" },
  { name: "完成量化次数", value: "0", img: "/images/report_a6.png" },
  { name: "量化总佣金", value: "0", img: "/images/report_a2.png" },
]);

const date = reactive({
  timeZone: -(new Date().getTimezoneOffset() / 60),
  time: "",
});
let requestanimation: number;
function initDate() {
  requestanimation = requestAnimationFrame(() => {
    date.time = dayjs().format("MM-DD HH:mm:ss");
    initDate();
  });
}
initDate();
const today = dayjs();
const queryParams = reactive({
  datetime: [today.format("YYYY-MM-DD"), today.add(1, "day").format("YYYY-MM-DD")],
});
const loading = ref<boolean[]>([]);

/**总数据 */
async function getsynthesizeReport() {
  loading.value[0] = true;
  try {
    const res = await api.synthesizeReport();
    list[0].value = String(res.total_members);
    list[1].value = res.recharge_withdraw_diff;
    list[2].value = res.recharge_summary.total_amount;
    list[2].tooltip = Object.entries(res.recharge_summary)
      .filter((i) => typeof i[1] === "object")
      .map((i) => `${i[0]}:${(i[1] as _CoinSummary)?.amount}`)
      .join("<br/>");

    list[3].value = res.withdraw_summary.total_amount;
    list[3].tooltip = Object.entries(res.withdraw_summary)
      .filter((i) => typeof i[1] === "object")
      .map((i) => `${i[0]}:${(i[1] as _CoinSummary)?.amount}`)
      .join("<br/>");

    list[4].value = res.collect_summary.total_amount;
    list[4].tooltip = Object.entries(res.collect_summary)
      .filter((i) => typeof i[1] === "object")
      .map((i) => `${i[0]}:${(i[1] as _CoinSummary)?.amount}`)
      .join("<br/>");
  } finally {
    loading.value[0] = false;
  }
}
/**区间数据 */
async function getsynthesizeReportInterval() {
  loading.value[1] = true;
  const res = await api.synthesizeReportInterval(queryParams);
  list2[0].value = res.register_count;
  list2[1].value = res.register_quant_count;
  list2[2].value = `${res.collect_period_overview.trc20_u.amount}(${res.collect_period_overview.trc20_u.count}笔)`;
  list2[3].value = `${res.collect_period_overview.trx.amount}(${res.collect_period_overview.trx.count}笔)`;
  list2[4].value = `${res.collect_period_overview.bep20_u.amount}(${res.collect_period_overview.bep20_u.count}笔)`;
  list2[5].value = `${res.collect_period_overview.bnb.amount}(${res.collect_period_overview.bnb.count}笔)`;

  list2[6].value = `${res.recharge_total_amount}(${res.recharge_user_count}人)`;
  list2[7].value = `${res.withdraw_total_amount}(${res.withdraw_user_count}人)`;
  list2[8].value = res.first_recharge_user_count;
  list2[9].value = res.signin_user_count;
  list2[10].value = res.quant_complete_count;
  list2[11].value = res.quant_total_commission;
  loading.value[1] = false;
}

const realTimeData = ref<_SynthesizeReportRealtime>();
/**实时数据 */
async function getsynthesizeReportRealTime() {
  realTimeData.value = await api.synthesizeReportRealTime();
}

//归集钱包
const collectWallet = ref<WalletSummary[]>([]);
/**获取归集钱包 */
async function getCollectWallet() {
  loading.value[2] = true;
  try {
    collectWallet.value = await api.synthesizeReportCollectWallet();
  } finally {
    loading.value[2] = false;
  }
}
const paymentWallet = ref<WalletSummary[]>([]);
/**获取支付钱包 */
async function getPaymentWallet() {
  loading.value[3] = true;
  try {
    paymentWallet.value = await api.synthesizeReportPayWallet();
  } finally {
    loading.value[3] = false;
  }
}

//平台
const energyPlatForm = ref<TrxPlatform>();
/**获取能量平台 */
async function getEnergyPlatform() {
  loading.value[4] = true;
  try {
    energyPlatForm.value = await api.synthesizeReportEnergyPlatform();
  } finally {
    loading.value[4] = false;
  }
}
const integral = ref<Intergal>();
/**获取积分 */
async function getIntegral() {
  loading.value[5] = true;
  try {
    integral.value = await api.synthesizeReportIntegralPlatform();
  } finally {
    loading.value[5] = false;
  }
}

getsynthesizeReport();
getsynthesizeReportInterval();
getsynthesizeReportRealTime();
getCollectWallet();
getPaymentWallet();
getEnergyPlatform();
getIntegral();
onUnmounted(() => {
  cancelAnimationFrame(requestanimation);
});
</script>

<style lang="scss" scoped>
.dataItem {
  display: grid;
  grid-template-columns: 1fr 2fr;
  flex-basis: 220px;
  align-content: center;
  align-items: center;
  width: 220px;
  flex-grow: 1;
  > .el-image {
    grid-column: 1/2;
    grid-row: 1/3;
    width: 60px;
    height: 60px;
  }
  > span:first-of-type {
    font-weight: bold;
    font-size: 20px;
  }
  > span:last-of-type {
    font-size: 15px;
    color: #666;
  }
}
.seach_row {
  width: 60%;
  display: flex;
  gap: 40px;
  margin-top: 60px;
}
.dataCard {
  display: grid;
  width: 340px;
  grid-template-columns: repeat(2, 1fr);
  color: white;
  background: rgb(29, 139, 241);
  justify-content: space-between;
  align-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  gap: 10px;
  > span:first-of-type {
    font-size: 12px;
  }
  > span:last-of-type {
    font-size: 22px;
  }
  > div:first-of-type {
    justify-self: flex-end;
    font-size: 10px;
    background: color-mix(in srgb, black 100%, transparent 80%);
    padding: 2px 4px;
    border-radius: 4px;
  }
}
.Custom {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  > span:last-of-type,
  > span:nth-last-of-type(2) {
    font-size: 12px;
  }
  > span:nth-of-type(2),
  > span:nth-of-type(3) {
    font-size: 22px;
  }
}
.dataContent {
  width: 340px;
  div {
    align-items: center;
    > span {
      font-size: 13px;
      &:first-of-type {
        color: #555;
        &::after {
          content: ":";
        }
      }
      &:last-of-type {
        font-weight: bold;
      }
    }
  }
}
</style>
