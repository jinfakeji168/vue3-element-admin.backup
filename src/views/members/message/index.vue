<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['message:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['message:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu_0") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uid" label="ID" width="80" />
        <el-table-column prop="member.account" :label="$t('yongHuXinXi')" min-width="120" />
        <el-table-column prop="operator_name" :label="$t('faSongRen')" min-width="100" />
        <el-table-column prop="title_original" :label="$t('biaoTiXinXi')" min-width="150" />
        <el-table-column prop="type" :label="$t('leiXing_0')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'info' : row.type === 2 ? 'success' : 'warning'">
              {{ message_types.find((t) => t.value === row.type)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="send_time" :label="$t('faSongShiJian')" min-width="160" />
        <el-table-column prop="is_read" :label="$t('shiFouYiDu')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_read === 1 ? 'success' : 'info'">
              {{ row.is_read === 1 ? "已读" : "未读" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updated_at" :label="$t('yiDuShiJian')" min-width="160" />
        <el-table-column prop="is_window" :label="$t('shiFouDanChuang')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_window === 1 ? 'success' : 'info'">
              {{ row.is_window === 1 ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="180">
          <template #default="{ row }">
            <el-button v-hasPerm="['message:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
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

    <editPart v-model="table.visible.value[0]" :data="table.currentData.value" @finish="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import editPart from "./components/edit.vue";
import api, { type TableItem, Query } from "@/api/members/message";
import TableInstance from "@/utils/tableInstance";
import { searchMember } from "@/utils";
/** 消息类型选项 */
const message_types = [
  { value: 1, label: $t("ziDingYi") },
  { value: 2, label: $t("chongZhiDaoZhang") },
  { value: 3, label: $t("tiXianDaoZhang") },
];

/** 阅读状态选项 */
const read_status = [
  { value: 1, label: $t("yiDu") },
  { value: 2, label: $t("weiDu") },
];
const memberList = ref<any>([]);
const loading = ref(false);

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "120px",
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
        remoteMethod: async (query: string) => {
          loading.value = true;
          memberList.value = await searchMember({ account: query });
          loading.value = false;
        },
      },
    },
    {
      type: "input",
      modelKey: "operator_name",
      label: $t("faSongRen_0"),
      props: {
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "type",
      label: $t("xiaoXiLeiXing"),
      options: message_types,
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "is_read",
      label: $t("yueDuZhuangTai"),
      options: read_status,
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "daterange",
      modelKey: "send_time",
      label: $t("faSongShiJian_0"),
      props: {
        type: "datetimerange",
        valueFormat: $t("yyyyMmDdHhMmSs"),
        startPlaceholder: $t("kaiShiShiJian_2"),
        endPlaceholder: $t("jieShuShiJian_2"),
      },
    },
  ],
};

const queryFormRef = ref();
const queryParams = reactive<Query>({});
const table = new TableInstance<TableItem>(api, queryParams, 20, queryFormRef);

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
