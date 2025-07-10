<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="100" />
        <el-table-column prop="uid" label="用户ID" min-width="100" />
        <el-table-column prop="order_sn" label="订单号" min-width="160" />
        <el-table-column prop="recharge_amount" label="充值金额(U)" min-width="120" />
        <el-table-column prop="recharge_type" label="充值类型" min-width="140">
          <template #default="{ row }">
            <el-tag :type="getRechargeTypeColor(row.recharge_type)">
              {{ getRechargeTypeText(row.recharge_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tx_id" label="区块txID" min-width="200" show-overflow-tooltip />
        <el-table-column prop="tx_time" label="区块时间" min-width="160" />
        <el-table-column prop="created_at" label="创建时间" min-width="160" />
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

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "100px",
  formItem: [
    {
      type: "input",
      modelKey: "order_sn",
      label: "订单号",
      props: {
        placeholder: "请输入订单号",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "input",
      modelKey: "tx_id",
      label: "充值txID",
      props: {
        placeholder: "请输入充值txID",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "is_first_charge",
      label: "是否首充",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 2 },
      ],
      props: {
        placeholder: "请选择是否首充",
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "recharge_type",
      label: "充值类型",
      options: [
        { label: "TRC20-USDT", value: 1 },
        { label: "TRX", value: 2 },
        { label: "BEP10-USDT", value: 3 },
        { label: "BNB", value: 4 },
        { label: "BEP20-USDT", value: 5 },
      ],
      props: {
        placeholder: "请选择充值类型",
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: "状态",
      options: [
        { label: "充值入账", value: 1 },
        { label: "入队归集", value: 2 },
        { label: "购买能量", value: 3 },
        { label: "发起转账", value: 4 },
        { label: "归集成功", value: 5 },
        { label: "归集失败", value: 6 },
      ],
      props: {
        placeholder: "请选择状态",
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "datetime",
      label: "申请时间",
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "tx_time",
      label: "tx时间",
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
  order_sn: undefined,
  tx_id: undefined,
  is_first_charge: undefined,
  recharge_type: undefined,
  status: undefined,
  datetime: undefined,
  tx_time: undefined,
});

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
  return typeMap[type] || "未知类型";
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
    1: "充值入账",
    2: "入队归集",
    3: "购买能量",
    4: "发起转账",
    5: "归集成功",
    6: "归集失败",
  };
  return statusMap[status] || "未知状态";
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
