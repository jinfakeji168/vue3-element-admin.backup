<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="order_sn" :label="$t('dingDanHao')" min-width="180" />
        <el-table-column prop="uid" :label="$t('yongHuId')" min-width="200">
          <template #default="{ row }">{{ row.has_member?.id }} / {{ row.has_member?.account }}</template>
        </el-table-column>
        <el-table-column prop="has_invest_setting" :label="$t('chanPinMingCheng')" min-width="200">
          <template #default="{ row }">{{ row.has_invest_setting?.id }} / {{ row.has_invest_setting?.title }}</template>
        </el-table-column>

        <el-table-column prop="amount" :label="$t('touZiJineu')" min-width="120" />
        <el-table-column prop="invest_days" :label="$t('touZiTianShu')" min-width="100" />
        <el-table-column prop="days_rate" :label="$t('riLiShuai')" min-width="100">
          <template #default="{ row }">{{ $t("rowHasInvestSettingD", [row.has_invest_setting?.daily_yield]) }}</template>
        </el-table-column>
        <el-table-column prop="yield_type" :label="$t('shouYiLeiXing_0')" min-width="180">
          <template #default="{ row }">
            <el-tag>{{ getYieldTypeLabel(row.yield_type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('zhuangTai')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'warning'">
              {{ row.status === 1 ? $t("yiDuiHuan") : $t("weiDuiHuan") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expiration_time" :label="$t('daoQiShiJian_0')" min-width="180" />
        <el-table-column prop="settlement_time" :label="$t('jieSuanShiJian_0')" min-width="180" />
        <el-table-column prop="total_profit" :label="$t('zongShouYi')" min-width="120" />
        <el-table-column :label="$t('caoZuo')" fixed="right" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetail(row)">{{ $t("xiangQing") }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>

    <!-- 详情弹窗组件 -->
    <Detail ref="detailRef" />
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/bill/investmentRecord";
import { searchMember, searchProduct } from "@/utils";
import TableInstance from "@/utils/tableInstance";
import Detail from "./components/Detail.vue";
import { getYieldTypeLabel, yieldTypeOptions } from "@/api/system/investmentConfig";

const memberList = ref<any>([]);
const productList = ref<any>([]);
const loading = ref(false);
const detailRef = ref();
const props = defineProps<{ memberId: number }>();

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
        disabled: props.memberId,
        remoteMethod: async (res: string) => {
          loading.value = true;
          memberList.value = await searchMember({ account: res });
          loading.value = false;
        },
      },
    },
    {
      type: "select",
      modelKey: "product_id",
      label: $t("chanPin"),
      options: productList,
      props: {
        placeholder: $t("qingShuRuChanPinJin"),
        style: { width: "200px" },
        filterable: true,
        remote: true,
        clearable: true,
        loading: loading,
        remoteMethod: async (res: string) => {
          loading.value = true;
          productList.value = await searchProduct({ name: res });
          loading.value = false;
        },
      },
    },
    {
      type: "input",
      modelKey: "order_sn",
      label: $t("dingDanHao_0"),
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "yield_type",
      label: $t("shouYiLeiXing_0"),
      options: yieldTypeOptions,
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: $t("zhuangTai"),
      options: [
        { label: $t("yiDuiHuan"), value: 1 },
        { label: $t("weiDuiHuan"), value: 0 },
      ],
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "exp_datetime",
      label: $t("daoQiShiJian_0"),
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "set_datetime",
      label: $t("jieSuanShiJian_0"),
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "cre_datetime",
      label: $t("chuangJianShiJian"),
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
  product_id: undefined,
  order_sn: undefined,
  yield_type: undefined,
  status: undefined,
  exp_datetime: [],
  set_datetime: [],
  cre_datetime: [],
});
watch(
  () => props.memberId,
  (val) => {
    if (val) {
      queryParams.uid = val;
    }
  },
  {
    immediate: true,
  }
);
/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

/** 查看详情 */
const handleViewDetail = (row: Form) => {
  detailRef.value.openDialog(row.id);
};

onMounted(() => {
  table.queryHandler();
});
</script>
