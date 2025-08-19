<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <div class="flex gap-2">
          <el-button type="primary" @click="table.openHandler(2)" :disabled="!table.ischecked()" v-hasPerm="['withdrawOrder:audit']">{{ $t("yiJianShenHe") }}</el-button>
          <el-button type="success" @click="rePayHandler" v-hasPerm="['withdrawOrder:rePay']">{{ $t("shiBaiDingDanZhongX") }}</el-button>
          <el-button type="danger" @click="changePayStatusHandler(table.selectList.value)" :disabled="!table.ischecked()" v-hasPerm="['withdrawOrder:manualPay']">
            {{ $t("yiJianShouDongChuKu") }}
          </el-button>
          <el-button type="info" @click="returnHandler(table.selectList.value)" :disabled="!table.ischecked()" v-hasPerm="['withdrawOrder:return']">
            {{ $t("yiJianTuiHui") }}
          </el-button>
          <!-- <el-button type="default">导出订单</el-button> -->
          <el-button type="primary" @click="table.openHandler(4)" v-hasPerm="['withdrawOrder:manualWithdraw']">{{ $t("shouDongTiXian") }}</el-button>
          <el-button type="primary" @click="table.queryHandler()">{{ $t("shuaXinDingDan") }}</el-button>
        </div>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column :label="$t('yongHuXinXi')" min-width="160">
          <template #default="{ row }">
            <div>
              <span>UID</span>
              <span>{{ row.uid }}</span>
            </div>
            <div>
              <span>{{ $t("yongHu_0") }}</span>
              <span>{{ row.account }}</span>
            </div>
            <div>
              <span>{{ $t("guoJia") }}</span>
              <span>{{ row.user_country }}</span>
            </div>
            <div>
              <span>{{ $t("dingJiShangJi") }}</span>
              <span>{{ row.top_parent_id }}/{{ row.top_parent_account }}</span>
            </div>
            <div>
              <span>{{ $t("yiJiShangJi") }}</span>
              <span>{{ row.first_parent_id }}/{{ row.first_parent_account }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="order_sn" :label="$t('dingDanXinXi')" min-width="240">
          <template #default="{ row }">
            <div>
              <span>{{ $t("dingDanHao_1") }}</span>
              <span>{{ row.order_sn }}</span>
            </div>
            <div>
              <span>{{ $t("shenQingShiJian_1") }}</span>
              <span>{{ row.created_at }}</span>
            </div>
            <div>
              <span>{{ $t("zuiJinChongZhi") }}</span>
              <span>{{ row.last_recharge_amount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="withdraw_amount" :label="$t('tiXianJinE')" min-width="200">
          <template #default="{ row }">
            <div>
              <span>{{ $t("tiXianJine") }}</span>
              <span>{{ row.withdraw_amount }}</span>
            </div>
            <div>
              <span>{{ $t("shouXuFei") }}</span>
              <span>{{ row.fees }}</span>
            </div>
            <div>
              <span>{{ $t("shiJiDaoZhang_0") }}</span>
              <span>{{ row.arrival_amount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tiXianXinXi')" min-width="200">
          <template #default="{ row }">
            <div>
              <span>{{ $t("biZhong_1") }}</span>
              <span>{{ row.channel }}</span>
            </div>
            <div>
              <span>{{ $t("tiXianDiZhi_0") }}</span>
              <span>{{ row.rece_address }}</span>
            </div>
            <div>
              <span>{{ $t("chuKuanDiZhi") }}</span>
              <span>{{ row.send_address }}</span>
            </div>
            <div>
              <span>{{ $t("tiKuanIp") }}</span>
              <span>{{ row.withdraw_ip }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('shenHeXinXi')" min-width="180">
          <template #default="{ row }">
            <div>
              <span>{{ $t("zhuangTai_0") }}</span>
              <el-tag :type="getStatusTypeHandler(row.status)">{{ getStatusTextHandler(row.status) }}</el-tag>
            </div>
            <div>
              <span>{{ $t("beiZhu_0") }}</span>
              <span>{{ row.audit_remark }}</span>
            </div>
            <div>
              <span>{{ $t("caoZuoYuan") }}</span>
              <span>{{ row.audit_operator }}</span>
            </div>
            <div>
              <span>{{ $t("caoZuoShiJian") }}</span>
              <span>{{ row.audit_time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('chuKuanXinXi')" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div>
              <span>{{ $t("chuKuanZhuangTai") }}</span>
              <el-tag :type="getOrderResultType(row.payment_status)">
                {{ getOrderResultText(row.payment_status) }}
              </el-tag>
            </div>
            <div>
              <span>{{ $t("chuKuanJine") }}</span>
              <span>{{ row.payment_amount }}</span>
            </div>
            <div>
              <span>{{ $t("daKuanTx") }}</span>
              <span>{{ row.tx_id }}</span>
            </div>
            <div>
              <span>{{ $t("pingTaiDanHao") }}</span>
              <span>{{ row.platform_order_no }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="transfer_result" :label="$t('zhuanZhangJieGuo')" min-width="160" show-overflow-tooltip />

        <el-table-column prop="updated_at" :label="$t('caoZuo')" min-width="160" fixed="right">
          <template #default="{ row }">
            <div class="grid grid-cols-2 gap-2">
              <el-button type="primary" size="small" @click="queryHandler(row.order_sn)" :disabled="row.payment_status != 2" v-hasPerm="['withdrawOrder:query']">
                {{ $t("chaXun") }}
              </el-button>
              <el-button type="danger" size="small" @click="table.editHandler(row, 2)" :disabled="![0, 4].includes(row.status)" v-hasPerm="['withdrawOrder:audit']">
                {{ $t("shenHe_0") }}
              </el-button>
              <el-button type="info" size="small" @click="ignoreHandler(row.id)" :disabled="row.status != 0" v-hasPerm="['withdrawOrder:ignore']">{{ $t("huLve") }}</el-button>
              <el-button type="danger" size="small" @click="payHandler(row.id)" :disabled="row.status != 1" v-hasPerm="['withdrawOrder:paymentOut']">{{ $t("chuKuan") }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
    <check v-model="table.visible.value[2]" :data="table.currentData.value" :ids="table.selectList.value" @finish="table.queryHandler()" />
    <manuallyWithdraw v-model="table.visible.value[4]" @finish="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/bill/withdrawOrder";
import check from "./components/check.vue";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";
import manuallyWithdraw from "./components/manuallyWithdraw.vue";
const memberList = ref<any>([]);
const loading = ref(false);
const props = defineProps<{ uid: number }>();
/** 订单状态列表 */
const statusList = [
  { label: $t("shenHeZhong"), value: 0 },
  { label: $t("chuLiZhong_0"), value: 1 },
  { label: $t("tiXianChengGong"), value: 2 },
  { label: $t("tiXianJuJue"), value: 3 },
  { label: $t("tiXianHuLve"), value: 4 },
  { label: $t("yuebuZu"), value: 5 },
  { label: $t("duiLieZhong"), value: 6 },
];
const order_result = [
  { label: $t("weiChuKuan"), value: 0 },
  { label: $t("chuKuanChengGong"), value: 1 },
  { label: $t("chuKuanShiBai"), value: 2 },
];
/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "100px",
  formItem: [
    {
      type: "select",
      modelKey: "uid",
      label: $t("yongHu"),
      options: memberList,
      props: {
        placeholder: $t("qingShuRuYongHuJin"),
        style: { width: "200px" },
        filterable: true,
        remote: true,
        clearable: true,
        loading: loading,
        disabled: props.uid,
        remoteMethod: async (res: string) => {
          loading.value = true;
          memberList.value = await searchMember({ account: res });
          loading.value = false;
        },
      },
    },
    {
      type: "input",
      modelKey: "order_sn",
      label: $t("dingDanHao_0"),
      props: {
        placeholder: $t("qingShuRuDingDanHao"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "input",
      modelKey: "tx_id",
      label: $t("daKuanTxid"),
      props: {
        placeholder: $t("qingShuRuDaKuanTxid"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: $t("dingDanZhuangTai"),
      options: statusList,
      props: {
        placeholder: $t("qingXuanZeDingDanZh"),
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "order_result",
      label: $t("zhuanZhangZhuangTai"),
      options: order_result,
      props: {
        placeholder: $t("qingXuanZeZhuanZhang"),
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "datetime",
      label: $t("shenQingShiJian_0"),
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "operate_time",
      label: $t("caoZuoShiJian_0"),
      props: {
        style: { width: "400px" },
      },
    },
  ],
};

/** 查询表单引用 */
const queryFormRef = ref(ElForm);

/** 查询参数 */
const queryParams = reactive<Query>({
  uid: undefined,
  order_sn: undefined,
  tx_id: undefined,
  status: undefined,
  order_result: undefined,
  datetime: undefined,
  operate_time: undefined,
});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

onMounted(() => {
  table.queryHandler();
});
watch(
  () => props.uid,
  (val) => {
    if (val) queryParams.uid = val;
  },
  {
    immediate: true,
  }
);
//对失败的订单重新出款
async function rePayHandler() {
  await ElMessageBox.confirm($t("gaiCaoZuoJiangDuiZh"), $t("tiShi"), {
    beforeClose: async (action, instance, done) => {
      if (action == "confirm") {
        instance.confirmButtonLoading = true;
        try {
          await api.oneKeyPay();
          done();
          table.queryHandler();
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    },
  });
}
async function changePayStatusHandler(ids: any[]) {
  ElMessageBox.confirm($t("gaiCaoZuoJiangGaiDi"), $t("tiShi"), {
    beforeClose: async (action, instance, done) => {
      if (action == "confirm") {
        instance.confirmButtonLoading = true;
        try {
          await api.batchPay(ids);
          done();
          table.queryHandler();
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    },
  });
}
async function payHandler(id: number) {
  ElMessageBox.confirm($t("shiFouQueRenDaKuan"), $t("tiShi"), {
    beforeClose: async (action, instance, done) => {
      if (action == "confirm") {
        instance.confirmButtonLoading = true;
        try {
          await api.pay(id);
        } finally {
          done();
          table.queryHandler();
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    },
  });
}
async function ignoreHandler(id: number) {
  ElMessageBox.confirm($t("shiFouQueRenHuLveC"), $t("tiShi"), {
    beforeClose: async (action, instance, done) => {
      if (action == "confirm") {
        instance.confirmButtonLoading = true;
        try {
          await api.ignore([id]);
          done();
          table.queryHandler();
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    },
  });
}
async function queryHandler(order_sn: string) {
  const res = await api.query(order_sn);
}
async function returnHandler(ids: any[]) {
  ElMessageBox.confirm($t("gaiCaoZuoJiangDuiYu"), $t("tiShi"), {
    beforeClose: async (action, instance, done) => {
      if (action == "confirm") {
        instance.confirmButtonLoading = true;
        try {
          await api.oneKeyReturn(ids);
          done();
          table.queryHandler();
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    },
  });
}

// 订单状态处理函数
/** 获取订单状态标签类型 */
function getStatusTypeHandler(status: number) {
  const statusTypeArr = ["warning", "primary", "success", "danger", "info", "danger", "info"];
  return statusTypeArr[status] ?? "info";
}

/** 获取订单状态文本 */
function getStatusTextHandler(status: number) {
  const statusTextArr = statusList.map((item) => item.label);
  return statusTextArr[status] ?? $t("weiZhi");
}

// 转账状态处理函数
const getOrderResultType = (result: number) => {
  const resultMap: Record<number, string> = ["warning", "success", "danger"];
  return resultMap[result] || "info";
};

const getOrderResultText = (result: number) => {
  const resultMap: Record<number, string> = order_result.map((item) => item.label);
  return resultMap[result] || $t("weiZhi");
};
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.el-button {
  margin: 0;
}
</style>
