<template>
  <div class="app-container">
    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['carouselSetting:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['carouselSetting:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu_0") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="sort" :label="$t('paiXu')" min-width="60" />
        <el-table-column prop="title" :label="$t('mingCheng')" />
        <el-table-column :label="$t('tuPian')">
          <template #default="{ row }">
            <el-image style="height: 40px" :src="row.img_url" fit="contain" :preview-src-list="[row.img_url]" preview-teleported :z-index="9999" />
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('zhuangTai')">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">{{ $t("zhengChang") }}</el-tag>
            <el-tag v-else type="info">{{ $t("jinYong") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" :label="$t('xinZengShiJian')" width="200"></el-table-column>

        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['carouselSetting:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              {{ $t("bianJi") }}
            </el-button>
            <el-button v-hasPerm="['carouselSetting:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              {{ $t("shanChu_0") }}
            </el-button>
            <el-button v-hasPerm="['carouselSetting:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
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
import api, { type Form, Query } from "@/api/system/carouselSetting";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";

const queryFormRef = ref(ElForm);

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
