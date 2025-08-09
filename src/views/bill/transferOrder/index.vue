<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="100" />
        <el-table-column prop="order_sn" :label="$t('dingDanHao_0')" min-width="120" />
        <el-table-column :label="$t('uidYongHuZhangHao')" min-width="120">
          <template #default="{ row }">
            <span>{{ $t("rowHasMemberId_0", [row.has_member?.id]) }}</span>
            <span>{{ row.has_member?.account }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('zhuanZhangJineu')" min-width="120">
          <template #default="{ row }">
            {{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="fees" :label="$t('shouXuFei')" min-width="100">
          <template #default="{ row }">
            {{ row.fees }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('zhuangTai')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'warning'">
              {{ row.status === 1 ? $t("yiJieSuan") : $t("weiJieSuan") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" :label="$t('beiZhu')" min-width="120" />
        <el-table-column prop="created_at" :label="$t('tianJiaShiJian')" min-width="180" />
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/bill/transferOrder";
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
      modelKey: "order_sn",
      label: $t("dingDanHao_0"),
      props: {
        placeholder: $t("qingShuRuDingDanHao"),
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
  order_sn: undefined,
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
