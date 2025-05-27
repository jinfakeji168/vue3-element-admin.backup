<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button type="primary" @click="table.editHandler()" v-hasPerm="['rankListSetting:add']">
          <template #icon><Plus /></template>
          新增
        </el-button>
        <el-button type="danger" :disabled="!table.selectList.value.length" @click="table.deleteHandler()" v-hasPerm="['rankListSetting:delete']">
          <template #icon><Delete /></template>
          批量删除
        </el-button>
      </template>

      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="user_name" label="用户名" min-width="120" />
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="income" label="收入" min-width="120" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'success' : row.type === 2 ? 'warning' : 'info'">
              {{ type_options.find(t => t.value === row.type)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ranking" label="排名" width="80" />
        <el-table-column prop="created_at" label="添加时间" min-width="180" />
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="{ row }"  v-hasPerm="['rankListSetting:edit']">
            <el-button type="primary" link @click="table.editHandler(row)">
              <template #icon><EditPen /></template>
              编辑
            </el-button>
            <el-button type="danger" link @click="table.deleteHandler(row.id)"  v-hasPerm="['rankListSetting:delete']">
              <template #icon><Delete /></template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>

    <edit v-model="table.visible.value[0]" :data="table.currentData.value" @finish="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/members/rankListSetting";
import TableInstance from "@/utils/tableInstance";
import edit from './components/edit.vue';
/** 类型选项 */
const type_options = [
  { value: 1, label: "周榜" },
  { value: 2, label: "月榜" },
  { value: 3, label: "年榜" }
];

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "100px",
  formItem: [
    {
      type: "input",
      modelKey: "user_name",
      label: "用户名",
      props: {
        placeholder: "请输入用户名",
        clearable: true,
        style: { width: "200px" }
      }
    },
    {
      type: "select", 
      modelKey: "type",
      label: "榜单类型",
      options: type_options,
      props: {
        placeholder: "请选择类型",
        clearable: true,
        style: { width: "200px" }
      }
    },
    {
      type: "inputnumber",
      modelKey: "ranking",
      label: "排名",
      props: {
        placeholder: "请输入排名",
        clearable: true,
        style: { width: "200px" },
        min: 1
      }
    }
  ]
};

/** 查询表单引用 */
const queryFormRef = ref();

/** 查询参数 */
const queryParams = reactive<Query>({
  user_name: undefined,
  type: undefined,
  ranking: undefined
});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

onMounted(() => {
  table.queryHandler();
});
</script>
