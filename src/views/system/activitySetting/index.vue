<template>
  <div class="app-container">
    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['activitySetting:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['activitySetting:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu_0") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="sort" :label="$t('paiXu')" width="60" />
        <el-table-column prop="type" :label="$t('leiXing_0')" min-width="100">
          <template #default="{ row }">
            {{ row.type == 1 ? $t("yeMian") : row.type == 2 ? $t("ziDingYiNeiRong") : $t("weiZhi") }}
          </template>
        </el-table-column>
        <el-table-column prop="jump_page" :label="$t('tiaoZhuanYeMian')">
          <template #default="{ row }">
            {{ activityList.find((i) => i.key == row.jump_page)?.val || "--" }}
          </template>
        </el-table-column>
        <el-table-column prop="bg_icon" :label="$t('beiJingTuPian')" min-width="120">
          <template #default="{ row }">
            <el-image :src="row.bg_icon" class="icon" fit="contain" :preview-src-list="[row.bg_icon]" preview-teleported :z-index="9999" />
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('zhuangTai')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status == StatusEnum.False ? 'success' : 'danger'">{{ row.status == StatusEnum.False ? $t("kaiQi") : $t("guanBi") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title_original" :label="$t('biaoTiYuanWen')" min-width="220" />
        <el-table-column prop="subtitle_original" :label="$t('fuBiaoTiYuanWen')" min-width="220" />
        <el-table-column prop="created_at" :label="$t('tianJiaShiJian')" width="160" />

        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['activitySetting:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              {{ $t("bianJi") }}
            </el-button>
            <el-button v-hasPerm="['activitySetting:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              {{ $t("shanChu_0") }}
            </el-button>
            <el-button v-hasPerm="['activitySetting:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
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
import api, { type Form, Query, Activity } from "@/api/system/activitySetting";
import { StatusEnum } from "@/enums/MenuTypeEnum";

import TableInstance from "@/utils/tableInstance";

const queryFormRef = ref(ElForm);

const queryParams = reactive<Query>({});
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

const activityList = ref<Activity[]>([]);
async function getActivityList() {
  const res = await api.getJumpPageList();
  activityList.value = res;
}
getActivityList();
provide("activityList", activityList);
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
