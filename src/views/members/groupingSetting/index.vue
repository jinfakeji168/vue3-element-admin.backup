<template>
  <div class="app-container">
    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button type="success" @click="table.editHandler()" v-hasPerm="['groupingSetting:add']">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()"  v-hasPerm="['groupingSetting:delete']">
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </template>

      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="标题" min-width="120" />
        <el-table-column prop="created_at" label="添加时间" min-width="180" />
        <el-table-column prop="updated_at" label="更新时间" min-width="180" />
        <el-table-column label="操作" fixed="right" align="left" width="150">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click.stop="table.editHandler(row, 0)"  v-hasPerm="['groupingSetting:edit']">
              <template #icon><EditPen /></template>
              编辑
            </el-button>
            <el-button type="danger" link size="small" @click.stop="table.deleteHandler(row.id)"  v-hasPerm="['groupingSetting:delete']">
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

    <editPart v-model="table.visible.value[0]" :data="table.currentData.value" @finish="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import editPart from "./components/edit.vue";
import api, { type Form, Query } from "@/api/members/groupingSetting";
import TableInstance from "@/utils/tableInstance";

/** 查询表单引用 */
const queryFormRef = ref(ElForm);

/** 查询参数 */
const queryParams = reactive<Query>({});

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
