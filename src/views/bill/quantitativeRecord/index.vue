<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uid" label="用户ID" min-width="100" />
        <el-table-column prop="level" label="等级" min-width="80" />
        <el-table-column prop="income" label="收益" min-width="120">
          <template #default="{ row }">
            {{ row.income }}
          </template>
        </el-table-column>
        <el-table-column prop="fees" label="服务费" min-width="120">
          <template #default="{ row }">
            {{ row.fees }}
          </template>
        </el-table-column>
        <el-table-column prop="currency_id" label="币种" min-width="100" />
        <el-table-column label="交易价格" min-width="200">
          <template #default="{ row }">
            <div>买入：{{ row.buy_price }}</div>
            <div>卖出：{{ row.sel_price }}</div>
          </template>
        </el-table-column>
        <el-table-column label="交易平台" min-width="200">
          <template #default="{ row }">
            <div>{{ row.buy_platform }}</div>
            <div>{{ row.sel_platform }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="添加时间" min-width="180" />
        <el-table-column prop="settlement_time" label="完成时间" min-width="180" />
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/bill/quantitativeRecord";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";

const memberList = ref<any>([]);
const loading = ref(false);

/** 获取状态类型 */
const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return 'primary';
    case 1:
      return 'success';
    case 2:
      return 'danger';
    default:
      return 'info';
  }
};

/** 获取状态文本 */
const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '进行中';
    case 1:
      return '已完成';
    case 2:
      return '已取消';
    default:
      return '未知';
  }
};

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
          memberList.value = await searchMember(res);
          loading.value = false;
        },
      },
    },
    {
      type: "input-number",
      modelKey: "level",
      label: "等级",
      props: {
        placeholder: "请输入等级",
        style: { width: "200px" },
        min: 0,
      },
    },
    {
      type: "select",
      modelKey: "currency_id",
      label: "币种",
      options: [], // 需要从后端获取币种列表
      props: {
        placeholder: "请选择币种",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: "状态",
      options: [
        { label: '进行中', value: 0 },
        { label: '已完成', value: 1 },
        { label: '已取消', value: 2 },
      ],
      props: {
        placeholder: "请选择状态",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "add_datetime",
      label: "添加时间",
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "com_datetime",
      label: "完成时间",
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
  level: undefined,
  currency_id: undefined,
  status: undefined,
  add_datetime: [],
  com_datetime: [],
});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

onMounted(() => {
  table.queryHandler();
});
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
