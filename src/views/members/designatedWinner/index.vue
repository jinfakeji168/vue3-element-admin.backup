<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button type="success" @click="table.editHandler()" v-hasPerm="['designatedWinner:add']">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button type="danger" :disabled="!table.selectList.value.length" @click="table.deleteHandler()" v-hasPerm="['designatedWinner:delete']">
          <template #icon>
            <Delete />
          </template>
          {{ $t("piLiangShanChu") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uid" :label="$t('yongHuId')" min-width="80" />
        <el-table-column prop="member.account" :label="$t('huiYuanZhangHao')" min-width="120" />
        <el-table-column :label="$t('leiXing_0')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'success' : row.type === 2 ? 'warning' : 'info'">
              {{ type_options.find((t) => t.value === row.type)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bonus" :label="$t('jiangXiang')" min-width="100" />
        <el-table-column :label="$t('zhuangTai')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.state === 1 ? 'warning' : 'success'">
              {{ state_options.find((t) => t.value === row.state)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" :label="$t('tianJiaShiJian')" min-width="180" />
        <el-table-column :label="$t('caoZuo')" min-width="100">
          <template #default="{ row }">
            <el-button type="danger" link size="small" @click="table.deleteHandler(row.id)" v-hasPerm="['designatedWinner:delete']">
              <template #icon>
                <Delete />
              </template>
              {{ $t("shanChu_0") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
    <edit v-model="table.visible.value[0]" @finish="table.handleResetQuery()" />
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/members/designatedWinner";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";
import edit from "./components/edit.vue";
/** 抽奖状态选项 */
const state_options = [
  { value: 1, label: $t("weiChouJiang") },
  { value: 2, label: $t("yiChouJiang") },
];

/** 类型选项 */
const type_options = [
  { value: 1, label: $t("chongZhiZengSong") },
  { value: 2, label: $t("zhuCeZengSong") },
  { value: 3, label: $t("yaoQingZengSong") },
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
      label: $t("yongHu"),
      options: memberList,
      props: {
        placeholder: $t("qingShuRuYongHuJin"),
        style: { width: "200px" },
        filterable: true,
        remote: true,
        clearable: true,
        loading: loading,
        remoteMethod: async (res: string) => {
          loading.value = true;
          memberList.value = await searchMember({ account: res });
          loading.value = false;
        },
      },
    },
    {
      type: "select",
      modelKey: "state",
      label: $t("chouJiangZhuangTai"),
      options: state_options,
      props: {
        placeholder: $t("qingXuanZeChouJiang"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "type",
      label: $t("leiXing_0"),
      options: type_options,
      props: {
        placeholder: $t("qingXuanZeLeiXing"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "datetime",
      label: $t("shiJianFanWei"),
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
  state: undefined,
  type: undefined,
  datetime: [],
});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

onMounted(() => {
  table.queryHandler();
});
</script>
