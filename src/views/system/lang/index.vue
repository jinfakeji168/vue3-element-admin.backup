<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="queryParams.name"
            
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            clearable
            class="!w-[100px]"
          >
            <el-option :value="StatusEnum.False" label="正常" />
            <el-option :value="StatusEnum.True" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="handleQuery">
            <template #icon>
              <Search />
            </template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon>
              <Refresh />
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-wrapper">
      <el-table v-loading="loading" :data="list" row-key="id">
        <el-table-column prop="id" label="ID" min-width="100" />
        <el-table-column prop="name" label="名称" min-width="200" />
        <el-table-column prop="mark" label="标识" min-width="200" />
        <el-table-column prop="display_name" label="前端显示名称" min-width="200"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sort" label="排序" width="100" />

        <el-table-column label="操作" fixed="right" align="left" width="100">
          <template #default="scope">
            <el-button
              v-hasPerm="['lang:status']"
              :type="
                scope.row.status == StatusEnum.False ? 'danger' : 'success'
              "
              link
              size="small"
              @click.stop="changeStatus(scope.row)"
            >
              {{ scope.row.status == StatusEnum.False ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dept",
  inheritAttrs: false,
});

import api, {type Form,Query } from "@/api/system/lang";
import { StatusEnum } from "@/enums/MenuTypeEnum";

const queryFormRef = ref(ElForm);
const loading = ref(false);
const queryParams = reactive<Query>({
  page:1,
  limit:20
});
const list = ref<Form[]>();


/** 查询部门 */
async function handleQuery() {
  loading.value = true;
  const temp=await api.getList(queryParams);
  list.value = temp.list;
  loading.value = false;
  
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}


async function changeStatus(item: Form) {
  await api.changeStatus(item.id, item.status == StatusEnum.True ? StatusEnum.False : StatusEnum.True);
  handleQuery();
}

onMounted(() => {
  handleQuery();
});
</script>
