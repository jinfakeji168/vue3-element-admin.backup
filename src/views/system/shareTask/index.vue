<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['shareTask:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['shareTask:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu_0") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="icon" :label="$t('fenXiangRenWuTuPian')" min-width="100">
          <template #default="{ row }">
            <el-image :src="row.icon" class="icon" fit="contain" :preview-src-list="[row.icon]" preview-teleported :z-index="9999" />
          </template>
        </el-table-column>

        <el-table-column prop="type" :label="$t('jiangLiLeiXing')" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.type == 1" type="info">{{ $t("zhangHuYongJin") }}</el-tag>
            <el-tag v-else-if="row.type == 2" type="info">{{ $t("jiangLiVip") }}</el-tag>
            <el-tag v-else type="info">{{ $t("jiChuZhangHu") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reward_type" :label="$t('jiangLiCiShuLeiXing')" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.reward_type == 1" type="info">{{ $t("zongGongYiCi") }}</el-tag>
            <el-tag v-else-if="row.reward_type == 2" type="info">{{ $t("meiRiYiCi") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="share_amount" :label="$t('yongJinJinE')" min-width="120" />

        <el-table-column prop="reward_vip_level" :label="$t('jiangLiVipDengJi')" min-width="120" />
        <el-table-column prop="reward_vip_days" :label="$t('jiangLiVipTianShu')" min-width="120" />

        <el-table-column prop="status" :label="$t('zhuangTai')" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">{{ $t("zhengChang") }}</el-tag>
            <el-tag v-else type="info">{{ $t("jinYong") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" :label="$t('paiXu')" width="100" />

        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['shareTask:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              {{ $t("bianJi") }}
            </el-button>
            <el-button v-hasPerm="['shareTask:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              {{ $t("shanChu_0") }}
            </el-button>
            <el-button v-hasPerm="['shareTask:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
              <template #icon><Switch /></template>
              {{ row.status == StatusEnum.False ? $t("jinYong") : $t("qiYong") }}
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
import api, { type Form, Query } from "@/api/system/shareTask";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";

/** 奖励类型选项 */
const reward_types = [
  { value: 1, label: $t("yongJinZhangHu_1") },
  { value: 2, label: $t("jiangLiVip") },
  { value: 3, label: $t("jiChuZhangHu") },
];

/** 奖励次数类型选项 */
const reward_count_types = [
  { value: 1, label: $t("zongGongYiCi") },
  { value: 2, label: $t("meiRiYiCi") },
];

/** 状态选项 */
const status_types = [
  { value: StatusEnum.False, label: $t("zhengChang") },
  { value: StatusEnum.True, label: $t("jinYong") },
];

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "120px",
  formItem: [
    {
      type: "select",
      modelKey: "type",
      label: $t("jiangLiLeiXing"),
      options: reward_types,
      props: {
        clearable: true,
        style: { width: "140px" },
      },
    },
    {
      type: "select",
      modelKey: "reward_type",
      label: $t("jiangLiCiShuLeiXing"),
      options: reward_count_types,
      props: {
        clearable: true,
        style: { width: "140px" },
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: $t("zhuangTai"),
      options: status_types,
      props: {
        clearable: true,
        style: { width: "100px" },
      },
    },
  ],
};

const queryFormRef = ref();
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
