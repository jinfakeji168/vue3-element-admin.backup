<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uid" label="用户ID" min-width="80" />
        <el-table-column prop="member.account" label="会员账号" min-width="120" />
        <el-table-column prop="old_level" label="原始等级" min-width="100" />
        <el-table-column prop="new_level" label="升级后等级" min-width="100" />
        <el-table-column prop="amount_spent" label="花费金额" min-width="120" />
        <el-table-column prop="member_expiration_time" label="会员到期时间" min-width="180" />
        <el-table-column prop="contract_expiration_time" label="合约到期时间" min-width="180" />
        <el-table-column prop="contract_status" label="合约状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.contract_status === 1 ? 'success' : 'info'">
              {{ contract_status_types.find((t) => t.value === row.contract_status)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="添加时间" min-width="180" />
        <el-table-column prop="updated_at" label="更新时间" min-width="180" />
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/members/upgradeRecord";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";

/** 合约状态选项 */
const contract_status_types = [
  { value: 1, label: "已返还" },
  { value: 2, label: "未返还" },
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
        remoteMethod: async (res: string) => {
          loading.value = true;
          memberList.value = await searchMember(res);
          loading.value = false;
        },
      },
    },
    {
      type: "select",
      modelKey: "contract_status",
      label: "合约状态",
      options: contract_status_types,
      props: {
        placeholder: "请选择合约状态",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "datetime",
      label: "时间范围",
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
  contract_status: undefined as any,
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
