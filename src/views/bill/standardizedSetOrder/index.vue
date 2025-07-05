<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="100" />
        <el-table-column prop="uid" label="uID/用户" min-width="120">
          <template #default="{ row }">
            <span>{{ row?.has_member?.id }}</span>
            /
            <span>{{ row?.has_member?.account }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_sn" label="订单号" min-width="150" />
        <el-table-column prop="collected_amount" label="归集金额" min-width="120" />
        <el-table-column prop="send_address" label="发送地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="rece_address" label="接收地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="tx_id" label="交易ID" min-width="150" show-overflow-tooltip />
        <el-table-column prop="amount_type" label="金额类型" min-width="120">
          <template #default="{ row }">
            <el-tag>
              {{ getAmountTypeLabel(row.amount_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tx_time" label="交易时间" min-width="180" />
        <el-table-column prop="created_at" label="添加时间" min-width="180" />
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/bill/standardizedSetOrder";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";

const memberList = ref<any>([]);
const loading = ref(false);

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
      label: "交易ID",
      props: {
        placeholder: "请输入交易ID",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: "状态",
      options: [
        { label: "处理中", value: 0 },
        { label: "完成", value: 1 },
        { label: "失败", value: 2 },
      ],
      props: {
        placeholder: "请选择状态",
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "amount_type",
      label: "金额类型",
      options: [
        { label: "TRC20-USTD", value: 1 },
        { label: "TRX", value: 2 },
        { label: "BEP10-USTD", value: 3 },
        { label: "BNB", value: 4 },
        { label: "BEP20-USTD", value: 5 },
      ],
      props: {
        placeholder: "请选择金额类型",
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "tx_time",
      label: "交易时间",
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "created_at",
      label: "添加时间",
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
  send_address: undefined,
  rece_address: undefined,
  tx_id: undefined,
  status: undefined,
  amount_type: undefined,
  tx_time: undefined,
  created_at: undefined,
});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

onMounted(() => {
  table.queryHandler();
});

// 获取状态标签
const getStatusLabel = (status: number) => {
  const statusMap: any = { 0: "处理中", 1: "完成", 2: "失败" };
  return statusMap[status] || "未知";
};

// 获取状态类型
const getStatusType = (status: number) => {
  const typeMap: any = { 0: "warning", 1: "success", 2: "danger" };
  return typeMap[status] || "";
};

// 获取金额类型标签
const getAmountTypeLabel = (type: number) => {
  const typeMap: any = {
    1: "TRC20-USTD",
    2: "TRX",
    3: "BEP10-USTD",
    4: "BNB",
    5: "BEP20-USTD",
  };
  return typeMap[type] || "未知";
};
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
