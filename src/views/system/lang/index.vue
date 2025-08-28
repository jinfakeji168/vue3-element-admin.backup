<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['currency:add']" type="success" @click="table.editHandler()" :disabled="!enabled">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['currency:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked() || !enabled">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu_0") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="ID" min-width="100" />
        <el-table-column prop="display_name" :label="$t('qianDuanXianShiMing')" min-width="200" />
        <el-table-column prop="name" :label="$t('mingCheng')" min-width="200" />
        <el-table-column prop="mark" :label="$t('biaoShi')" min-width="200" />
        <el-table-column prop="status" :label="$t('zhuangTai')" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status == 1" type="success">{{ $t("zhengChang") }}</el-tag>
            <el-tag v-else type="info">{{ $t("jinYong") }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sort" :label="$t('paiXu')" width="100" />

        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="100" v-if="enabled">
          <template #default="{ row }">
            <el-button v-hasPerm="['lang:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              {{ $t("bianJi") }}
            </el-button>
            <el-button v-hasPerm="['lang:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
              <template #icon><Switch /></template>
              {{ row.status == StatusEnum.False ? "禁用" : "启用" }}
            </el-button>
            <el-button v-hasPerm="['currency:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
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

defineOptions({
  name: $t("dept"),
  inheritAttrs: false,
});

import api, { type Form, Query } from "@/api/system/lang";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";

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
      type: "input",
      modelKey: "name",
      label: $t("mingCheng"),
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: $t("zhuangTai"),
      options: status_types,
      props: {
        clearable: true,
        style: { width: "140px" },
      },
    },
  ],
};

const queryFormRef = ref();
const queryParams = reactive<Query>({});

const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

const enabled: Ref<boolean> = ref(true);
onMounted(() => {
  table.queryHandler();
  let count = 0;
  ElMessageBox.confirm("警告，此页面为开发人员开发使用，请谨慎操作！", {
    cancelButtonText: "仅查看",
    confirmButtonText: "开发人员",
    beforeClose(action, instance, done) {
      if (action === "confirm") count++;
      else {
        done();
        enabled.value = false;
      }
      if (count > 5) {
        done();
        enabled.value = true;
      }
    },
  });
});
</script>
