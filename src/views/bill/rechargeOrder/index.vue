<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="100" />
        <el-table-column prop="uid" :label="$t('yongHuId')" min-width="100" />
        <el-table-column prop="order_sn" :label="$t('dingDanHao_0')" min-width="160" />
        <el-table-column prop="recharge_amount" :label="$t('chongZhiJineu')" min-width="120" />
        <el-table-column prop="recharge_type" :label="$t('chongZhiLeiXing_0')" min-width="140">
          <template #default="{ row }">
            <el-tag :type="getRechargeTypeColor(row.recharge_type)">
              {{ getRechargeTypeText(row.recharge_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('zhuangTai')" min-width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tx_id" :label="$t('quKuaiTxid')" min-width="200" show-overflow-tooltip />
        <el-table-column prop="tx_time" :label="$t('quKuaiShiJian')" min-width="160" />
        <el-table-column prop="created_at" :label="$t('chuangJianShiJian')" min-width="160" />
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/bill/rechargeOrder";

import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";

const memberList = ref<any>([]);
const loading = ref(false);
const props = defineProps<{ uid: number }>();

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
      label: $t("chongZhiTxid"),
      props: {
        placeholder: $t("qingShuRuChongZhiTx"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "is_first_charge",
      label: $t("shiFouShouChong"),
      options: [
        { label: $t("shi"), value: 1 },
        { label: $t("fou"), value: 2 },
      ],
      props: {
        placeholder: $t("qingXuanZeShiFouSho"),
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "recharge_type",
      label: $t("chongZhiLeiXing_0"),
      options: [
        { label: "TRC20-USDT", value: 1 },
        { label: "TRX", value: 2 },
        { label: "BEP10-USDT", value: 3 },
        { label: "BNB", value: 4 },
        { label: "BEP20-USDT", value: 5 },
      ],
      props: {
        placeholder: $t("qingXuanZeChongZhiL"),
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: $t("zhuangTai"),
      options: [
        { label: $t("chongZhiRuZhang"), value: 1 },
        { label: $t("ruDuiGuiJi"), value: 2 },
        { label: $t("gouMaiNengLiang"), value: 3 },
        { label: $t("faQiZhuanZhang"), value: 4 },
        { label: $t("guiJiChengGong"), value: 5 },
        { label: $t("guiJiShiBai"), value: 6 },
      ],
      props: {
        placeholder: $t("qingXuanZeZhuangTai"),
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
      modelKey: "tx_time",
      label: $t("txShiJian"),
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
  is_first_charge: undefined,
  recharge_type: undefined,
  status: undefined,
  datetime: undefined,
  tx_time: undefined,
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
/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

onMounted(() => {
  table.queryHandler();
});

// 充值类型处理函数
const getRechargeTypeText = (type: number) => {
  const typeMap: Record<string, string> = {
    1: "TRC20-USDT",
    2: "TRX",
    3: "BEP10-USDT",
    4: "BNB",
    5: "BEP20-USDT",
  };
  return typeMap[type] || $t("weiZhiLeiXing");
};

const getRechargeTypeColor = (type: number) => {
  const colorMap: Record<string, string> = {
    1: "primary",
    2: "success",
    3: "warning",
    4: "danger",
    5: "info",
  };
  return colorMap[type] || "";
};

// 状态处理函数
const getStatusText = (status: number) => {
  const statusMap: Record<string, string> = {
    1: $t("chongZhiRuZhang_0"),
    2: $t("ruDuiGuiJi_0"),
    3: $t("gouMaiNengLiang_0"),
    4: $t("faQiZhuanZhang_0"),
    5: $t("guiJiChengGong_0"),
    6: $t("guiJiShiBai_0"),
  };
  return statusMap[status] || $t("weiZhiZhuangTai");
};

const getStatusColor = (status: number) => {
  const colorMap: Record<string, string> = {
    1: "success",
    2: "primary",
    3: "warning",
    4: "primary",
    5: "success",
    6: "danger",
  };
  return colorMap[status] || "";
};
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
