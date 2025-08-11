<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-tabs v-model="currentVip">
          <el-tab-pane v-for="item of vipList" :label="item.title" :name="item.vip_level">
            <template #label>
              {{ `${item.title}(${item.number})` }}
            </template>
          </el-tab-pane>
        </el-tabs>
        <div class="flex">
          <el-button v-hasPerm="['memberList:add']" type="primary" @click="table.editHandler()">
            <template #icon>
              <Plus />
            </template>
            {{ $t("xinZeng") }}
          </el-button>
          <el-button
            v-hasPerm="['memberList:batch']"
            type="success"
            @click="
              table.openHandler(1);
              tabIndex = 0;
            "
          >
            <template #icon>
              <Plus />
            </template>
            {{ $t("piLiangCaoZuo") }}
          </el-button>
          <!-- <el-button v-hasPerm="['memberList:export']" type="info">
            <template #icon>
              <Plus />
            </template>
            导出会员
          </el-button> -->
          <el-button
            v-hasPerm="['memberList:batch']"
            type="danger"
            @click="
              table.openHandler(1);
              tabIndex = 6;
            "
            :disabled="table.selectList.value.length === 0"
          >
            <template #icon>
              <Plus />
            </template>
            {{ $t("piLiangFengJin") }}
          </el-button>
          <el-button
            v-hasPerm="['memberList:batch']"
            type="warning"
            @click="
              table.openHandler(1);
              tabIndex = 13;
            "
            :disabled="table.selectList.value.length === 0"
          >
            <template #icon>
              <Plus />
            </template>
            {{ $t("sheZhiFenZu") }}
          </el-button>
        </div>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event, ['id', 'account'])">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="show_name" :label="$t('yongHuXinXi')" min-width="200px">
          <template #default="{ row }">
            <div>
              <span class="text-gray-500">ID:</span>
              <span class="text-gray-700">{{ row.id }}</span>
              <el-button class="ml-4" type="primary" size="small" @click="table.editHandler(row, 4)">{{ $t("chaKanXiaJi") }}</el-button>
            </div>
            <div>
              <span class="text-gray-500">{{ $t("zhangHao_0") }}</span>
              <span class="text-gray-700">{{ row?.account }}</span>
            </div>
            <div>
              <span class="text-gray-500">{{ $t("dengJi_1") }}</span>
              <span class="text-gray-700">{{ $t("levelRowviplevelRowiso_0", [row.vip_level, row.is_online == 1 ? $t("zaiXian") : $t("liXian")]) }}</span>
            </div>
            <div>
              <span class="text-gray-500">{{ $t("yuYan") }}</span>
              <span class="text-gray-700">{{ commonStore.langList.find((i) => i.id == row.lang_id)?.name }}</span>
            </div>
            <div>
              <span class="text-gray-500">{{ $t("tiYanJin") }}</span>
              <span class="text-gray-700">{{ row.experience_account }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('zhuangTaiSheZhi')" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <el-switch
                v-model="row.status"
                inline-prompt
                :active-value="StatusEnum.False"
                :inactive-value="StatusEnum.True"
                :active-text="$t('yunXuDengLu')"
                :inactive-text="$t('jinZhiDengLu')"
                @change="statusChangeHandler(row, 'status')"
              />
              <el-switch
                v-model="row.withdrawal_status"
                inline-prompt
                :active-value="StatusEnum.False"
                :inactive-value="StatusEnum.True"
                :active-text="$t('yunXuTiXian')"
                :inactive-text="$t('jinZhiTiXian')"
                @change="statusChangeHandler(row, 'withdrawal_status')"
              />

              <el-switch
                v-model="row.is_quant"
                inline-prompt
                :active-value="StatusEnum.False"
                :inactive-value="StatusEnum.True"
                :active-text="$t('kaiQiLiangHua')"
                :inactive-text="$t('guanBiLiangHua')"
                @change="statusChangeHandler(row, 'is_quant')"
              />
              <el-switch
                v-model="row.is_upgrade_withdrawal"
                inline-prompt
                :active-value="StatusEnum.False"
                :inactive-value="StatusEnum.True"
                :active-text="$t('yunXuShengJiTiXian')"
                :inactive-text="$t('jinZhiShengJiTiXian')"
                @change="statusChangeHandler(row, 'is_upgrade_withdrawal')"
              />

              <el-switch
                v-model="row.is_enabled_invite_code"
                inline-prompt
                :active-value="StatusEnum.False"
                :inactive-value="StatusEnum.True"
                :active-text="$t('qiYongYaoQingMa')"
                :inactive-text="$t('jinYongYaoQingMa')"
                @change="statusChangeHandler(row, 'is_enabled_invite_code')"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('yuE')" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">{{ $t("yongJinZhangHu_2") }}</span>
                <span class="text-gray-700">{{ row.brokerage_account || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("zhiNengZhangHu_0") }}</span>
                <span class="text-gray-700">{{ row.smart_account || "0.0000" }}</span>
              </div>

              <div>
                <span class="text-gray-500">{{ $t("heYueZhangHu_0") }}</span>
                <span class="text-gray-700">{{ row.second_contract_account || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("liangHuaZhangHu_3") }}</span>
                <span class="text-gray-700">{{ row.quant_account || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("tiYanJin") }}</span>
                <span class="text-gray-700">{{ row.experience_account || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("liangHuaShouYi") }}</span>
                <span class="text-gray-700">{{ row.quant_profit || "0.0000" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('qianBaoXinXi')" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">trx:</span>
                <span class="text-gray-700">{{ row.min_withdrawal_amount_trx || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">trc20-usdt:</span>
                <span class="text-gray-700">{{ row.min_withdrawal_amount_usdt || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">bnb:</span>
                <span class="text-gray-700">{{ row.min_withdrawal_amount_bnb || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">bep20-usdt/usdc:</span>
                <span class="text-gray-700">{{ row.bep20_recharge_wallet || "--" }}/{{ row.bep20_withdrawal_wallet || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("touZiZonge") }}</span>
                <span class="text-gray-700">{{ row.invest_total || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("touZiWeiJieSuan") }}</span>
                <span class="text-gray-700">{{ row.invest_unsettled || "0.0000" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('zhuCeDengLu')" min-width="250px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">{{ $t("zhuCeFangShi") }}</span>
                <span class="text-gray-700">{{ getRegisterType(row.type) || "后台" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("zhuCe_0") }}</span>
                <span class="text-gray-700">{{ row.created_at || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("zhuCeIp_0") }}</span>
                <span class="text-gray-700">{{ $t("rowregisteripHouTaiRo", [row.register_ip || "后台", row.register_area]) }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("zuiHou") }}</span>
                <span class="text-gray-700">{{ row.last_login_at || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("zuiHouIp") }}</span>
                <span class="text-gray-700">{{ $t("rowLastLoginIpOrOr_0", [row.last_login_ip || "", row.last_login_area]) }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("suoZaiCengJi") }}</span>
                <span class="text-gray-700">{{ row.group_id }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tuiGuangYuan')" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">{{ $t("dingJi") }}</span>
                <span class="text-gray-700">{{ row.top_id || "--" }}/{{ row.top_account || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("yiJi") }}</span>
                <span class="text-gray-700">{{ row.parent_id || "--" }}/{{ row.parent_account || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("erJi_0") }}</span>
                <span class="text-gray-700">{{ row.grandpa_id || "--" }}/{{ row.grandpa_account || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("sanJi_0") }}</span>
                <span class="text-gray-700">{{ row.great_grandpa_id || "--" }}/{{ row.great_grandpa_account || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("yaoQingMa") }}</span>
                <span class="text-gray-700">{{ row.invita_code || "--" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('chongTiVip')" min-width="250px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">{{ $t("chongZhi_0") }}</span>
                <span class="text-gray-700">{{ row.total_recharge_amount || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("tiXian_0") }}</span>
                <span class="text-gray-700">{{ row.total_withdrawal_amount || "0.0000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("kaiShiShiJian_3") }}</span>
                <span class="text-gray-700">{{ row.created_at || "2025-05-20 23:13:58" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("jieShuShiJian_3") }}</span>
                <span class="text-gray-700">{{ row.end_time || "2026-05-20 23:13:58" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("zhiTuiXiaJi") }}</span>
                <span class="text-gray-700">{{ row.withdrawal_invite_user_number }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('qiTaXinXi')" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">{{ $t("youXiang_0") }}</span>
                <span class="text-gray-700">{{ row.email || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("lianXiFangShi_0") }}</span>
                <span class="text-gray-700">{{ row.telephone || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("beiZhu_1") }}</span>
                <span class="text-gray-700">{{ row.remark || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">{{ $t("liangHuaGaiShuai") }}</span>
                <span class="text-gray-700">{{ $t("rowQuantFinalEarnings_0", [row.quant_final_earnings_discount]) }}</span>
              </div>
              <div>
                <span class="text-gray-500">ws/tg:</span>
                <span class="text-gray-700">{{ row.whatsapp || "--" }}/{{ row.telegram || "--" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('caoZuo')" fixed="right" width="200px">
          <template #default="{ row }">
            <div class="grid grid-cols-2 gap-2">
              <el-button type="primary" size="small" @click="table.editHandler(row, 3)">{{ $t("xiangQing") }}</el-button>
              <el-button type="success" size="small" v-hasPerm="['memberList:supplement']" @click="replenishmentHandler(row)">{{ $t("buDan") }}</el-button>
              <el-button type="warning" size="small" v-hasPerm="['memberList:checkMoney']" :loading="loading[0]" @click="checkMoney(row)">{{ $t("chaQian") }}</el-button>
              <el-button type="info" size="small" v-hasPerm="['memberList:changeMoney']" @click="table.editHandler(row, 2)">{{ $t("gaiQian") }}</el-button>
              <el-button type="success" size="small" v-hasPerm="['memberList:lowerLevelRecharge']" @click="table.editHandler(row, 5)">{{ $t("xiaJiChongZhi") }}</el-button>
              <el-button type="danger" size="small" v-hasPerm="['memberList:forceOffLine']" @click="forceOfflineHandler(row)">{{ $t("xiaXian") }}</el-button>
              <el-button type="warning" size="small" v-hasPerm="['memberList:simulateLogin']" :loading="loading[1]" @click="simulateLogin(row)">{{ $t("moNiDengLu") }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
    <addMember v-model="table.visible.value[0]" @finish="table.queryHandler()" />
    <batchOperation v-model="table.visible.value[1]" :account="table.selectList.value" :tabIndex="tabIndex" @finish="table.queryHandler()" />
    <changeBalance v-model="table.visible.value[2]" :member-id="table.currentData.value?.id" @finish="table.queryHandler()" />
    <detail v-model="table.visible.value[3]" :member-id="table.currentData.value?.id" @finish="table.queryHandler()" />
    <lowerLevel v-model="table.visible.value[4]" :member-id="table.currentData.value?.id" :member-account="table.currentData.value?.account" @finish="table.queryHandler()" />
    <lowerLevelRecharge v-model="table.visible.value[5]" :member-id="table.currentData.value?.id" @finish="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";
import api, { type Member, MemberQuery, VipItem } from "@/api/members/memberList";
import { FormInstance } from "element-plus";
import addMember from "./components/addMember.vue";
import batchOperation from "./components/batchOperation.vue";
import changeBalance from "./components/changeBalance.vue";
import detail from "./components/detail.vue";
import lowerLevel from "./components/lowerLevel.vue";
import lowerLevelRecharge from "./components/lowerLevelRecharge.vue";
import commonApi from "@/api/common";
import { useStore } from "@/store/modules/common";
const commonStore = useStore();
/** 查询表单引用 */
const queryFormRef = ref<FormInstance>();

/** 会员列表加载状态 */
const loading = ref([false, false]);

const langOptions = ref<OptionType[]>([]);
async function getLangOptions() {
  const list = await commonStore.getLangListAsync();
  langOptions.value = list.map((val) => ({ label: val.name, value: val.id }));
}
const groupOptions = ref<OptionType[]>([]);
async function getGroupOptions() {
  const list = await commonStore.getGroupListAsync();
  groupOptions.value = list.map((val) => ({ label: val.title, value: val.id }));
}
getGroupOptions();
getLangOptions();
/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "100px",
  formItem: [
    {
      type: "input",
      modelKey: "id",
      label: "ID",
      props: {
        placeholder: $t("qingShuRuId"),
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "account",
      label: $t("zhangHu"),
      props: {
        placeholder: $t("qingShuRuZhangHu"),
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "invita_code",
      label: $t("yaoQingMa_0"),
      props: {
        placeholder: $t("qingShuRuYaoQingMa"),
        style: { width: "200px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "created_at",
      label: $t("zhuCeShiJian"),
      props: {
        style: { width: "400px" },
        startPlaceholder: $t("kaiShiShiJian_2"),
        endPlaceholder: $t("jieShuShiJian_2"),
      },
    },
    {
      type: "input",
      modelKey: "register_ip",
      label: $t("zhuCeIp"),
      props: {
        placeholder: $t("qingShuRuZhuCeIp"),
        style: { width: "200px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "last_login_time",
      label: $t("zuiHouDengLuShiJian"),
      props: {
        style: { width: "400px" },
        startPlaceholder: $t("kaiShiShiJian_2"),
        endPlaceholder: $t("jieShuShiJian_2"),
      },
    },
    {
      type: "input",
      modelKey: "last_login_ip",
      label: $t("zuiHouDengLuIp"),
      props: {
        placeholder: $t("qingShuRuZuiHouDeng"),
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "group_id",
      label: $t("yongHuZu"),
      options: groupOptions,
      props: {
        placeholder: $t("qingXuanZeYongHuZu"),
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: $t("zhuangTai"),
      options: [
        { value: StatusEnum.False, label: $t("zhengChang") },
        { value: StatusEnum.True, label: $t("jinYong") },
      ],
      props: {
        placeholder: $t("qingXuanZeZhuangTai"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "last_recharge_time",
      label: $t("zuiHouChongZhiShiJi"),
      props: {
        style: {},
        startPlaceholder: $t("kaiShiShiJian_2"),
        endPlaceholder: $t("jieShuShiJian_2"),
      },
    },
    {
      type: "inputnumber",
      modelKey: ["min_total_recharge_amount", "max_total_recharge_amount"],
      label: $t("zongChongZhiJinE"),
      props: {
        placeholder: [$t("zuiXiaoChongZhiJinE"), $t("zuiDaChongZhiJinE")],
        style: { width: "200px" },
      },
    },
    {
      type: "inputnumber",
      modelKey: ["min_total_withdrawal_amount", "max_total_withdrawal_amount"],
      label: $t("zongTiXianJinE"),
      props: {
        placeholder: [$t("zuiXiaoTiXianJinE_0"), $t("zuiDaTiXianJinE")],
        style: { width: "200px" },
      },
    },
    {
      type: "inputnumber",
      modelKey: ["min_brokerage_account", "max_brokerage_account"],
      label: $t("jingJiRenZhangHu"),
      props: {
        placeholder: [$t("zuiXiaoJinE"), $t("zuiDaJinE")],
        style: { width: "200px" },
      },
    },
    {
      type: "inputnumber",
      modelKey: "last_withdrawal_amount",
      label: $t("zuiHouTiXianJinE"),
      props: {
        placeholder: $t("qingShuRuZuiHouTiX"),
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "withdrawal_wallet",
      label: $t("tiXianQianBao"),
      props: {
        placeholder: $t("qingShuRuTiXianQian"),
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "recharge_wallet",
      label: $t("chongZhiQianBao"),
      props: {
        placeholder: $t("qingShuRuChongZhiQi"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "lang_id",
      label: $t("yuYan_0"),
      options: langOptions,
      props: {
        placeholder: $t("qingXuanZeYuYan"),
        style: { width: "200px" },
        clearable: true,
      },
    },
  ],
};

/** 查询参数 */
const queryParams = reactive<MemberQuery>({
  id: undefined,
  account: undefined,
  invita_code: undefined,
  created_at: [],
  register_ip: undefined,
  last_login_time: [],
  last_login_ip: undefined,
  group_id: undefined,
  status: undefined,
  vip_level: undefined,
  last_recharge_time: [],
  min_total_recharge_amount: undefined,
  max_total_recharge_amount: undefined,
  min_total_withdrawal_amount: undefined,
  max_total_withdrawal_amount: undefined,
  min_brokerage_account: undefined,
  max_brokerage_account: undefined,
  last_withdrawal_amount: undefined,
  withdrawal_wallet: undefined,
  recharge_wallet: undefined,
  lang_id: undefined,
});

const table = new TableInstance<Member>(api, queryParams, 20, queryFormRef);

const tabIndex = ref(0);
const currentVip = ref(0);
watch(
  currentVip,
  (val) => {
    queryParams.vip_level = val >= 0 ? val : undefined;
    table.queryHandler();
  },
  {
    immediate: true,
  }
);
const vipList = ref<VipItem[]>([]);
async function getvipList() {
  const res = await api.getVipGroupList();
  if (res) {
    res.reverse();
    const number = res.map((val) => val.number).reduce((pre, cur) => pre + cur);
    res.unshift({ title: $t("quanBu"), number, vip_level: -1 });
    res.sort((a, b) => a.vip_level - b.vip_level);
    const findRes = res.find((val) => !val.title);
    if (findRes) {
      findRes.title = $t("puTongYongHu");
    }
    vipList.value = res;
    console.log("🚀 ~ getvipList ~ vipList.value :", vipList.value);
    currentVip.value = res[0].vip_level as number;
  }
}
getvipList();

/**
 * 处理会员状态变更
 * @param row 会员数据
 * @param type 状态类型 'status' | 'withdrawal_status' | 'is_quant' | 'is_upgrade_withdrawal' | 'is_enabled_invite_code'
 */
function statusChangeHandler(row: Member, type: keyof Pick<Member, "status" | "withdrawal_status" | "is_quant" | "is_upgrade_withdrawal" | "is_enabled_invite_code">) {
  const apiMap = {
    status: api.changeStatus,
    withdrawal_status: api.changeWithdrawalStatus,
    is_quant: api.changeQuantStatus,
    is_upgrade_withdrawal: api.changeUpgradeWithdrawalStatus,
    is_enabled_invite_code: api.changeInvitationStatus,
  };

  apiMap[type]({
    id: row.id,
    state: row[type],
  });
}
function getRegisterType(type: number) {
  if (type == 1) return $t("shouJiHao");
  else if (type == 2) return $t("youXiang");
  else if (type == 3) return $t("login.username");
  else if (type == 4) return "telegram";
  else if (type == 5) return $t("autoTelegram");
  else return type;
}

async function replenishmentHandler(row: Member) {
  await ElMessageBox.confirm($t("queRenBuDan"), $t("tiShi"), {
    type: "warning",
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true;
        await api.addOrder(row.id);
        ElMessage.success($t("caoZuoChengGong"));
      }
      done();
    },
  });
}
async function checkMoney(row: Member) {
  loading.value[0] = true;
  const res = await api.checkMoney(row.id);
  let html = [];
  for (let k in res) {
    html.push(h("div", `${k}: ${res[k]}`));
  }
  ElMessageBox({
    message: h("div", html),
    showCancelButton: false,
  });
  loading.value[0] = false;
}
/**模拟登录 */
async function simulateLogin(row: Member) {
  loading.value[1] = true;
  const res = await api.simulateLogin(row.id);
  loading.value[1] = false;
  if (res) {
    window.open(res.url, "_blank");
  }
}

async function forceOfflineHandler(row: Member) {
  await ElMessageBox.confirm($t("queRenQiangZhiXiaXi"), $t("tiShi"), {
    type: "warning",
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true;
        await api.forceOffline(row.id);
      }
      done();
    },
  });
}
</script>

<style lang="scss" scoped>
.grid > .el-button + .el-button {
  margin: 0;
}
</style>
