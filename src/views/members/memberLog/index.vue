<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header></template>

      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uid" label="用户ID" min-width="80" />
        <el-table-column prop="account" label="用户账号" min-width="120" />
        <el-table-column prop="log_type" label="日志类型" min-width="100">
          <template #default="{ row }">
            {{ log_types.find((t) => t.value === row.log_type)?.label }}
          </template>
        </el-table-column>
        <el-table-column prop="log_ip" label="IP地址" min-width="120" />
        <el-table-column prop="log_region" label="地区" min-width="120" />
        <el-table-column prop="device_type" label="设备类型" min-width="100">
          <template #default="{ row }">
            {{ device_types.find((t) => t.value === row.device_type)?.label }}
          </template>
        </el-table-column>
        <el-table-column prop="updated_at" label="更新时间" min-width="180" />
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/members/memberLog";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";
/** 日志类型选项 */
const log_types = [
  { value: 1, label: "登录" },
  { value: 2, label: "注册" },
];

/** 设备类型选项 */
const device_types = [
  { value: 1, label: "PC" },
  { value: 2, label: "WEB" },
  { value: 3, label: "安卓" },
  { value: 4, label: "苹果" },
];
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
        remoteMethod: async (query: string) => {
          loading.value = true;
          memberList.value = await searchMember({ account: query });
          loading.value = false;
        },
      },
    },
    {
      type: "select",
      modelKey: "log_type",
      label: "日志类型",
      options: log_types,
      props: {
        placeholder: "请输入用户ID",
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "log_ip",
      label: "IP地址",
      props: {
        placeholder: "请输入用户ID",
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "log_region",
      label: "地区",
      props: {
        placeholder: "请输入用户ID",
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "device_type",
      label: "设备类型",
      options: device_types,
      props: {
        placeholder: "请输入用户ID",
        style: { width: "200px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "datetime",
      label: "时间范围",
      props: {
        placeholder: "请输入用户ID",
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
  log_type: undefined,
  log_ip: undefined,
  log_region: undefined,
  device_type: undefined,
  datetime: [],
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
