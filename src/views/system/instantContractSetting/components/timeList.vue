<template>
  <el-dialog v-model="visible" :title="title" width="70vw">
    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['instantContractSetting:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button v-hasPerm="['instantContractSetting:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <!-- <el-table-column prop="id" label="ID" min-width="80" /> -->
        <el-table-column prop="second" label="时间秒" min-width="100" />
        <el-table-column prop="min_amount" label="最小投资金额" min-width="120" />
        <el-table-column prop="profit_rate" label="盈利率%" min-width="100" />
        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['instantContractSetting:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              编辑
            </el-button>
            <el-button v-hasPerm="['instantContractSetting:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </el-dialog>
  <el-dialog v-model="table.visible.value[0]" :title="dialogTitle" width="50vw">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="200px">
      <el-form-item label="时间秒" prop="second">
        <el-input v-model="formData.second" placeholder="请输入时间秒" />
      </el-form-item>
      <el-form-item label="最小投资金额" prop="min_amount">
        <el-input v-model="formData.min_amount" placeholder="请输入最小投资金额" :formatter="parserHandler" :parser="parserHandler" />
      </el-form-item>
      <el-form-item label="盈利率%" prop="profit_rate">
        <el-input-number v-model="formData.profit_rate" placeholder="请输入盈利率%" :min="0" :max="100" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="table.visible.value[0] = false">取消</el-button>
      <el-button type="primary" @click="submithandler" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type TimeForm } from "@/api/system/instantContractSetting";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";
import { FormInstance } from "element-plus";
import { parserHandler } from "@/utils/index";
const visible = defineModel<boolean>();
const title = ref<string>("");
watch(visible, (val) => {
  if (val) {
    title.value = "充值配置";
  }
});
const formRef = ref<FormInstance>();
const table = new TableInstance<TimeForm>(api, {}, 20);

const dialogTitle = ref("");
const formData = reactive<TimeForm>({});
watch(
  () => unref(table.visible)[0],
  (val) => {
    if (val) {
      nextTick(() => {
        if (unref(table.currentData)) {
          Object.assign(formData, unref(table.currentData));
          dialogTitle.value = "编辑";
        } else {
          dialogTitle.value = "新增";
          Object.assign(formData, { id: undefined, status: 1 });
        }
      });
    } else {
      unref(formRef)!.resetFields();
      unref(formRef)!.clearValidate();
    }
  }
);
const rules = {
  second: [{ required: true, message: "请输入时间秒", trigger: "blur" }],
  min_amount: [{ required: true, message: "请输入最小投资金额", trigger: "blur" }],
  profit_rate: [{ required: true, message: "请输入盈利率%", trigger: "blur" }],
};
const loading = ref(false);
async function submithandler() {
  const res = await unref(formRef)!.validate();
  if (res) {
    loading.value = true;
    try {
      if (table.currentData.value) await api.edit(formData);
      else await api.add(formData);
    } finally {
      loading.value = false;
    }
    table.visible.value[0] = false;
    table.queryHandler();
  }
}

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
