<template>
  <div class="app-container">
    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['quantitativeStrategist:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button v-hasPerm="['quantitativeStrategist:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="sort" label="排序" width="60" />
        <el-table-column prop="type" label="类型" min-width="100">
          <template #default="{ row }">
            {{ row.type == 1 ? "页面" : row.type == 2 ? "自定义内容" : "未知" }}
          </template>
        </el-table-column>
        <el-table-column prop="jump_page" label="跳转页面" />
        <el-table-column prop="bg_icon" label="背景图片" min-width="120">
          <template #default="{ row }">
            <el-image :src="row.bg_icon" class="icon" fit="contain" :preview-src-list="[row.bg_icon]" preview-teleported :z-index="9999" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status == StatusEnum.False ? 'success' : 'danger'">{{ row.status == StatusEnum.False ? "开启" : "关闭" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title_original" label="标题原文" min-width="220" />
        <el-table-column prop="subtitle_original" label="副标题原文" min-width="220" />
        <el-table-column prop="created_at" label="添加时间" width="160" />

        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['quantitativeStrategist:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              编辑
            </el-button>
            <el-button v-hasPerm="['quantitativeStrategist:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              删除
            </el-button>
            <el-button v-hasPerm="['helpCenter:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
              <template #icon><Switch /></template>
              {{ row.status == StatusEnum.False ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-pagination background :total="table.pageTotal.value" :page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>

    <editPart v-model="table.visible.value[0]" :data="table.currentData.value" @finish="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import editPart from "./components/edit.vue";
import api, { type Form, Query } from "@/api/system/activitySetting";
import { StatusEnum } from "@/enums/MenuTypeEnum";

import TableInstance from "@/utils/tableInstance";

const queryFormRef = ref(ElForm);

const queryParams = reactive<Query>({});
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
