<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="100" />
        <el-table-column label="用户ID/账号" min-width="140">
          <template #default="{ row }">
            <span>{{ row.uid }}/</span>
            <span>{{ row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_sn" label="订单号" min-width="160" />
        <el-table-column prop="withdraw_amount" label="提现金额(U)" min-width="120" />
        <el-table-column prop="fees" label="手续费" min-width="100" />
        <el-table-column prop="channel" label="提现通道" min-width="120" />
        <el-table-column prop="rece_address" label="提现地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="tx_id" label="打款txID" min-width="160" show-overflow-tooltip />
        <el-table-column prop="status" label="订单状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="order_result" label="转账状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getOrderResultType(row.order_result)">
              {{ getOrderResultText(row.order_result) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="申请时间" min-width="160" />
        <el-table-column prop="updated_at" label="操作时间" min-width="160" />
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/bill/withdrawOrder";

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
      label: "用户",
      options: memberList,
      props: {
        placeholder: "请输入用户进行查询",
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
      label: "打款txID",
      props: {
        placeholder: "请输入打款txID",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: "订单状态",
      options: [
        { label: "待审核", value: 0 },
        { label: "打款中", value: 1 },
        { label: "已完成", value: 2 },
        { label: "失败", value: 3 },
      ],
      props: {
        placeholder: "请选择订单状态",
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "order_result",
      label: "转账状态",
      options: [
        { label: "未转", value: 0 },
        { label: "成功", value: 1 },
        { label: "失败", value: 2 },
      ],
      props: {
        placeholder: "请选择转账状态",
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
      modelKey: "operate_time",
      label: "操作时间",
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

// 订单状态处理函数
const getStatusType = (status: number) => {
  const statusMap: Record<number, string> = { 0: "warning", 1: "primary", 2: "success", 3: "danger" };
  return statusMap[status] || "info";
};

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = { 0: "待审核", 1: "打款中", 2: "已完成", 3: "失败" };
  return statusMap[status] || "未知";
};

// 转账状态处理函数
const getOrderResultType = (result: number) => {
  const resultMap: Record<number, string> = { 0: "warning", 1: "success", 2: "danger" };
  return resultMap[result] || "info";
};

const getOrderResultText = (result: number) => {
  const resultMap: Record<number, string> = { 0: "未转", 1: "成功", 2: "失败" };
  return resultMap[result] || "未知";
};
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
