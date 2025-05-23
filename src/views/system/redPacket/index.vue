<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="类型" prop="type">
          <el-select v-model="queryParams.type" clearable class="!w-[100px]">
            <el-option :value="1" label="拼手气红包" />
            <el-option :value="2" label="普通红包" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="state">
          <el-select v-model="queryParams.state" clearable class="!w-[100px]">
            <el-option :value="1" label="未开始" />
            <el-option :value="2" label="进行中" />
            <el-option :value="3" label="已结束" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间范围" prop="start_time">
          <el-date-picker v-model="queryParams.start_time" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="结束时间范围" prop="end_time">
          <el-date-picker v-model="queryParams.end_time" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="添加时间范围" prop="created_at">
          <el-date-picker v-model="queryParams.created_at" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
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
        <el-button v-hasPerm="['redPacket:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button v-hasPerm="['redPacket:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event, 'id')">
        <el-table-column type="selection" width="55" />

        <el-table-column prop="type" label="类型" min-width="140">
          <template #default="{ row }">
            <el-tag v-if="row.type == 1" type="info">拼手气红包</el-tag>
            <el-tag v-else-if="row.type == 2" type="info">普通红包</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.state == 1" type="info">未开始</el-tag>
            <el-tag v-else-if="row.state == 2" type="success">进行中</el-tag>
            <el-tag v-else type="warning">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="red_link" label="红包链接" min-width="120" />

        <el-table-column prop="red_num" label="红包个数" min-width="120" />
        <el-table-column prop="red_amount" label="红包金额" min-width="120" />
        <el-table-column prop="max_win_amount" label="最大中奖金额" min-width="120" />
        <el-table-column prop="receive_num" label="已领取个数" min-width="120" />
        <el-table-column prop="receive_amount" label="已领取金额" min-width="120" />
        <el-table-column prop="start_time" label="开始时间" min-width="120">
          <template #default="{ row }">
            {{ parseTime(row.start_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间" min-width="120">
          <template #default="{ row }">
            {{ parseTime(row.end_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" min-width="120" />
        <el-table-column prop="updated_at" label="更新时间" min-width="120" />

        <el-table-column prop="sort" label="排序" width="100" />

        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['redPacket:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon>
                <Edit />
              </template>
              编辑
            </el-button>
            <el-button v-hasPerm="['redPacket:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
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
import api, { type Form, Query } from "@/api/system/redPacket";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { dayjs } from "element-plus";
import TableInstance from "@/utils/tableInstance";

const queryFormRef = ref(ElForm);
const queryParams = reactive<Query>({});

const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

function parseTime(timeStamp: number) {
  return dayjs.unix(timeStamp).format("YYYY-MM-DD HH:mm:ss");
}

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
