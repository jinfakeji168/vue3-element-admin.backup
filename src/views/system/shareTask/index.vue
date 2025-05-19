<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="奖励类型" prop="type">
          <el-select v-model="queryParams.type" clearable class="!w-[140px]">
            <el-option :value="1" label="佣金账户" />
            <el-option :value="2" label="奖励VIP" />
            <el-option :value="3" label="基础账户" />
          </el-select>
        </el-form-item>
        <el-form-item label="奖励次数(类型)" prop="reward_type">
          <el-select v-model="queryParams.reward_type" clearable class="!w-[140px]">
            <el-option :value="1" label="总共一次" />
            <el-option :value="2" label="每日一次" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" clearable class="!w-[100px]">
            <el-option :value="StatusEnum.False" label="正常" />
            <el-option :value="StatusEnum.True" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="table.queryHandler()">
            <template #icon>
              <Search />
            </template>
            搜索
          </el-button>
          <el-button @click="table.handleResetQuery()">
            <template #icon>
              <Refresh />
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['shareTask:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button v-hasPerm="['shareTask:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="icon" label="分享任务图片" min-width="100">
          <template #default="{ row }">
            <el-image :src="row.icon" class="icon" fit="contain" :preview-src-list="[row.icon]" preview-teleported :z-index="9999" />
          </template>
        </el-table-column>

        <el-table-column prop="type" label="奖励类型" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.type == 1" type="info">账户佣金</el-tag>
            <el-tag v-else-if="row.type == 2" type="info">奖励VIP</el-tag>
            <el-tag v-else type="info">基础账户</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reward_type" label="奖励次数(类型)" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.reward_type == 1" type="info">总共一次</el-tag>
            <el-tag v-else-if="row.reward_type == 2" type="info">每日一次</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="share_amount" label="佣金金额" min-width="120" />

        <el-table-column prop="reward_vip_level" label="奖励VIP等级" min-width="120" />
        <el-table-column prop="reward_vip_days" label="奖励VIP天数" min-width="120" />

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" />

        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['shareTask:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              编辑
            </el-button>
            <el-button v-hasPerm="['shareTask:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              删除
            </el-button>
            <el-button v-hasPerm="['shareTask:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
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

    <editPart v-model="table.visible.value[0]" :data="table.currentData.value" @finally="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import editPart from "./components/edit.vue";
import api, { type Form, Query } from "@/api/system/shareTask";
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
