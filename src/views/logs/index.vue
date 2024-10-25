<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="keywords" label="关键字">
          <el-input
            v-model="queryParams.keywords"
            placeholder="日志内容"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="created_at" label="操作时间">
          <el-date-picker
            v-model="queryParams.created_at"
            :editable="false"
            class="!w-[240px]"
            type="daterange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="截止时间"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">
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

    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="pageData"
        highlight-current-row
        border
      >
        <el-table-column label="时间" prop="created_at" width="180" />
        <el-table-column label="用户ID" prop="user_id" width="120" />
        <el-table-column label="请求方式" prop="method" width="150" />
        <el-table-column label="API" prop="path" width="100" />
        <el-table-column label="数据" prop="payload" min-width="200" />
        <el-table-column label="IP 地址" prop="ip_address" width="150" />
        <el-table-column label="User Agent" prop="user_agent" width="150" />
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.per_page"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import LogAPI, { LogPageVO, LogPageQuery } from "@/api/system/log";

const queryFormRef = ref(ElForm);

const loading = ref(false);
const total = ref(0);

const queryParams = reactive<LogPageQuery>({
  page: 1,
  per_page: 10,
  keywords: "",
  created_at: ["", ""],
});

const pageData = ref<LogPageVO[]>();

function handleQuery() {
  loading.value = true;
  LogAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.page = 1;
  queryParams.created_at = undefined;
  handleQuery();
}

onMounted(() => {
  handleQuery();
});
</script>
