<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button type="primary" @click="table.editHandler()" v-hasPerm="['rankListSetting:add']">
          <template #icon><Plus /></template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button type="danger" :disabled="!table.selectList.value.length" @click="table.deleteHandler()" v-hasPerm="['rankListSetting:delete']">
          <template #icon><Delete /></template>
          {{ $t("piLiangShanChu") }}
        </el-button>
      </template>

      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="user_name" :label="$t('login.username')" min-width="120" />
        <el-table-column prop="avatar" :label="$t('touXiang')" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="income" :label="$t('shouRu')" min-width="120" />
        <el-table-column prop="type" :label="$t('leiXing_0')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'success' : row.type === 2 ? 'warning' : 'info'">
              {{ type_options.find((t) => t.value === row.type)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ranking" :label="$t('paiMing')" width="80" />
        <el-table-column prop="created_at" :label="$t('tianJiaShiJian')" min-width="180" />
        <el-table-column :label="$t('caoZuo')" fixed="right" width="150">
          <template #default="{ row }" v-hasPerm="['rankListSetting:edit']">
            <el-button type="primary" link @click="table.editHandler(row)">
              <template #icon><EditPen /></template>
              {{ $t("bianJi") }}
            </el-button>
            <el-button type="danger" link @click="table.deleteHandler(row.id)" v-hasPerm="['rankListSetting:delete']">
              <template #icon><Delete /></template>
              {{ $t("shanChu_0") }}
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
import edit from "./components/edit.vue";
/** 类型选项 */
const type_options = [
  { value: 1, label: $t("zhouBang") },
  { value: 2, label: $t("yueBang") },
  { value: 3, label: $t("nianBang") },
];

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "100px",
  formItem: [
    {
      type: "input",
      modelKey: "user_name",
      label: $t("login.username"),
      props: {
        placeholder: $t("login.message.username.required"),
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "type",
      label: $t("bangDanLeiXing"),
      options: type_options,
      props: {
        placeholder: $t("qingXuanZeLeiXing"),
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "inputnumber",
      modelKey: "ranking",
      label: $t("paiMing"),
      props: {
        placeholder: $t("qingShuRuPaiMing_0"),
        clearable: true,
        style: { width: "200px" },
        min: 1,
      },
    },
  ],
};

/** 查询表单引用 */
const queryFormRef = ref();

/** 查询参数 */
const queryParams = reactive<Query>({
  user_name: undefined,
  type: undefined,
  ranking: undefined,
});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

onMounted(() => {
  table.queryHandler();
});
</script>
