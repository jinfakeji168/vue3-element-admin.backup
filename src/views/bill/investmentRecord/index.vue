<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="order_sn" label="订单号" min-width="180" />
        <el-table-column prop="uid" label="用户ID" min-width="200">
          <template #default="{ row }">{{ row.has_member?.id }} / {{ row.has_member?.account }}</template>
        </el-table-column>
        <el-table-column prop="has_invest_setting" label="产品名称" min-width="200">
          <template #default="{ row }">{{ row.has_invest_setting?.id }} / {{ row.has_invest_setting?.title }}</template>
        </el-table-column>

        <el-table-column prop="amount" label="投资金额(U)" min-width="120" />
        <el-table-column prop="invest_days" label="投资天数" min-width="100" />
        <el-table-column prop="days_rate" label="日利率" min-width="100">
          <template #default="{ row }">{{ row.has_invest_setting?.days_rate }}%</template>
        </el-table-column>
        <el-table-column prop="yield_type" label="收益类型" min-width="100">
          <template #default="{ row }">
            <el-tag>{{ row.yield_type === 1 ? "固定" : "浮动" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'warning'">
              {{ row.status === 1 ? "已兑换" : "未兑换" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expiration_time" label="到期时间" min-width="180" />
        <el-table-column prop="settlement_time" label="结算时间" min-width="180" />
        <el-table-column prop="total_profit" label="总收益" min-width="120" />
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetail(row)">详情</el-button>
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
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";
import Detail from "./components/Detail.vue";

const memberList = ref<any>([]);
const loading = ref(false);
const detailRef = ref();

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
      modelKey: "product_id",
      label: "产品ID",
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "order_sn",
      label: "订单号",
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "yield_type",
      label: "收益类型",
      options: [
        { label: "固定", value: 1 },
        { label: "浮动", value: 2 },
      ],
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: "状态",
      options: [
        { label: "已完成", value: 1 },
        { label: "处理中", value: 0 },
      ],
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "exp_datetime",
      label: "到期时间",
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "set_datetime",
      label: "结算时间",
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "cre_datetime",
      label: "创建时间",
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
