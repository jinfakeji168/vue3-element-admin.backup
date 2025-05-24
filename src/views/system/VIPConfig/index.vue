<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['currency:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button v-hasPerm="['currency:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="会员名称" min-width="120" />
        <el-table-column prop="icon" label="图片" min-width="100">
          <template #default="{ row }">
            <el-image :src="row.icon" class="icon" fit="contain" :preview-src-list="[row.icon]" preview-teleported :z-index="9999" />
          </template>
        </el-table-column>
        <el-table-column prop="level" label="会员等级" min-width="80" />
        <el-table-column prop="min_rate_of_return" label="收益率范围" min-width="120">
          <template #default="{ row }">{{ row.min_rate_of_return }}%- {{ row.max_rate_of_return }}%</template>
        </el-table-column>
        <el-table-column prop="quant_num" label="量化次数" min-width="80" />
        <el-table-column prop="min_unlock_amount" label="解锁金额" min-width="120" />
        <el-table-column prop="quant_effect_days" label="量化天数" min-width="100" />
        <el-table-column prop="service_fee_ratio" label="平台服务费" min-width="120">
          <template #default="{ row }">{{ row.service_fee_ratio }}%</template>
        </el-table-column>

        <!-- <el-table-column prop="unlock_invitation_num" label="解锁邀请人数" min-width="100" />
        <el-table-column prop="invited_comp_level" label="邀请计算层级" min-width="100" />
        <el-table-column prop="invited_num_effect_recharge" label="邀请人数有效充值" min-width="120" />
        <el-table-column prop="show_service_fee" label="是否显示服务费" min-width="100">
          <template #default="{ row }">
            {{ row.show_service_fee == 1 ? "是" : "否" }}
          </template>
        </el-table-column> -->

        <el-table-column prop="recharge_rebate_ratio" label="充值返利%" min-width="100" />
        <el-table-column prop="quant_rebate_ratio" label="量化返利%" min-width="100" />
        <el-table-column prop="recharge_yield_ratio" label="复充收益率/封顶" min-width="100">
          <template #default="{ row }">{{ row.recharge_yield_ratio }}% / {{ row.recharge_cap }}</template>
        </el-table-column>
        <el-table-column prop="is_unlock_purchase" label="是否可解锁购买" min-width="120">
          <template #default="{ row }">
            <el-tag v-if="row.is_unlock_purchase == StatusEnum.False" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['currency:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              编辑
            </el-button>
            <el-button v-hasPerm="['currency:editExplain']" type="primary" link size="small" @click.stop="table.editHandler(row, 1)">
              <template #icon><EditPen /></template>
              充值说明
            </el-button>
            <el-button v-hasPerm="['currency:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              删除
            </el-button>
            <el-button v-hasPerm="['currency:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
              <template #icon><Switch /></template>
              {{ row.status == StatusEnum.False ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>

    <editPart v-model="table.visible.value[0]" :data="table.currentData.value" @finish="table.queryHandler()" />
    <explain v-model="table.visible.value[1]" :data="table.currentData.value" @finish="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import editPart from "./components/edit.vue";
import explain from "./components/explain.vue";
import api, { type Form, Query } from "@/api/system/VipConfig";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";

/** 状态选项 */
const status_types = [
  { value: StatusEnum.False, label: "正常" },
  { value: StatusEnum.True, label: "禁用" },
];

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "120px",
  formItem: [
    {
      type: "input",
      modelKey: "title",
      label: "会员名称",
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "level",
      label: "会员等级",
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: "状态",
      options: status_types,
      props: {
        clearable: true,
        style: { width: "140px" },
      },
    },
    {
      type: "select",
      modelKey: "is_unlock_purchase",
      label: "是否可解锁",
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

onMounted(() => {
  table.queryHandler();
});
</script>

<style scoped lang="scss">
.icon {
  height: 40px;
  object-fit: contain;
}
</style>
