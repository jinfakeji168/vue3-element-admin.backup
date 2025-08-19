<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="80" />
        <el-table-column prop="uid" label="UID" min-width="80" />
        <el-table-column :align="$t('uidZhangHao')" min-width="120">
          <template #default="{ row }">
            <span>{{ row.member?.account }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_sn" :align="$t('dingDanHao_0')" min-width="160" />
        <el-table-column prop="recharge_amount" :align="$t('chongZhiJineu')" min-width="120" />
        <el-table-column prop="channel" :align="$t('quDao')" min-width="100" />
        <el-table-column prop="status" :align="$t('zhuangTai')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : row.status === 2 ? 'danger' : 'warning'">
              {{ row.status === 1 ? $t("yiZhiFu") : row.status === 2 ? $t("zhiFuShiBai") : $t("weiZhiFu") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" :align="$t('shenQingShiJian')" min-width="180" />
        <el-table-column prop="order_result" :align="$t('xiaDanJieGuo')" min-width="100" />
        <el-table-column prop="recharge_order_id" :align="$t('chongZhiDingDanId')" min-width="140" />
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/bill/payOrder";

import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";

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
      type: "input",
      modelKey: "channel",
      label: $t("quDao_0"),
      options: [],
      props: {
        placeholder: $t("qingShuRuQuDao"),
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: $t("zhuangTai"),
      options: [
        { label: $t("weiZhiFu"), value: 0 },
        { label: $t("yiZhiFu"), value: 1 },
        { label: $t("zhiFuShiBai"), value: 2 },
      ],
      props: {
        placeholder: $t("qingXuanZeZhuangTai"),
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "datetime",
      label: $t("shenQingShiJian_0"),
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
  channel: undefined,
  status: undefined,
  datetime: [],
});

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
